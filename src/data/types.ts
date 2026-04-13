export type Tone = 'primary' | 'success' | 'risk' | 'warning' | 'neutral'
export type RiskLevel = 'low' | 'medium' | 'high'
export type Outcome = 'Сделка' | 'Без сделки' | 'Follow-up' | 'Сервис'
export type CompanyId = 'profpotok' | 'company_b'

export interface CompanyMeta {
  id: CompanyId
  name: string
  subtitle: string
  periodLabel: string
  isReady: boolean
}

export interface KpiCard {
  id: string
  label: string
  value: string
  delta: string
  deltaPositive: boolean
  tone: Tone
  description: string
}

export interface TrendPoint {
  week: string
  calls: number
  converted: number
  lost: number
}

export interface OutcomeSlice {
  label: string
  value: number
  color: string
}

export interface OperatorStat {
  id: string
  name: string
  calls: number
  score: number
  converted: number
  trend: 'up' | 'down' | 'flat'
}

export interface CallRecord {
  id: string
  date: string
  operator: string
  operatorId: string
  duration: string
  durationSec: number
  score: number
  outcome: Outcome
  riskLevel: RiskLevel
  errorType: string
  phone: string
  clientName: string
  keyPhrases: string[]
  callType: string
  qualityFlags: string[]
}

export interface TranscriptLine {
  speaker: 'operator' | 'client'
  text: string
  startSec: number
}

export interface HourlyPoint {
  hour: number
  calls: number
}

export interface FunnelStep {
  stage: string
  count: number
}

export interface DailyTrend {
  day: string
  calls: number
  conversion: number
}

export interface ScorecardCriterion {
  id: string
  label: string
  passed: boolean
  quote: string
  recommendation: string
}

export interface CoachingPriority {
  id: string
  title: string
  description: string
  progress: number
  impact: 'high' | 'medium' | 'low'
  operators: string[]
}

export interface SpeechTemplate {
  id: string
  situation: string
  before: string
  after: string
  improvement: string
}

export interface OperatorProfile {
  id: string
  name: string
  avatar: string
  score: number
  calls: number
  strengths: string[]
  growthPoints: string[]
  trend: number
}

export interface ChecklistItem {
  id: string
  text: string
  category: string
}

export interface ErrorPattern {
  id: string
  label: string
  percent: number
}

export interface PerformanceMetric {
  subject: string
  value: number
  fullMark: number
}

export interface CompanyDataset {
  companyMeta: CompanyMeta
  kpiCards: KpiCard[]
  trendSeries: TrendPoint[]
  outcomeDistribution: OutcomeSlice[]
  operatorStats: OperatorStat[]
  callsData: CallRecord[]
  transcripts: Record<string, TranscriptLine[]>
  hourlyDistribution: HourlyPoint[]
  conversionFunnel: FunnelStep[]
  dailyTrends: DailyTrend[]
  scorecardByCall: Record<string, ScorecardCriterion[]>
  coachingPriorities: CoachingPriority[]
  speechTemplates: SpeechTemplate[]
  operatorProfiles: OperatorProfile[]
  errorPatterns: ErrorPattern[]
  performanceMetrics: PerformanceMetric[]
  weeklyChecklist: ChecklistItem[]
}
