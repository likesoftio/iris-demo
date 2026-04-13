# Company Onboarding Runbook

Этот гайд описывает, как подключить вторую компанию в текущий `demo` без переработки UI.

## Что уже реализовано

- Multi-company контракт данных: `src/data/types.ts`
- Каталог датасетов: `src/data/demoData.ts`
- Текущий подключённый датасет: `src/data/profpotokDataset.ts`
- Автогенератор датасета из архивов: `scripts/build_profpotok_dataset.py`
- Переключатель компаний в UI: `src/components/AppShell.tsx`

## Минимальные входные данные для новой компании

1. Архив транскриптов (`.zip`) с `.txt` файлами в формате `Speaker X: ...`.
2. Архив конфигов (`.zip`) с критериями и стандартами (аналог `ekvator_criteria.md` и `b2b_sales_standards.md`).
3. (Опционально) Дополнительные правила/словари предметной области.

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
