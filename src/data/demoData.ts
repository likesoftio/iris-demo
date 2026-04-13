import { profpotokDataset } from './profpotokDataset'
import { irisDataset } from './irisDataset'
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

export const companyDatasets: Record<CompanyId, CompanyDataset> = {
  profpotok: profpotokDataset,
  company_b: irisDataset,
}

export function getCompanyDataset(companyId: CompanyId): CompanyDataset {
  return companyDatasets[companyId] ?? profpotokDataset
}
