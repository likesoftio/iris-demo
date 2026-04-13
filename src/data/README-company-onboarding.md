# Company Onboarding Runbook

Этот гайд описывает, как подключить вторую компанию в текущий `demo` без переработки UI.

## Что уже реализовано

- Multi-company контракт данных: `src/data/types.ts`
- Каталог датасетов: `src/data/demoData.ts`
- Текущий подключённый датасет: `src/data/profpotokDataset.ts`
- Второй подключённый датасет: `src/data/irisDataset.ts`
- Автогенератор датасета из архивов: `scripts/build_profpotok_dataset.py`
- Автогенератор датасета из Google Sheets: `scripts/build_iris_dataset.py`
- Переключатель компаний в UI: `src/components/AppShell.tsx`

## Минимальные входные данные для новой компании

1. Архив транскриптов (`.zip`) с `.txt` файлами в формате `Speaker X: ...`.
2. Архив конфигов (`.zip`) с критериями и стандартами (аналог `ekvator_criteria.md` и `b2b_sales_standards.md`).
3. Либо публичная Google Sheets таблица с колонками `transcript_text` и/или `speakers_transcript`.
4. (Опционально) Дополнительные правила/словари предметной области.

## Шаги подключения Company B

1. Подготовить входные архивы и положить их в корень проекта.
2. Сделать копию генератора `build_profpotok_dataset.py` под новую компанию
   или расширить текущий скрипт параметрами.
3. Сгенерировать новый файл датасета в `src/data/`, например:
   - `src/data/companyBDataset.ts`
4. В `src/data/demoData.ts`:
   - импортировать новый датасет;
   - заменить `companyBPlaceholder` на реальный `companyBDataset`;
   - убедиться, что `companyMeta.id === 'company_b'`.
5. Проверить, что в `AppShell` селектор компании отображает корректное имя/статус.

## Команды генерации данных

Из директории `demo/`:

```bash
npm run data:profpotok
npm run data:iris
```

- `data:profpotok` — строит `src/data/profpotokDataset.ts` из архивов в корне проекта.
- `data:iris` — забирает данные из Google Sheets и строит `src/data/irisDataset.ts`.

## Обязательные поля CompanyDataset

Файл датасета должен содержать все поля интерфейса `CompanyDataset`:

- `companyMeta`
- `kpiCards`
- `trendSeries`
- `outcomeDistribution`
- `operatorStats`
- `callsData`
- `transcripts`
- `hourlyDistribution`
- `conversionFunnel`
- `dailyTrends`
- `scorecardByCall`
- `coachingPriorities`
- `speechTemplates`
- `operatorProfiles`
- `errorPatterns`
- `performanceMetrics`
- `weeklyChecklist`

## Верификация после подключения

Из директории `demo/`:

```bash
npm run lint
npm run test:run
```

Ручная проверка:

1. Переключение компании в шапке работает без перезагрузки.
2. Страницы `Overview`, `Calls`, `Reports`, `Coaching` рендерятся без пустых/битых блоков.
3. Деталка звонка открывается минимум для 3-5 звонков.
4. Цвета outcome/risk корректно соответствуют данным.

## Инструкция для Claude и Cursor (copy-paste)

Ниже готовые промпты, которые можно использовать в новом чате с агентом.

### 1) Шаблон для Cursor

```text
Подключи новую компанию в demo как отдельный dataset, сохранив текущий дизайн и UX.

Контекст:
- Репозиторий: speech-analytics/demo
- Текущие компании: profpotok, company_b (Iris)
- Формат данных: CompanyDataset (src/data/types.ts)

Источник данных новой компании:
- Company ID: <company_id>
- Company label: <label в селекторе>
- Источник: <Google Sheets URL или zip архивы>

Что нужно сделать:
1. Создать/обновить ingest-скрипт в demo/scripts/.
2. Сгенерировать src/data/<companyDataset>.ts в формате CompanyDataset.
3. Подключить dataset в src/data/demoData.ts.
4. Добавить компанию в селектор в src/components/AppShell.tsx.
5. Обновить README-company-onboarding.md при необходимости.
6. Прогнать:
   - npm run lint
   - npm run test:run
   - (опционально) npm run build

Ограничения:
- Не менять визуальный стиль.
- Не менять план-файлы.
- Все user-facing строки оставлять на русском.

В конце дай список изменённых файлов и результаты проверок.
```

### 2) Шаблон для Claude

```text
Нужно подключить новую компанию в demo-проект speech-analytics.

Дано:
- Текущая multi-company архитектура уже есть.
- Данные должны попасть в формат CompanyDataset.
- UI/дизайн менять нельзя.

Параметры новой компании:
- id: <company_id>
- label: <label>
- source: <Google Sheets URL или zip архивы>

Сделай:
1) Ingest-скрипт в demo/scripts/ для источника данных.
2) Генерацию src/data/<companyDataset>.ts.
3) Подключение в src/data/demoData.ts.
4) Добавление опции в AppShell selector.
5) Обновление runbook (README-company-onboarding.md).
6) Проверку lint/test/build.

Требования к ответу:
- Кратко опиши, что сделано по шагам.
- Приведи команды для повторной генерации данных.
- Приложи результаты проверок (lint/test/build).
```

### 3) Что подставлять в шаблон

- `<company_id>`: технический id (например `company_c`).
- `<label>`: как компания будет называться в UI (например `Nova Clinic`).
- `<companyDataset>`: имя файла датасета (например `novaDataset`).
- `<Google Sheets URL или zip архивы>`: реальный источник транскриптов.

### 4) Минимальная команда после интеграции

```bash
cd demo
npm run lint
npm run test:run
```
