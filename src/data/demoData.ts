export type Tone = 'primary' | 'success' | 'risk' | 'warning' | 'neutral'
export type Outcome = 'Записался' | 'Отказ' | 'Перезвонить' | 'Переведён'

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
  errorType: string
  phone: string
  clientName: string
  keyPhrases: string[]
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

// --- KPI Cards ---
export const kpiCards: KpiCard[] = [
  {
    id: 'kpi1',
    label: 'Всего звонков',
    value: '2 847',
    delta: '+12% vs пр. месяц',
    deltaPositive: true,
    tone: 'primary',
    description: 'Входящих и исходящих за апрель',
  },
  {
    id: 'kpi2',
    label: 'Конверсия в запись',
    value: '94%',
    delta: '+4.1 пп vs пр. месяц',
    deltaPositive: true,
    tone: 'success',
    description: 'Доля звонков завершённых записью',
  },
  {
    id: 'kpi3',
    label: 'Потеря выручки',
    value: '₽ 1.2 млн',
    delta: '-8% vs пр. месяц',
    deltaPositive: true,
    tone: 'risk',
    description: 'Оценка упущенных пациентов',
  },
  {
    id: 'kpi4',
    label: 'Средний балл',
    value: '4.92 / 5',
    delta: '+0.12 vs пр. месяц',
    deltaPositive: true,
    tone: 'warning',
    description: 'Оценка качества по скорингу',
  },
]

// --- Trend Series ---
export const trendSeries: TrendPoint[] = [
  { week: '3 мар', calls: 620, converted: 378, lost: 242 },
  { week: '10 мар', calls: 580, converted: 340, lost: 240 },
  { week: '17 мар', calls: 670, converted: 421, lost: 249 },
  { week: '24 мар', calls: 710, converted: 460, lost: 250 },
  { week: '31 мар', calls: 695, converted: 448, lost: 247 },
  { week: '7 апр', calls: 750, converted: 503, lost: 247 },
  { week: '14 апр', calls: 780, converted: 534, lost: 246 },
  { week: '21 апр', calls: 847, converted: 595, lost: 252 },
]

// --- Outcome Distribution ---
export const outcomeDistribution: OutcomeSlice[] = [
  { label: 'Записался', value: 63, color: '#7fe3c5' },
  { label: 'Отказ', value: 18, color: '#ff8e7a' },
  { label: 'Перезвонить', value: 12, color: '#f6c667' },
  { label: 'Переведён', value: 7, color: '#6bc6ff' },
]

// --- Operator Stats ---
export const operatorStats: OperatorStat[] = [
  { id: 'op1', name: 'Анна Смирнова', calls: 412, score: 99, converted: 389, trend: 'up' },
  { id: 'op2', name: 'Мария Козлова', calls: 389, score: 98, converted: 367, trend: 'up' },
  { id: 'op3', name: 'Светлана Иванова', calls: 356, score: 97, converted: 335, trend: 'up' },
  { id: 'op4', name: 'Ольга Петрова', calls: 341, score: 99, converted: 321, trend: 'up' },
  { id: 'op5', name: 'Елена Сидорова', calls: 298, score: 99, converted: 280, trend: 'up' },
]

// --- Calls List ---
export const callsData: CallRecord[] = [
  { id: '10028', date: '21 апр, 14:32', operator: 'Елена Сидорова', operatorId: 'op5', duration: '4:17', durationSec: 257, score: 42, outcome: 'Отказ', errorType: 'Не предложила альтернативу', phone: '+7 916 ***-**-21', clientName: 'Ковалёв А.И.', keyPhrases: ['дорого', 'не устраивает'] },
  { id: '10027', date: '21 апр, 13:05', operator: 'Анна Смирнова', operatorId: 'op1', duration: '2:51', durationSec: 171, score: 91, outcome: 'Записался', errorType: '', phone: '+7 903 ***-**-44', clientName: 'Соколова М.В.', keyPhrases: ['запись', 'терапевт'] },
  { id: '10026', date: '21 апр, 11:48', operator: 'Мария Козлова', operatorId: 'op2', duration: '3:22', durationSec: 202, score: 78, outcome: 'Записался', errorType: '', phone: '+7 925 ***-**-07', clientName: 'Новиков П.С.', keyPhrases: ['анализы', 'запись'] },
  { id: '10025', date: '21 апр, 10:14', operator: 'Светлана Иванова', operatorId: 'op3', duration: '6:04', durationSec: 364, score: 55, outcome: 'Перезвонить', errorType: 'Затянутый диалог', phone: '+7 999 ***-**-33', clientName: 'Фёдорова Е.Н.', keyPhrases: ['перезвоните', 'подумаю'] },
  { id: '10024', date: '20 апр, 17:22', operator: 'Ольга Петрова', operatorId: 'op4', duration: '3:10', durationSec: 190, score: 74, outcome: 'Записался', errorType: '', phone: '+7 916 ***-**-88', clientName: 'Морозов Д.А.', keyPhrases: ['запись', 'хирург'] },
  { id: '10023', date: '20 апр, 15:50', operator: 'Елена Сидорова', operatorId: 'op5', duration: '5:33', durationSec: 333, score: 48, outcome: 'Отказ', errorType: 'Не выявила потребность', phone: '+7 903 ***-**-12', clientName: 'Волкова С.И.', keyPhrases: ['дорого', 'отказываюсь'] },
  { id: '10022', date: '20 апр, 14:07', operator: 'Анна Смирнова', operatorId: 'op1', duration: '2:44', durationSec: 164, score: 88, outcome: 'Записался', errorType: '', phone: '+7 925 ***-**-56', clientName: 'Белов К.Г.', keyPhrases: ['запись', 'педиатр'] },
  { id: '10021', date: '20 апр, 12:33', operator: 'Мария Козлова', operatorId: 'op2', duration: '3:58', durationSec: 238, score: 80, outcome: 'Переведён', errorType: '', phone: '+7 911 ***-**-71', clientName: 'Тихонова О.Р.', keyPhrases: ['перевод', 'специалист'] },
  { id: '10020', date: '19 апр, 16:45', operator: 'Светлана Иванова', operatorId: 'op3', duration: '4:25', durationSec: 265, score: 62, outcome: 'Записался', errorType: '', phone: '+7 916 ***-**-39', clientName: 'Михайлов В.Л.', keyPhrases: ['запись', 'невролог'] },
  { id: '10019', date: '19 апр, 14:10', operator: 'Ольга Петрова', operatorId: 'op4', duration: '2:55', durationSec: 175, score: 76, outcome: 'Записался', errorType: '', phone: '+7 903 ***-**-22', clientName: 'Козлова Н.П.', keyPhrases: ['запись', 'кардиолог'] },
  { id: '10018', date: '19 апр, 11:22', operator: 'Елена Сидорова', operatorId: 'op5', duration: '7:12', durationSec: 432, score: 38, outcome: 'Отказ', errorType: 'Грубость в голосе', phone: '+7 925 ***-**-94', clientName: 'Лебедев А.В.', keyPhrases: ['недовольство', 'жалоба'] },
  { id: '10017', date: '18 апр, 17:05', operator: 'Анна Смирнова', operatorId: 'op1', duration: '3:01', durationSec: 181, score: 93, outcome: 'Записался', errorType: '', phone: '+7 999 ***-**-61', clientName: 'Зайцева Т.К.', keyPhrases: ['запись', 'офтальмолог'] },
]

// --- Transcript for call 10028 ---
export const transcripts: Record<string, TranscriptLine[]> = {
  '10028': [
    { speaker: 'operator', text: 'Добрый день, клиника "Медика", меня зовут Елена, чем могу помочь?', startSec: 0 },
    { speaker: 'client', text: 'Здравствуйте. Я хотел бы записаться к терапевту.', startSec: 5 },
    { speaker: 'operator', text: 'Вам нужен врач? Хорошо, могу записать на терапевта.', startSec: 11 },
    { speaker: 'client', text: 'Да, но сколько это стоит? Мне говорили это дорого.', startSec: 18 },
    { speaker: 'operator', text: 'Да, понимаю, к сожалению такая цена...', startSec: 25 },
    { speaker: 'client', text: 'Ладно, это слишком дорого для меня. Не буду записываться.', startSec: 33 },
    { speaker: 'operator', text: 'Понятно, тогда спасибо за звонок.', startSec: 42 },
  ],
  '10027': [
    { speaker: 'operator', text: 'Добрый день, клиника "Медика", Анна, чем могу помочь?', startSec: 0 },
    { speaker: 'client', text: 'Здравствуйте, хочу записаться к терапевту на завтра.', startSec: 5 },
    { speaker: 'operator', text: 'Конечно! Расскажите, что вас беспокоит, чтобы я подобрала подходящего специалиста?', startSec: 10 },
    { speaker: 'client', text: 'Горло болит уже несколько дней, температура бывает.', startSec: 18 },
    { speaker: 'operator', text: 'Понятно. Есть удобное время завтра в 10:30 или в 14:00 — что подходит?', startSec: 25 },
    { speaker: 'client', text: 'В 10:30 отлично.', startSec: 34 },
    { speaker: 'operator', text: 'Записала! Пришлю SMS с подтверждением. До свидания!', startSec: 38 },
  ],
}

// --- Report Data ---
export const hourlyDistribution: HourlyPoint[] = [
  { hour: 8, calls: 45 }, { hour: 9, calls: 112 }, { hour: 10, calls: 187 },
  { hour: 11, calls: 203 }, { hour: 12, calls: 165 }, { hour: 13, calls: 98 },
  { hour: 14, calls: 178 }, { hour: 15, calls: 221 }, { hour: 16, calls: 198 },
  { hour: 17, calls: 156 }, { hour: 18, calls: 89 }, { hour: 19, calls: 34 },
]

export const conversionFunnel: FunnelStep[] = [
  { stage: 'Звонков', count: 2847 },
  { stage: 'Диалог состоялся', count: 2780 },
  { stage: 'Предложена запись', count: 2760 },
  { stage: 'Записался', count: 2676 },
]

export const dailyTrends: DailyTrend[] = [
  { day: '1 апр', calls: 82, conversion: 91 },
  { day: '3 апр', calls: 91, conversion: 92 },
  { day: '5 апр', calls: 78, conversion: 93 },
  { day: '7 апр', calls: 105, conversion: 93 },
  { day: '10 апр', calls: 98, conversion: 94 },
  { day: '12 апр', calls: 115, conversion: 94 },
  { day: '14 апр', calls: 110, conversion: 94 },
  { day: '17 апр', calls: 124, conversion: 95 },
  { day: '19 апр', calls: 118, conversion: 95 },
  { day: '21 апр', calls: 132, conversion: 95 },
]

// --- Scorecard for call 10028 ---
export const scorecardCriteria: ScorecardCriterion[] = [
  {
    id: 'sc1',
    label: 'Приветствие и идентификация',
    passed: true,
    quote: '«Добрый день, клиника "Медика", меня зовут Елена, чем могу помочь?»',
    recommendation: 'Всё верно — стандарт соблюдён.',
  },
  {
    id: 'sc2',
    label: 'Выявление потребности',
    passed: false,
    quote: '«Вам нужен врач? Хорошо, могу записать на терапевта.»',
    recommendation: 'Задайте уточняющий вопрос: «Расскажите, что вас беспокоит?» перед предложением специалиста.',
  },
  {
    id: 'sc3',
    label: 'Предложение альтернативы при отказе',
    passed: false,
    quote: '«Понятно, тогда спасибо за звонок.» [конец диалога]',
    recommendation: 'При фразе пациента «дорого» — предложите: «У нас есть рассрочка и акции — хотите узнать?»',
  },
  {
    id: 'sc4',
    label: 'Работа с возражением по цене',
    passed: false,
    quote: '«Да, понимаю, это дорого...» — без продолжения.',
    recommendation: 'Избегайте согласия с ценовым возражением. Переключайте на ценность: «Зато вы получите...»',
  },
  {
    id: 'sc5',
    label: 'Фиксация контакта',
    passed: true,
    quote: '«Могу я записать ваш номер для перезвона?»',
    recommendation: 'Отлично — контакт зафиксирован.',
  },
  {
    id: 'sc6',
    label: 'Тон и эмпатия',
    passed: true,
    quote: '«Я понимаю, что это срочно, постараемся помочь как можно скорее.»',
    recommendation: 'Хорошая эмпатия — продолжайте в том же духе.',
  },
  {
    id: 'sc7',
    label: 'Завершение и CTA',
    passed: false,
    quote: '«Ладно, до свидания.»',
    recommendation: 'Завершайте с конкретным следующим шагом: «Могу записать вас на удобное время — когда вам удобно?»',
  },
]

// --- Coaching Priorities ---
export const coachingPriorities: CoachingPriority[] = [
  {
    id: 'cp1',
    title: 'Работа с ценовым возражением',
    description: 'Операторы соглашаются с возражением «дорого» вместо переключения на ценность. Ошибка в 34% отказных звонков.',
    progress: 34,
    impact: 'high',
    operators: ['Елена Сидорова', 'Светлана Иванова'],
  },
  {
    id: 'cp2',
    title: 'Предложение альтернативы',
    description: 'При первом отказе 28% операторов завершают диалог не предложив альтернативу или скидку.',
    progress: 28,
    impact: 'high',
    operators: ['Елена Сидорова', 'Ольга Петрова'],
  },
  {
    id: 'cp3',
    title: 'Выявление потребности',
    description: 'Операторы переходят к предложению специалиста не выяснив симптомы. Снижает доверие пациента.',
    progress: 19,
    impact: 'medium',
    operators: ['Светлана Иванова'],
  },
]

// --- Speech Templates ---
export const speechTemplates: SpeechTemplate[] = [
  {
    id: 'st1',
    situation: 'Пациент говорит «это дорого»',
    before: '«Да, понимаю, к сожалению такая цена...»',
    after: '«Стоимость включает консультацию и все анализы. Кроме того, у нас есть рассрочка на 3 месяца без процентов — хотите я расскажу подробнее?»',
    improvement: 'Конверсия +18% на этом возражении',
  },
  {
    id: 'st2',
    situation: 'Пациент отказывается записываться сразу',
    before: '«Хорошо, тогда звоните когда решите.»',
    after: '«Понимаю, что нужно подумать. Могу предварительно забронировать удобное время — его можно отменить за 2 часа. Когда вам обычно удобнее — утром или вечером?»',
    improvement: 'Удержание пациента +24%',
  },
]

// --- Operator Profiles ---
export const operatorProfiles: OperatorProfile[] = [
  {
    id: 'op5',
    name: 'Елена Сидорова',
    avatar: 'ЕС',
    score: 61,
    calls: 298,
    strengths: ['Вежливый тон', 'Чёткое приветствие'],
    growthPoints: [
      'Работа с ценовым возражением (42% звонков)',
      'Предложение альтернативы при отказе',
      'Завершение звонка с CTA',
    ],
    trend: -3,
  },
  {
    id: 'op3',
    name: 'Светлана Иванова',
    avatar: 'СИ',
    score: 68,
    calls: 356,
    strengths: ['Терпеливость', 'Фиксация контакта'],
    growthPoints: [
      'Выявление потребности перед предложением',
      'Сокращение длины диалога (-2 мин в среднем)',
    ],
    trend: -1,
  },
]

// --- Error Patterns ---
export interface ErrorPattern {
  id: string
  label: string
  percent: number
}

export const errorPatterns: ErrorPattern[] = [
  { id: 'ep1', label: 'Не предложил запись', percent: 45 },
  { id: 'ep2', label: 'Не уточнил потребность', percent: 38 },
  { id: 'ep3', label: 'Не отработал возражение', percent: 28 },
  { id: 'ep4', label: 'Не назвал цену услуги', percent: 22 },
  { id: 'ep5', label: 'Не предложил альтернативу', percent: 18 },
]

// --- Performance Radar Metrics ---
export interface PerformanceMetric {
  subject: string
  value: number
  fullMark: number
}

export const performanceMetrics: PerformanceMetric[] = [
  { subject: 'Приветствие', value: 98, fullMark: 100 },
  { subject: 'Потребность', value: 95, fullMark: 100 },
  { subject: 'Возражения', value: 93, fullMark: 100 },
  { subject: 'Альтернатива', value: 96, fullMark: 100 },
  { subject: 'Тон', value: 99, fullMark: 100 },
  { subject: 'Завершение', value: 95, fullMark: 100 },
]

// --- Checklist ---
export const weeklyChecklist: ChecklistItem[] = [
  { id: 'cl1', text: 'Прослушать 5 звонков Елены Сидоровой за неделю', category: 'Разбор' },
  { id: 'cl2', text: 'Провести 20-минутный разбор по ценовым возражениям', category: 'Разбор' },
  { id: 'cl3', text: 'Отправить шаблоны ответов всем операторам', category: 'Обучение' },
  { id: 'cl4', text: 'Провести ролевую игру: отработка отказа', category: 'Обучение' },
  { id: 'cl5', text: 'Проверить динамику конверсии Светланы Ивановой', category: 'Мониторинг' },
  { id: 'cl6', text: 'Обновить скрипт раздела «работа с возражениями»', category: 'Процесс' },
]
