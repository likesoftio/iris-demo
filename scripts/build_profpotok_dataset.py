from __future__ import annotations

import json
import re
import zipfile
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
TRANSCRIPTS_ZIP = ROOT / "transcripts_speakers.zip"
CONFIGS_ZIP = ROOT / "configs.zip"
OUTPUT_TS = ROOT / "demo" / "src" / "data" / "profpotokDataset.ts"

OUTCOME_COLORS = {
    "Сделка": "#7fe3c5",
    "Без сделки": "#ff8e7a",
    "Follow-up": "#f6c667",
    "Сервис": "#6bc6ff",
}


@dataclass
class ParsedCall:
    file_name: str
    call_id: str
    dt: datetime
    speaker_lines: list[tuple[str, str]]
    entities: list[str]
    quality_flags: list[str]
    operator_speaker: str
    operator_name: str
    client_name: str
    call_type: str
    outcome: str
    risk_level: str
    score: int
    error_type: str
    key_phrases: list[str]
    duration_sec: int


def safe_slug(value: str) -> str:
    return re.sub(r"[^a-zA-Z0-9]+", "-", value).strip("-").lower()


def parse_transcript(raw_text: str) -> tuple[list[tuple[str, str]], list[str]]:
    lines = raw_text.splitlines()
    speaker_lines: list[tuple[str, str]] = []
    entities: list[str] = []
    in_entities = False
    for line in lines:
        if line.strip() == "--- ENTITIES ---":
            in_entities = True
            continue
        if in_entities:
            if line.strip().startswith("- "):
                entities.append(line.strip()[2:])
            continue
        m = re.match(r"^Speaker\s+([A-Z]):\s*(.*)$", line.strip())
        if m:
            speaker_lines.append((m.group(1), m.group(2).strip()))
    return speaker_lines, entities


def choose_primary_files(zip_file: zipfile.ZipFile, txt_names: list[str]) -> list[str]:
    by_base: dict[str, list[str]] = defaultdict(list)
    for name in txt_names:
        pure = Path(name).name
        base = re.sub(r"_1(?=\.txt$)", "", pure)
        by_base[base].append(name)

    selected: list[str] = []
    for _, candidates in by_base.items():
        if len(candidates) == 1:
            selected.append(candidates[0])
            continue

        scored = []
        for candidate in candidates:
            content = zip_file.read(candidate).decode("utf-8", errors="replace")
            speaker_lines, _ = parse_transcript(content)
            counts = Counter(s for s, _ in speaker_lines)
            parts = sorted(counts.values(), reverse=True) or [1]
            if len(parts) == 1:
                parts.append(0)
            balance = abs(parts[0] - parts[1])
            scored.append((balance, -len(content), candidate))
        scored.sort()
        selected.append(scored[0][2])
    return sorted(selected)


def detect_operator_speaker(speaker_lines: list[tuple[str, str]]) -> str:
    speaker_scores = defaultdict(int)
    cues = (
        "компания",
        "цена",
        "наличи",
        "заказ",
        "поставк",
        "предлож",
        "скидк",
        "смет",
        "отгруз",
    )
    for sp, text in speaker_lines:
        lowered = text.lower()
        speaker_scores[sp] += sum(1 for cue in cues if cue in lowered)
    if not speaker_scores:
        return "A"
    return max(speaker_scores.items(), key=lambda item: item[1])[0]


def detect_internal(full_text: str) -> bool:
    lowered = full_text.lower()
    internal_tokens = ("пароль", "почт", "телеграм", "логин", "подпись", "аккаунт")
    sales_tokens = ("цен", "налич", "заказ", "отгруз", "скидк", "товар", "бренд")
    return sum(token in lowered for token in internal_tokens) >= 2 and sum(
        token in lowered for token in sales_tokens
    ) == 0


def detect_call_type(full_text: str, speaker_lines: list[tuple[str, str]], is_internal: bool) -> str:
    lowered = full_text.lower()
    if is_internal:
        return "internal"
    if len(speaker_lines) < 5:
        return "short_technical"
    if any(word in lowered for word in ("жалоб", "претенз", "не ответили", "долго отвечали")):
        return "complaint"
    if any(word in lowered for word in ("доставк", "накладн", "оплат", "статус")):
        return "service"
    if any(word in lowered for word in ("раньше", "повтор", "снова", "как в прошлый")):
        return "repeat_order"
    if any(word in lowered for word in ("и еще", "кстати", "дополнительно")):
        return "mixed"
    return "sales_inbound"


def extract_operator_name(full_text: str, fallback_idx: int) -> str:
    m = re.search(r"меня\s+зовут\s+([А-ЯA-Z][а-яa-z]+)", full_text, re.IGNORECASE)
    if m:
        return m.group(1).capitalize()
    return f"Менеджер {fallback_idx % 6 + 1}"


def detect_outcome(call_type: str, full_text: str) -> str:
    lowered = full_text.lower()
    if call_type in ("internal", "service", "short_technical"):
        return "Сервис"
    if any(word in lowered for word in ("оформ", "выставлю", "счет", "отгрузим", "договорились")):
        return "Сделка"
    if any(word in lowered for word in ("перезвон", "подума", "позже", "напишу")):
        return "Follow-up"
    return "Без сделки"


def calc_score(call_type: str, full_text: str, speaker_lines: list[tuple[str, str]], outcome: str) -> tuple[int, str, str]:
    lowered = full_text.lower()
    score = 82
    penalties = []

    price_objection = any(word in lowered for word in ("дорого", "цена"))
    next_step = any(word in lowered for word in ("перезвон", "напишу", "счет", "зафикс", "договорились"))
    has_offer = any(word in lowered for word in ("предлож", "могу", "альтернатив"))

    if call_type == "internal":
        score = 35
        penalties.append("Внутренний нецелевой звонок")
    if call_type == "short_technical":
        score -= 18
        penalties.append("Слишком короткий звонок")
    if call_type == "complaint":
        score -= 10
        penalties.append("Клиентская жалоба")
    if price_objection and not has_offer:
        score -= 18
        penalties.append("Нет отработки ценового возражения")
    if not next_step:
        score -= 14
        penalties.append("Не зафиксирован следующий шаг")
    if outcome == "Сделка":
        score += 12
    if outcome == "Без сделки":
        score -= 8

    score = max(25, min(99, score))

    if score < 55 or (outcome == "Без сделки" and price_objection):
        risk = "high"
    elif outcome == "Follow-up":
        risk = "medium"
    else:
        risk = "low"

    error = penalties[0] if penalties else "Критичных ошибок не выявлено"
    return score, risk, error


def extract_key_phrases(full_text: str) -> list[str]:
    lowered = full_text.lower()
    phrases = []
    dictionary = [
        "цена",
        "скидка",
        "наличие",
        "срок поставки",
        "доставка",
        "перезвон",
        "подумаю",
        "возражение",
        "счет",
        "отгрузка",
    ]
    for token in dictionary:
        if token in lowered:
            phrases.append(token)
    return phrases[:4] or ["обсуждение заказа"]


def make_scorecard(call: ParsedCall) -> list[dict]:
    operator_quotes = [text for sp, text in call.speaker_lines if sp == call.operator_speaker]
    client_quotes = [text for sp, text in call.speaker_lines if sp != call.operator_speaker]

    def quote(source: list[str], fallback: str) -> str:
        return source[0][:180] if source else fallback

    return [
        {
            "id": "sc1",
            "label": "Приветствие и идентификация",
            "passed": any("компания" in q.lower() for q in operator_quotes),
            "quote": quote(operator_quotes, "Приветствие не зафиксировано"),
            "recommendation": "Называйте компанию и имя в первых репликах.",
        },
        {
            "id": "sc2",
            "label": "Выявление задачи клиента",
            "passed": any("?" in q for q in operator_quotes),
            "quote": quote(operator_quotes, "Уточняющие вопросы не обнаружены"),
            "recommendation": "Задавайте 1-2 уточняющих вопроса до предложения решения.",
        },
        {
            "id": "sc3",
            "label": "Работа с возражениями",
            "passed": "дорого" not in " ".join(client_quotes).lower()
            or any("альтернатив" in q.lower() or "скидк" in q.lower() for q in operator_quotes),
            "quote": quote(client_quotes, "Явных возражений не найдено"),
            "recommendation": "На возражение по цене давайте аргумент + альтернативу.",
        },
        {
            "id": "sc4",
            "label": "Следующий шаг",
            "passed": any(
                token in " ".join(operator_quotes).lower()
                for token in ("счет", "перезвон", "договор", "напишу", "отгруз")
            ),
            "quote": quote(operator_quotes, "Следующий шаг не зафиксирован"),
            "recommendation": "Завершайте звонок конкретным действием и сроком.",
        },
        {
            "id": "sc5",
            "label": "Деловой стиль общения",
            "passed": call.call_type != "complaint" or "извин" in " ".join(operator_quotes).lower(),
            "quote": quote(operator_quotes, "Деловой стиль требует уточнения"),
            "recommendation": "Сохраняйте нейтральный, уверенный тон и короткие формулировки.",
        },
        {
            "id": "sc6",
            "label": "Закрытие диалога",
            "passed": call.outcome in ("Сделка", "Follow-up"),
            "quote": quote(operator_quotes[-2:], "Закрытие звонка не зафиксировано"),
            "recommendation": "Резюмируйте договоренности и подтвердите ответственность.",
        },
    ]


def parse_datetime_from_filename(name: str) -> datetime:
    m = re.search(r"_(\d{4}-\d{2}-\d{2})_(\d{2})-(\d{2})-(\d{2})", name)
    if not m:
        return datetime(2026, 4, 1, 12, 0, 0)
    return datetime.strptime(f"{m.group(1)} {m.group(2)}:{m.group(3)}:{m.group(4)}", "%Y-%m-%d %H:%M:%S")


def build_calls() -> list[ParsedCall]:
    parsed_calls: list[ParsedCall] = []
    with zipfile.ZipFile(TRANSCRIPTS_ZIP) as zf:
        txt_names = [n for n in zf.namelist() if n.endswith(".txt")]
        selected_names = choose_primary_files(zf, txt_names)

        for idx, name in enumerate(selected_names):
            raw_text = zf.read(name).decode("utf-8", errors="replace")
            speaker_lines, entities = parse_transcript(raw_text)
            if not speaker_lines:
                continue

            dt = parse_datetime_from_filename(name)
            stem = Path(name).stem
            call_id = f"{safe_slug(stem)[:18]}-{abs(hash(stem)) % 10000:04d}"
            operator_speaker = detect_operator_speaker(speaker_lines)
            is_internal = detect_internal(raw_text)
            call_type = detect_call_type(raw_text, speaker_lines, is_internal)
            operator_name = extract_operator_name(raw_text, idx)
            outcome = detect_outcome(call_type, raw_text)
            score, risk_level, error_type = calc_score(call_type, raw_text, speaker_lines, outcome)
            key_phrases = extract_key_phrases(raw_text)

            quality_flags: list[str] = []
            if call_type == "internal":
                quality_flags.append("isInternal")
            if len(speaker_lines) < 5:
                quality_flags.append("isShortTechnical")
            if re.search(r"_1\.txt$", name):
                quality_flags.append("isDuplicateChannel")
            if len(raw_text) < 250:
                quality_flags.append("hasLowTranscriptQuality")

            parsed_calls.append(
                ParsedCall(
                    file_name=Path(name).name,
                    call_id=call_id,
                    dt=dt,
                    speaker_lines=speaker_lines,
                    entities=entities,
                    quality_flags=quality_flags,
                    operator_speaker=operator_speaker,
                    operator_name=operator_name,
                    client_name=f"Контакт {Path(name).stem[-4:]}",
                    call_type=call_type,
                    outcome=outcome,
                    risk_level=risk_level,
                    score=score,
                    error_type=error_type,
                    key_phrases=key_phrases,
                    duration_sec=max(25, len(speaker_lines) * 9),
                )
            )
    return sorted(parsed_calls, key=lambda c: c.dt, reverse=True)


def build_dataset() -> dict:
    calls = build_calls()
    operator_map: dict[str, list[ParsedCall]] = defaultdict(list)
    for call in calls:
        operator_map[call.operator_name].append(call)

    operator_stats = []
    for idx, (operator, op_calls) in enumerate(sorted(operator_map.items(), key=lambda item: len(item[1]), reverse=True)):
        converted = sum(1 for c in op_calls if c.outcome == "Сделка")
        avg_score = round(sum(c.score for c in op_calls) / len(op_calls))
        trend = "up" if avg_score >= 70 else ("flat" if avg_score >= 55 else "down")
        operator_stats.append(
            {
                "id": f"op{idx + 1}",
                "name": operator,
                "calls": len(op_calls),
                "score": avg_score,
                "converted": converted,
                "trend": trend,
            }
        )

    op_id_map = {op["name"]: op["id"] for op in operator_stats}
    calls_data = []
    transcripts = {}
    scorecard_by_call = {}
    for call in calls:
        calls_data.append(
            {
                "id": call.call_id,
                "date": call.dt.strftime("%d %b, %H:%M").replace("Apr", "апр").replace("Mar", "мар").replace("Feb", "фев"),
                "operator": call.operator_name,
                "operatorId": op_id_map.get(call.operator_name, "op1"),
                "duration": f"{call.duration_sec // 60}:{call.duration_sec % 60:02d}",
                "durationSec": call.duration_sec,
                "score": call.score,
                "outcome": call.outcome,
                "riskLevel": call.risk_level,
                "errorType": call.error_type,
                "phone": f"+7 *** ***-{abs(hash(call.file_name)) % 100:02d}",
                "clientName": call.client_name,
                "keyPhrases": call.key_phrases,
                "callType": call.call_type,
                "qualityFlags": call.quality_flags,
            }
        )

        transcript_lines = []
        for i, (speaker, text) in enumerate(call.speaker_lines[:20]):
            transcript_lines.append(
                {
                    "speaker": "operator" if speaker == call.operator_speaker else "client",
                    "text": text,
                    "startSec": i * 8,
                }
            )
        transcripts[call.call_id] = transcript_lines
        scorecard_by_call[call.call_id] = make_scorecard(call)

    outcome_counter = Counter(c["outcome"] for c in calls_data)
    total_calls = len(calls_data)
    deals = outcome_counter.get("Сделка", 0)
    follow_ups = outcome_counter.get("Follow-up", 0)
    lost = outcome_counter.get("Без сделки", 0)
    risky_calls = sum(1 for c in calls_data if c["riskLevel"] == "high")
    avg_score = round(sum(c["score"] for c in calls_data) / max(1, total_calls))

    kpi_cards = [
        {
            "id": "kpi1",
            "label": "Всего звонков",
            "value": f"{total_calls}",
            "delta": "+7% vs пр. период",
            "deltaPositive": True,
            "tone": "primary",
            "description": "Все обработанные звонки Профпоток",
        },
        {
            "id": "kpi2",
            "label": "Конверсия в сделку",
            "value": f"{round(deals * 100 / max(1, total_calls))}%",
            "delta": "+2.4 пп vs пр. период",
            "deltaPositive": True,
            "tone": "success",
            "description": "Доля звонков с подтвержденным следующим шагом",
        },
        {
            "id": "kpi3",
            "label": "Рисковые звонки",
            "value": f"{risky_calls}",
            "delta": "-5% vs пр. период",
            "deltaPositive": True,
            "tone": "risk",
            "description": "Высокий риск потери клиента по качеству диалога",
        },
        {
            "id": "kpi4",
            "label": "Средний балл",
            "value": f"{avg_score} / 100",
            "delta": "+3 балла vs пр. период",
            "deltaPositive": True,
            "tone": "warning",
            "description": "Оценка операторского поведения по критериям",
        },
    ]

    sorted_calls = sorted(calls_data, key=lambda c: c["date"])
    trend_series = []
    for i in range(0, len(sorted_calls), 12):
        chunk = sorted_calls[i : i + 12]
        trend_series.append(
            {
                "week": f"W{len(trend_series) + 1}",
                "calls": len(chunk),
                "converted": sum(1 for c in chunk if c["outcome"] == "Сделка"),
                "lost": sum(1 for c in chunk if c["outcome"] == "Без сделки"),
            }
        )

    outcome_distribution = [
        {"label": label, "value": round(value * 100 / max(1, total_calls)), "color": OUTCOME_COLORS[label]}
        for label, value in outcome_counter.items()
    ]

    hourly = Counter(parse_datetime_from_filename(c.file_name).hour for c in calls)
    hourly_distribution = [{"hour": h, "calls": hourly.get(h, 0)} for h in range(8, 20)]

    day_counter = Counter(parse_datetime_from_filename(c.file_name).strftime("%d %b").replace("Apr", "апр").replace("Mar", "мар") for c in calls)
    daily_trends = []
    for day, count in sorted(day_counter.items()):
        day_calls = [c for c in calls_data if c["date"].startswith(day.split()[0])]
        day_conv = round(sum(1 for c in day_calls if c["outcome"] == "Сделка") * 100 / max(1, len(day_calls)))
        daily_trends.append({"day": day, "calls": count, "conversion": day_conv})

    conversion_funnel = [
        {"stage": "Звонков", "count": total_calls},
        {"stage": "Диалог состоялся", "count": total_calls - sum(1 for c in calls_data if c["callType"] == "short_technical")},
        {"stage": "Есть следующий шаг", "count": deals + follow_ups},
        {"stage": "Сделка", "count": deals},
    ]

    error_counter = Counter(c["errorType"] for c in calls_data if c["errorType"] and c["errorType"] != "Критичных ошибок не выявлено")
    top_errors = error_counter.most_common(6)
    error_patterns = [
        {"id": f"ep{i + 1}", "label": label, "percent": round(count * 100 / max(1, total_calls))}
        for i, (label, count) in enumerate(top_errors)
    ] or [{"id": "ep1", "label": "Критичных ошибок не выявлено", "percent": 0}]

    coaching_priorities = [
        {
            "id": f"cp{i + 1}",
            "title": label,
            "description": f"Проблема встречается в {round(count * 100 / max(1, total_calls))}% звонков. Требуется закрепить стандарт обработки.",
            "progress": round(count * 100 / max(1, total_calls)),
            "impact": "high" if i < 2 else "medium",
            "operators": [op["name"] for op in operator_stats[:3]],
        }
        for i, (label, count) in enumerate(top_errors[:3])
    ]

    speech_templates = [
        {
            "id": "st1",
            "situation": "Клиент говорит «дорого»",
            "before": "«Понимаю, тогда смотрите сами.»",
            "after": "«Понимаю вопрос по цене. Давайте предложу альтернативу и сравнение по сроку поставки.»",
            "improvement": "Увеличивает шанс сохранить диалог и зафиксировать следующий шаг",
        },
        {
            "id": "st2",
            "situation": "Клиент откладывает решение",
            "before": "«Хорошо, перезвоните когда решите.»",
            "after": "«Давайте зафиксируем follow-up: я напишу вам сегодня и подтвержу актуальное наличие.»",
            "improvement": "Снижает долю потерянных лидов на этапе «подумаю»",
        },
    ]

    operator_profiles = []
    for op in operator_stats[:4]:
        operator_profiles.append(
            {
                "id": op["id"],
                "name": op["name"],
                "avatar": "".join(word[0] for word in op["name"].split()[:2]).upper(),
                "score": op["score"],
                "calls": op["calls"],
                "strengths": ["Деловой тон", "Стабильная структура диалога"],
                "growthPoints": ["Фиксация следующего шага", "Отработка ценовых возражений"],
                "trend": 2 if op["trend"] == "up" else (-2 if op["trend"] == "down" else 0),
            }
        )

    performance_metrics = [
        {"subject": "Приветствие", "value": min(100, avg_score + 8), "fullMark": 100},
        {"subject": "Потребность", "value": avg_score, "fullMark": 100},
        {"subject": "Возражения", "value": max(35, avg_score - 12), "fullMark": 100},
        {"subject": "Следующий шаг", "value": max(30, avg_score - 10), "fullMark": 100},
        {"subject": "Тон", "value": min(100, avg_score + 5), "fullMark": 100},
        {"subject": "Закрытие", "value": max(40, avg_score - 8), "fullMark": 100},
    ]

    weekly_checklist = [
        {"id": "cl1", "text": "Разобрать 10 звонков с ценовыми возражениями", "category": "Разбор"},
        {"id": "cl2", "text": "Обновить скрипт фиксации следующего шага", "category": "Процесс"},
        {"id": "cl3", "text": "Провести тренировку по альтернативным предложениям", "category": "Обучение"},
        {"id": "cl4", "text": "Проверить follow-up по отложенным лидам", "category": "Мониторинг"},
        {"id": "cl5", "text": "Сверить scorecard с критериями Экватор", "category": "Контроль качества"},
    ]

    return {
        "companyMeta": {
            "id": "profpotok",
            "name": "Профпоток",
            "subtitle": "B2B продажи инженерной сантехники",
            "periodLabel": "Актуальный срез звонков",
            "isReady": True,
        },
        "kpiCards": kpi_cards,
        "trendSeries": trend_series,
        "outcomeDistribution": outcome_distribution,
        "operatorStats": operator_stats,
        "callsData": calls_data,
        "transcripts": transcripts,
        "hourlyDistribution": hourly_distribution,
        "conversionFunnel": conversion_funnel,
        "dailyTrends": daily_trends,
        "scorecardByCall": scorecard_by_call,
        "coachingPriorities": coaching_priorities,
        "speechTemplates": speech_templates,
        "operatorProfiles": operator_profiles,
        "errorPatterns": error_patterns,
        "performanceMetrics": performance_metrics,
        "weeklyChecklist": weekly_checklist,
    }


def main() -> None:
    dataset = build_dataset()
    content = (
        "/* Auto-generated by scripts/build_profpotok_dataset.py */\n"
        "import type { CompanyDataset } from './types'\n\n"
        "export const profpotokDataset: CompanyDataset = "
        + json.dumps(dataset, ensure_ascii=False, indent=2)
        + "\n"
    )
    OUTPUT_TS.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_TS.write_text(content, encoding="utf-8")
    print(f"Generated {OUTPUT_TS}")


if __name__ == "__main__":
    main()
