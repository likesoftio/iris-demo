import { profpotokDataset } from './profpotokDataset'
import type { CompanyDataset, CompanyId } from './types'

export type {
  Tone,
  RiskLevel,
  Outcome,
  KpiCard,
  TrendPoint,
  OutcomeSlice,
  OperatorStat,
  CallRecord,
  TranscriptLine,
  HourlyPoint,
  FunnelStep,
  DailyTrend,
  ScorecardCriterion,
  CoachingPriority,
  SpeechTemplate,
  OperatorProfile,
  ChecklistItem,
  ErrorPattern,
  PerformanceMetric,
  CompanyMeta,
  CompanyDataset,
  CompanyId,
} from './types'

const companyBPlaceholder: CompanyDataset = {
  ...profpotokDataset,
  companyMeta: {
    id: 'company_b',
    name: 'Компания B (ожидает данные)',
    subtitle: 'Подключите транскрипты и конфиги второй компании',
    periodLabel: 'Нет данных',
    isReady: false,
  },
  kpiCards: [
    {
      id: 'kpi-empty-1',
      label: 'Всего звонков',
      value: '0',
      delta: '0%',
      deltaPositive: true,
      tone: 'neutral',
      description: 'Данные второй компании ещё не загружены',
    },
    {
      id: 'kpi-empty-2',
      label: 'Конверсия',
      value: '0%',
      delta: '0 пп',
      deltaPositive: true,
      tone: 'neutral',
      description: 'Данные второй компании ещё не загружены',
    },
  ],
  trendSeries: [],
  outcomeDistribution: [],
  operatorStats: [],
  callsData: [],
  transcripts: {},
  hourlyDistribution: [],
  conversionFunnel: [],
  dailyTrends: [],
  scorecardByCall: {},
  coachingPriorities: [],
  speechTemplates: [],
  operatorProfiles: [],
  errorPatterns: [],
  performanceMetrics: [],
  weeklyChecklist: [],
}

export const companyDatasets: Record<CompanyId, CompanyDataset> = {
  profpotok: profpotokDataset,
  company_b: companyBPlaceholder,
}

export function getCompanyDataset(companyId: CompanyId): CompanyDataset {
  return companyDatasets[companyId] ?? profpotokDataset
}
