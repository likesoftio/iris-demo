from __future__ import annotations

import csv
import hashlib
import io
import json
import re
import ssl
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
OUTPUT_TS = ROOT / "demo" / "src" / "data" / "irisDataset.ts"

SHEET_URL = "https://docs.google.com/spreadsheets/d/1yB6UzteAriAt6NruoMadX1sELgSDMl3AnYs8NkHdNJA/edit?usp=sharing"
MAX_CALLS = 240

OUTCOME_COLORS = {
    "Сделка": "#7fe3c5",
    "Без сделки": "#ff8e7a",
    "Follow-up": "#f6c667",
    "Сервис": "#6bc6ff",
}

MONTHS_RU = {
    1: "янв",
    2: "фев",
    3: "мар",
    4: "апр",
    5: "май",
    6: "июн",
    7: "июл",
    8: "авг",
    9: "сен",
    10: "окт",
    11: "ноя",
    12: "дек",
}


@dataclass
class IrisCall:
    row_id: str
    call_id: str
    dt: datetime
    operator_name: str
    operator_speaker: int
    client_name: str
    duration_sec: int
    call_type: str
    outcome: str
    risk_level: str
    score: int
    error_type: str
    key_phrases: list[str]
    quality_flags: list[str]
    transcript_lines: list[dict]
    raw_text: str


def parse_sheet_key(url: str) -> tuple[str, str | None]:
    file_key_match = re.search(r"/spreadsheets/d/([a-zA-Z0-9-_]+)", url)
    if not file_key_match:
        raise ValueError("Не удалось извлечь fileKey из ссылки Google Sheets")

    parsed = urllib.parse.urlparse(url)
    query = urllib.parse.parse_qs(parsed.query)
    gid = query.get("gid", [None])[0]
    return file_key_match.group(1), gid


def fetch_sheet_rows() -> list[dict[str, str]]:
    file_key, gid = parse_sheet_key(SHEET_URL)
    if gid:
        export_url = f"https://docs.google.com/spreadsheets/d/{file_key}/export?format=csv&gid={gid}"
    else:
        export_url = f"https://docs.google.com/spreadsheets/d/{file_key}/export?format=csv"
    context = ssl._create_unverified_context()
    response = urllib.request.urlopen(export_url, timeout=30, context=context)
    content = response.read().decode("utf-8", errors="replace")
    reader = csv.DictReader(io.StringIO(content))
    return [dict(row) for row in reader]


def format_date_ru(dt: datetime) -> str:
    month = MONTHS_RU[dt.month]
    return f"{dt.day:02d} {month}, {dt.hour:02d}:{dt.minute:02d}"


def safe_hash(value: str, length: int = 8) -> str:
    return hashlib.sha1(value.encode("utf-8")).hexdigest()[:length]


def parse_datetime(value: str) -> datetime:
    if not value:
        return datetime(2026, 1, 1, 12, 0, 0)
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%dT%H:%M:%S"):
        try:
            return datetime.strptime(value.strip(), fmt)
        except ValueError:
            pass
    return datetime(2026, 1, 1, 12, 0, 0)


def parse_duration(value: str) -> int:
    try:
        seconds = int(float(value))
    except (TypeError, ValueError):
        seconds = 0
    return max(12, seconds)


def parse_transcript(diarized: str, fallback_raw: str, duration_sec: int) -> list[dict]:
    lines: list[dict] = []
    pattern = re.compile(r"Спикер\s+(\d+)\s+\[(\d{2}):(\d{2})\.\d+\]:\s*(.+)")
    for raw_line in diarized.splitlines():
        match = pattern.match(raw_line.strip())
        if not match:
            continue
        speaker_idx = int(match.group(1))
        start_sec = int(match.group(2)) * 60 + int(match.group(3))
        text = match.group(4).strip()
        if not text:
            continue
        lines.append(
            {
                "speakerIndex": speaker_idx,
                "speaker": "operator",
                "text": text,
                "startSec": start_sec,
            }
        )

    if lines:
        return lines

    chunks = [chunk.strip() for chunk in re.split(r"[.!?]\s+", fallback_raw) if chunk.strip()]
    if not chunks:
        chunks = ["Диалог не распознан"]
    step = max(4, duration_sec // max(1, len(chunks)))
    for idx, chunk in enumerate(chunks[:12]):
        lines.append(
            {
                "speakerIndex": 0,
                "speaker": "operator",
                "text": chunk,
                "startSec": idx * step,
            }
        )
    return lines


def detect_operator_speaker(lines: list[dict], raw_text: str) -> int:
    if len({line["speakerIndex"] for line in lines}) == 1:
        return 0
    speaker_score = defaultdict(int)
    cues = ("клиника", "подтвержд", "запис", "прием", "операци", "доктор", "подскаж")
    for line in lines:
        lowered = line["text"].lower()
        speaker_score[line["speakerIndex"]] += sum(1 for cue in cues if cue in lowered)
        if "?" in line["text"]:
            speaker_score[line["speakerIndex"]] += 1
    if not speaker_score:
        return 0
    return max(speaker_score.items(), key=lambda item: item[1])[0]


def extract_operator_name(full_text: str, fallback_idx: int) -> str:
    match = re.search(r"меня\s+зовут\s+([А-ЯA-Z][а-яa-z]+)", full_text, re.IGNORECASE)
    if match:
        return match.group(1).capitalize()
    base = ["Анна", "Татьяна", "Ольга", "Мария", "Елена", "Ирина"]
    return base[fallback_idx % len(base)]


def extract_client_name(full_text: str, row_id: str) -> str:
    match = re.search(r"([А-ЯA-Z][а-яa-z]+)\s+([А-ЯA-Z][а-яa-z]+)(?:\s+[А-ЯA-Z][а-яa-z]+)?", full_text)
    if match:
        return f"{match.group(1)} {match.group(2)}"
    return f"Пациент {row_id[-4:]}"


def detect_call_type(full_text: str, duration_sec: int, line_count: int) -> str:
    lowered = full_text.lower()
    if duration_sec < 25 or line_count < 3:
        return "short_technical"
    if any(token in lowered for token in ("внутрен", "операционн блок", "коллег", "между отдел", "касса")):
        return "internal"
    if any(token in lowered for token in ("жалоб", "не устро", "претенз", "недоволь")):
        return "complaint"
    if any(token in lowered for token in ("коррекц", "операц", "прием", "диагностик", "осмотр", "анализ")):
        return "service"
    return "sales_inbound"


def detect_outcome(call_type: str, full_text: str) -> str:
    lowered = full_text.lower()
    if call_type in ("internal", "short_technical"):
        return "Сервис"
    if any(token in lowered for token in ("запланирован", "записан", "будем ждать", "подтвержда")):
        return "Сделка"
    if any(token in lowered for token in ("перезвон", "подума", "позже", "уточню")):
        return "Follow-up"
    if call_type == "complaint":
        return "Без сделки"
    return "Сервис"


def extract_key_phrases(full_text: str) -> list[str]:
    lowered = full_text.lower()
    dictionary = [
        "коррекция зрения",
        "операционный блок",
        "подтверждение записи",
        "перезвон",
        "ватсап",
        "подготовка к операции",
        "врач",
        "стоимость",
        "диагностика",
        "контрольный визит",
    ]
    phrases = [token for token in dictionary if token in lowered]
    return phrases[:4] or ["рабочий диалог с пациентом"]


def calc_score_and_error(call_type: str, full_text: str, duration_sec: int, outcome: str) -> tuple[int, str, str]:
    lowered = full_text.lower()
    score = 84
    penalties: list[str] = []

    if call_type == "internal":
        score -= 35
        penalties.append("Внутренний нецелевой звонок")
    if call_type == "short_technical":
        score -= 20
        penalties.append("Слишком короткий звонок")
    if call_type == "complaint":
        score -= 15
        penalties.append("Негатив без снятия напряжения клиента")
    if duration_sec < 35:
        score -= 8
        penalties.append("Недостаточно контекста для качественного разбора")
    if "?" not in full_text:
        score -= 10
        penalties.append("Оператор не уточнил детали вопроса")
    if not any(token in lowered for token in ("завтра", "в ", "подтверд", "перезвон", "ждем")):
        score -= 12
        penalties.append("Не зафиксирован следующий шаг")
    if outcome == "Сделка":
        score += 8
    if outcome == "Без сделки":
        score -= 10

    score = max(28, min(98, score))
    if score < 55 or outcome == "Без сделки":
        risk = "high"
    elif outcome == "Follow-up":
        risk = "medium"
    else:
        risk = "low"

    error = penalties[0] if penalties else "Критичных ошибок не выявлено"
    return score, risk, error


def build_scorecard(call: IrisCall) -> list[dict]:
    operator_lines = [line["text"] for line in call.transcript_lines if line["speaker"] == "operator"]
    client_lines = [line["text"] for line in call.transcript_lines if line["speaker"] == "client"]

    def quote(lines: list[str], fallback: str) -> str:
        return lines[0][:180] if lines else fallback

    return [
        {
            "id": "sc1",
            "label": "Приветствие и идентификация клиники",
            "passed": any("клиника" in text.lower() or "ирис" in text.lower() for text in operator_lines),
            "quote": quote(operator_lines, "Приветствие не зафиксировано"),
            "recommendation": "В первых репликах называйте клинику и цель звонка.",
        },
        {
            "id": "sc2",
            "label": "Уточнение контекста пациента",
            "passed": any("?" in text for text in operator_lines),
            "quote": quote(operator_lines, "Уточняющий вопрос не найден"),
            "recommendation": "Задавайте 1-2 уточняющих вопроса перед рекомендацией.",
        },
        {
            "id": "sc3",
            "label": "Эмпатия и спокойный тон",
            "passed": call.call_type != "complaint" or any("понима" in text.lower() for text in operator_lines),
            "quote": quote(client_lines, "Негативных триггеров не выявлено"),
            "recommendation": "На тревогу пациента отвечайте фразой поддержки и ясным планом.",
        },
        {
            "id": "sc4",
            "label": "Фиксация следующего шага",
            "passed": any(
                token in " ".join(operator_lines).lower()
                for token in ("завтра", "подтвержд", "перезвон", "напишу", "ждем")
            ),
            "quote": quote(operator_lines, "Следующий шаг не зафиксирован"),
            "recommendation": "Закрывайте звонок конкретным действием и временем.",
        },
        {
            "id": "sc5",
            "label": "Краткость и структурность",
            "passed": call.duration_sec < 240 and len(call.transcript_lines) <= 24,
            "quote": quote(operator_lines, "Структурный фрагмент не выделен"),
            "recommendation": "Держите разговор компактным: цель, проверка, итог.",
        },
        {
            "id": "sc6",
            "label": "Корректное закрытие диалога",
            "passed": call.outcome in ("Сделка", "Follow-up", "Сервис"),
            "quote": quote(operator_lines[-2:], "Финальное резюме не найдено"),
            "recommendation": "В конце повторите ключевые договоренности.",
        },
    ]


def normalize_row(row: dict[str, str], idx: int) -> IrisCall | None:
    diarized = (row.get("speakers_transcript") or "").strip()
    raw_text = (row.get("transcript_text") or "").strip()
    file_name = (row.get("file_name") or "").strip()

    if not diarized and not raw_text:
        return None
    if row.get("status") and row.get("status") != "completed":
        return None

    row_id = (row.get("id") or f"{idx + 1}").strip()
    dt = parse_datetime((row.get("processed_at") or row.get("created_at") or "").strip())
    duration_sec = parse_duration((row.get("duration") or "").strip())
    transcript_lines = parse_transcript(diarized, raw_text, duration_sec)
    operator_speaker = detect_operator_speaker(transcript_lines, raw_text or diarized)

    for line in transcript_lines:
        line["speaker"] = "operator" if line["speakerIndex"] == operator_speaker else "client"
        del line["speakerIndex"]

    full_text = "\n".join(line["text"] for line in transcript_lines) or raw_text
    call_type = detect_call_type(full_text, duration_sec, len(transcript_lines))
    outcome = detect_outcome(call_type, full_text)
    score, risk_level, error_type = calc_score_and_error(call_type, full_text, duration_sec, outcome)
    key_phrases = extract_key_phrases(full_text)

    quality_flags: list[str] = []
    if call_type == "short_technical":
        quality_flags.append("isShortTechnical")
    if call_type == "internal":
        quality_flags.append("isInternal")
    if len(full_text) < 120 or len(transcript_lines) < 3:
        quality_flags.append("hasLowTranscriptQuality")

    stable_base = f"{row_id}:{file_name}:{dt.isoformat()}"
    call_id = f"iris-{safe_hash(stable_base)}"
    operator_name = extract_operator_name(full_text, idx)
    client_name = extract_client_name(full_text, row_id)

    return IrisCall(
        row_id=row_id,
        call_id=call_id,
        dt=dt,
        operator_name=operator_name,
        operator_speaker=operator_speaker,
        client_name=client_name,
        duration_sec=duration_sec,
        call_type=call_type,
        outcome=outcome,
        risk_level=risk_level,
        score=score,
        error_type=error_type,
        key_phrases=key_phrases,
        quality_flags=quality_flags,
        transcript_lines=transcript_lines[:28],
        raw_text=full_text,
    )


def aggregate_dataset(calls: list[IrisCall]) -> dict:
    calls = sorted(calls, key=lambda call: call.dt, reverse=True)[:MAX_CALLS]
    operator_map: dict[str, list[IrisCall]] = defaultdict(list)
    for call in calls:
        operator_map[call.operator_name].append(call)

    operator_stats = []
    for idx, (operator, op_calls) in enumerate(
        sorted(operator_map.items(), key=lambda item: len(item[1]), reverse=True)
    ):
        converted = sum(1 for call in op_calls if call.outcome == "Сделка")
        avg_score = round(sum(call.score for call in op_calls) / max(1, len(op_calls)))
        trend = "up" if avg_score >= 76 else ("flat" if avg_score >= 62 else "down")
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

    op_id_map = {operator["name"]: operator["id"] for operator in operator_stats}
    calls_data = []
    transcripts = {}
    scorecard_by_call = {}
    for call in calls:
        calls_data.append(
            {
                "id": call.call_id,
                "date": format_date_ru(call.dt),
                "operator": call.operator_name,
                "operatorId": op_id_map.get(call.operator_name, "op1"),
                "duration": f"{call.duration_sec // 60}:{call.duration_sec % 60:02d}",
                "durationSec": call.duration_sec,
                "score": call.score,
                "outcome": call.outcome,
                "riskLevel": call.risk_level,
                "errorType": call.error_type,
                "phone": f"+7 *** ***-{int(call.row_id) % 100:02d}",
                "clientName": call.client_name,
                "keyPhrases": call.key_phrases,
                "callType": call.call_type,
                "qualityFlags": call.quality_flags,
            }
        )
        transcripts[call.call_id] = call.transcript_lines
        scorecard_by_call[call.call_id] = build_scorecard(call)

    total_calls = len(calls_data)
    avg_score = round(sum(call["score"] for call in calls_data) / max(1, total_calls))
    outcome_counter = Counter(call["outcome"] for call in calls_data)
    deals = outcome_counter.get("Сделка", 0)
    follow_up = outcome_counter.get("Follow-up", 0)
    risky_calls = sum(1 for call in calls_data if call["riskLevel"] == "high")

    kpi_cards = [
        {
            "id": "kpi1",
            "label": "Всего звонков",
            "value": f"{total_calls}",
            "delta": "+5% vs пр. период",
            "deltaPositive": True,
            "tone": "primary",
            "description": "Обработанные звонки колл-центра Iris",
        },
        {
            "id": "kpi2",
            "label": "Конверсия в запись",
            "value": f"{round(deals * 100 / max(1, total_calls))}%",
            "delta": "+1.6 пп vs пр. период",
            "deltaPositive": True,
            "tone": "success",
            "description": "Доля звонков с подтвержденным визитом",
        },
        {
            "id": "kpi3",
            "label": "Рисковые звонки",
            "value": f"{risky_calls}",
            "delta": "-4% vs пр. период",
            "deltaPositive": True,
            "tone": "risk",
            "description": "Звонки с повышенным риском потери пациента",
        },
        {
            "id": "kpi4",
            "label": "Средний балл",
            "value": f"{avg_score} / 100",
            "delta": "+2 балла vs пр. период",
            "deltaPositive": True,
            "tone": "warning",
            "description": "Оценка стандарта коммуникации оператора",
        },
    ]

    ordered = sorted(calls, key=lambda call: call.dt)
    trend_series = []
    for idx in range(0, len(ordered), 15):
        chunk = ordered[idx : idx + 15]
        trend_series.append(
            {
                "week": f"W{len(trend_series) + 1}",
                "calls": len(chunk),
                "converted": sum(1 for call in chunk if call.outcome == "Сделка"),
                "lost": sum(1 for call in chunk if call.outcome == "Без сделки"),
            }
        )

    outcome_distribution = [
        {
            "label": label,
            "value": round(value * 100 / max(1, total_calls)),
            "color": OUTCOME_COLORS[label],
        }
        for label, value in outcome_counter.items()
    ]

    hourly_counter = Counter(call.dt.hour for call in calls)
    hourly_distribution = [{"hour": hour, "calls": hourly_counter.get(hour, 0)} for hour in range(8, 21)]

    day_counter = Counter((call.dt.day, call.dt.month) for call in calls)
    daily_trends = []
    for (day, month), count in sorted(day_counter.items()):
        day_calls = [call for call in calls if call.dt.day == day and call.dt.month == month]
        conversion = round(sum(1 for call in day_calls if call.outcome == "Сделка") * 100 / max(1, len(day_calls)))
        daily_trends.append({"day": f"{day:02d} {MONTHS_RU[month]}", "calls": count, "conversion": conversion})

    conversion_funnel = [
        {"stage": "Звонков", "count": total_calls},
        {
            "stage": "Контакт с пациентом",
            "count": total_calls - sum(1 for call in calls if call.call_type == "short_technical"),
        },
        {"stage": "Есть следующий шаг", "count": deals + follow_up},
        {"stage": "Подтвержден визит", "count": deals},
    ]

    error_counter = Counter(
        call.error_type
        for call in calls
        if call.error_type and call.error_type != "Критичных ошибок не выявлено"
    )
    top_errors = error_counter.most_common(6)
    error_patterns = [
        {
            "id": f"ep{index + 1}",
            "label": label,
            "percent": round(count * 100 / max(1, total_calls)),
        }
        for index, (label, count) in enumerate(top_errors)
    ] or [{"id": "ep1", "label": "Критичных ошибок не выявлено", "percent": 0}]

    coaching_priorities = [
        {
            "id": f"cp{index + 1}",
            "title": label,
            "description": f"Паттерн встречается в {round(count * 100 / max(1, total_calls))}% звонков. Нужна быстрая отработка в микротренировках.",
            "progress": round(count * 100 / max(1, total_calls)),
            "impact": "high" if index < 2 else "medium",
            "operators": [operator["name"] for operator in operator_stats[:3]],
        }
        for index, (label, count) in enumerate(top_errors[:3])
    ]

    speech_templates = [
        {
            "id": "st1",
            "situation": "Пациент волнуется перед операцией",
            "before": "«Всё будет нормально, не переживайте.»",
            "after": "«Понимаю ваше волнение. Давайте коротко пройдем по шагам подготовки и времени приезда.»",
            "improvement": "Снижает тревожность и повышает вероятность доходимости до визита",
        },
        {
            "id": "st2",
            "situation": "Пациент просит перенести контакт",
            "before": "«Хорошо, тогда сами свяжитесь позже.»",
            "after": "«Зафиксирую follow-up: я напишу вам в WhatsApp в 16:00 и подтвержу удобное время.»",
            "improvement": "Удерживает диалог и улучшает контроль следующего шага",
        },
    ]

    operator_profiles = []
    for operator in operator_stats[:4]:
        operator_profiles.append(
            {
                "id": operator["id"],
                "name": operator["name"],
                "avatar": "".join(part[0] for part in operator["name"].split()[:2]).upper(),
                "score": operator["score"],
                "calls": operator["calls"],
                "strengths": ["Структурная подача информации", "Подтверждение следующего шага"],
                "growthPoints": ["Больше уточняющих вопросов", "Эмпатия в жалобах"],
                "trend": 2 if operator["trend"] == "up" else (-2 if operator["trend"] == "down" else 0),
            }
        )

    performance_metrics = [
        {"subject": "Приветствие", "value": min(100, avg_score + 6), "fullMark": 100},
        {"subject": "Уточнение контекста", "value": avg_score, "fullMark": 100},
        {"subject": "Эмпатия", "value": max(40, avg_score - 10), "fullMark": 100},
        {"subject": "Следующий шаг", "value": max(35, avg_score - 7), "fullMark": 100},
        {"subject": "Тон", "value": min(100, avg_score + 4), "fullMark": 100},
        {"subject": "Закрытие", "value": max(42, avg_score - 5), "fullMark": 100},
    ]

    weekly_checklist = [
        {"id": "cl1", "text": "Разобрать 12 звонков с жалобами пациентов", "category": "Разбор"},
        {"id": "cl2", "text": "Закрепить формулу подтверждения записи", "category": "Процесс"},
        {"id": "cl3", "text": "Провести тренировку эмпатичных формулировок", "category": "Обучение"},
        {"id": "cl4", "text": "Проверить выполнение follow-up в WhatsApp", "category": "Мониторинг"},
        {"id": "cl5", "text": "Сверить scorecard с регламентом колл-центра", "category": "Контроль качества"},
    ]

    return {
        "companyMeta": {
            "id": "company_b",
            "name": "Iris",
            "subtitle": "Офтальмологическая клиника: входящие и сервисные звонки",
            "periodLabel": "Актуальный срез звонков Iris",
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
    rows = fetch_sheet_rows()
    normalized = [normalize_row(row, index) for index, row in enumerate(rows)]
    calls = [call for call in normalized if call is not None]
    dataset = aggregate_dataset(calls)

    content = (
        "/* Auto-generated by scripts/build_iris_dataset.py */\n"
        "import type { CompanyDataset } from './types'\n\n"
        "export const irisDataset: CompanyDataset = "
        + json.dumps(dataset, ensure_ascii=False, indent=2)
        + "\n"
    )
    OUTPUT_TS.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_TS.write_text(content, encoding="utf-8")
    print(f"Generated {OUTPUT_TS} with {len(calls)} normalized rows")


if __name__ == "__main__":
    main()
