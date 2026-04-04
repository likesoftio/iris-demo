export type MetricTone = 'primary' | 'success' | 'risk' | 'warning'
export type RiskLevel = 'low' | 'medium' | 'high'
export type CallOutcome =
  | 'booked'
  | 'info_without_booking'
  | 'callback_pending'
  | 'reschedule_or_cancel'
  | 'transfer_or_routing'

export interface TrendPoint {
  label: string
  totalCalls: number
  leakageCalls: number
}

export interface OutcomeSlice {
  id: CallOutcome
  label: string
  value: number
  tone: MetricTone
}

export interface OperatorStat {
  id: string
  name: string
  callsHandled: number
  bookedRate: string
  riskShare: string
  avgScore: number
  strengthLabel: string
  attentionLabel: string
}

export interface MoneyImpactScenario {
  id: string
  label: string
  recoveredCalls: number
  extraBookings: number
  revenueLift: string
}

export interface ServiceLineStat {
  id: string
  name: string
  volume: number
  avgScore: number
  lossRate: string
  leakageCount: number
  tone: MetricTone
}

export interface OperatorSpotlight {
  id: string
  title: string
  operatorId: string
  operatorName: string
  metric: string
  note: string
  tone: MetricTone
}

export interface NarrativeHighlight {
  id: string
  label: string
  text: string
}

export interface BenchmarkStat {
  id: string
  label: string
  current: string
  target: string
  best: string
}

export interface DashboardMetric {
  id: string
  label: string
  value: string
  delta: string
  tone: MetricTone
  description: string
}

export interface InsightCard {
  id: string
  eyebrow: string
  title: string
  body: string
}

export interface LossCategory {
  id: string
  title: string
  rate: string
  impact: string
  tone: MetricTone
  summary: string
}

export interface CallListItem {
  id: string
  patientName: string
  title: string
  intent: string
  operatorId: string
  operatorName: string
  outcome: CallOutcome
  riskLevel: RiskLevel
  riskLabel: string
  score: number
  statusLabel: string
  summary: string
}

export interface EvidenceQuote {
  id: string
  speaker: string
  timestamp: string
  quote: string
}

export interface TranscriptSegment {
  id: string
  speaker: string
  start: number
  end: number
  text: string
}

export interface PlaybackMoment {
  id: string
  label: string
  time: number
}

export interface CoachingRewrite {
  before: string
  after: string
}

export interface CallRecord extends CallListItem {
  date: string
  channel: string
  audioDuration: number
  playbackMoments: PlaybackMoment[]
  transcriptSegments: TranscriptSegment[]
  strongMoments: string[]
  breakdown: Array<{
    label: string
    status: 'done' | 'partial' | 'missed'
    note: string
  }>
  evidenceQuotes: EvidenceQuote[]
  coachingRewrite: CoachingRewrite
  expectedOutcomeDelta: string
  recommendation: string
}

const callRecords: CallRecord[] = [
  {
    id: '10034',
    patientName: 'Ольга Тановалова',
    title: 'Первичная запись по новообразованию',
    intent: 'Диагностика и первичный прием',
    operatorId: 'yulia',
    operatorName: 'Юлия',
    outcome: 'booked',
    riskLevel: 'low',
    riskLabel: 'Низкий риск',
    score: 92,
    statusLabel: 'Записан',
    summary:
      'Администратор квалифицировала симптом, сразу подобрала профиль врача и довела разговор до записи на завтра.',
    date: '04.03.2026 12:04',
    channel: 'Входящий звонок',
    audioDuration: 187,
    playbackMoments: [
      { id: '10034-p1', label: 'Проблема пациента', time: 5 },
      { id: '10034-p2', label: 'Предложение слота', time: 91 },
    ],
    transcriptSegments: [
      {
        id: '10034-t1',
        speaker: 'Пациент',
        start: 5,
        end: 20,
        text: 'Мне нужно записаться. Не знаю, правда, кому. Проблема на глазе.',
      },
      {
        id: '10034-t2',
        speaker: 'Администратор',
        start: 44,
        end: 68,
        text: 'По новообразованиям нужно будет записаться. Вы уже были у нас в клинике раньше?',
      },
      {
        id: '10034-t3',
        speaker: 'Администратор',
        start: 91,
        end: 124,
        text: 'Завтра могу предложить как раз к специалисту по вашему профилю, а удобно будет как, первая или вторая половина дня?',
      },
    ],
    strongMoments: [
      'Самостоятельная маршрутизация по профилю без потери темпа.',
      'Быстрое предложение конкретных окон на следующий день.',
      'Полный инструктаж по стоимости и подготовке к визиту.',
    ],
    breakdown: [
      {
        label: 'Квалификация запроса',
        status: 'done',
        note: 'Администратор уточнила симптом и выбрала профильного врача.',
      },
      {
        label: 'Предложение слотов',
        status: 'done',
        note: 'Пациенту предложены релевантные окна без лишних пауз.',
      },
      {
        label: 'Следующий шаг',
        status: 'done',
        note: 'Запись оформлена и подтверждена в разговоре.',
      },
    ],
    evidenceQuotes: [
      {
        id: '10034-a',
        speaker: 'Пациент',
        timestamp: '00:05',
        quote:
          'Мне нужно записаться. Не знаю, правда, кому. Проблема на глазе.',
      },
      {
        id: '10034-b',
        speaker: 'Администратор',
        timestamp: '01:31',
        quote:
          'Завтра могу предложить как раз к специалисту по вашему профилю.',
      },
      {
        id: '10034-c',
        speaker: 'Пациент',
        timestamp: '01:44',
        quote: 'Давайте 15.00, отлично будет.',
      },
    ],
    coachingRewrite: {
      before:
        'Завтра могу предложить как раз к специалисту по вашему профилю.',
      after:
        'Я уже вижу подходящее окно на завтра у профильного специалиста. Давайте сразу забронирую вам удобное время, чтобы не потерять слот.',
    },
    expectedOutcomeDelta: '+1 зафиксированная запись без лишнего трения',
    recommendation:
      'Использовать этот кейс как референс для скрипта “неясная жалоба -> запись к нужному специалисту”.',
  },
  {
    id: '10032',
    patientName: 'София Волкова',
    title: 'Лазерная коррекция с длинным горизонтом',
    intent: 'Консультация по лазерной коррекции',
    operatorId: 'evgeniya',
    operatorName: 'Евгения',
    outcome: 'booked',
    riskLevel: 'low',
    riskLabel: 'Низкий риск',
    score: 90,
    statusLabel: 'Записан',
    summary:
      'Сложный хирургический сценарий с длинным горизонтом записи закрыт в консультацию и подготовлен к следующему этапу.',
    date: '04.03.2026 12:02',
    channel: 'Входящий звонок',
    audioDuration: 256,
    playbackMoments: [
      { id: '10032-p1', label: 'Запрос на коррекцию', time: 6 },
      { id: '10032-p2', label: 'Переход к операции', time: 237 },
    ],
    transcriptSegments: [
      {
        id: '10032-t1',
        speaker: 'Пациент',
        start: 6,
        end: 18,
        text: 'Я хотела бы записаться на приём, консультацию по поводу лазерной коррекции зрения.',
      },
      {
        id: '10032-t2',
        speaker: 'Администратор',
        start: 38,
        end: 55,
        text: 'Ближайшая дата у доктора есть девятого. В 10.30, в 13.30, в 15.00.',
      },
      {
        id: '10032-t3',
        speaker: 'Администратор',
        start: 237,
        end: 247,
        text: 'Мы с вами записались на 30-е. В пятницу вы сможете прооперироваться.',
      },
    ],
    strongMoments: [
      'Удержание длинного горизонта записи без потери уверенности.',
      'Подтверждение врача и расписания под конкретные ограничения пациента.',
      'Дополнительный мостик к операции после консультации.',
    ],
    breakdown: [
      {
        label: 'Работа со сложным спросом',
        status: 'done',
        note: 'Запрос на коррекцию переведен в понятный маршрут.',
      },
      {
        label: 'Уточнение ограничений',
        status: 'done',
        note: 'Учтены даты приезда пациента и желаемое время.',
      },
      {
        label: 'Upsell к следующему этапу',
        status: 'partial',
        note: 'Операционный путь обозначен, но можно делать это еще увереннее.',
      },
    ],
    evidenceQuotes: [
      {
        id: '10032-a',
        speaker: 'Пациент',
        timestamp: '00:06',
        quote:
          'Я хотела бы записаться на приём, консультацию по поводу лазерной коррекции зрения.',
      },
      {
        id: '10032-b',
        speaker: 'Администратор',
        timestamp: '00:38',
        quote:
          'Ближайшая дата у доктора есть девятого. В 10.30, в 13.30, в 15.00.',
      },
      {
        id: '10032-c',
        speaker: 'Администратор',
        timestamp: '03:57',
        quote:
          'Мы с вами записались на 30-е. В пятницу вы сможете прооперироваться.',
      },
    ],
    coachingRewrite: {
      before:
        'Мы с вами записались на 30-е. В пятницу вы сможете прооперироваться.',
      after:
        'Фиксируем консультацию на 30-е и сразу держим в резерве операционный слот на пятницу, чтобы вы понимали весь путь заранее.',
    },
    expectedOutcomeDelta: '+больше уверенности в high-ticket маршруте и меньше потерь после консультации',
    recommendation:
      'Показывать как эталон premium-консультации по высокочековому хирургическому сценарию.',
  },
  {
    id: '8413',
    patientName: 'Иван Петров',
    title: 'Срочный симптом и спасенная запись',
    intent: 'Срочный осмотр',
    operatorId: 'olesya',
    operatorName: 'Олеся',
    outcome: 'booked',
    riskLevel: 'medium',
    riskLabel: 'Средний риск',
    score: 87,
    statusLabel: 'Спасенный кейс',
    summary:
      'Пациент с тревожным симптомом не ушел из-за полной записи: администратор нашла более раннее окно и удержала его внутри маршрута клиники.',
    date: '28.02.2026 06:05',
    channel: 'Входящий звонок',
    audioDuration: 173,
    playbackMoments: [
      { id: '8413-p1', label: 'Тревожный симптом', time: 40 },
      { id: '8413-p2', label: 'Спасение слота', time: 97 },
    ],
    transcriptSegments: [
      {
        id: '8413-t1',
        speaker: 'Пациент',
        start: 40,
        end: 53,
        text: 'Сейчас уже сеточки нету, сейчас черная пелена, черные крапушки.',
      },
      {
        id: '8413-t2',
        speaker: 'Администратор',
        start: 53,
        end: 76,
        text: 'Я вас сейчас запишу по профилю, но уточню, может ли она взять вас пораньше.',
      },
      {
        id: '8413-t3',
        speaker: 'Администратор',
        start: 97,
        end: 120,
        text: 'Только что пациент у Смыковой отменился. Давайте мы к ней вас и запишем.',
      },
    ],
    strongMoments: [
      'Администратор не отпустила пациента после первого неудобного слота.',
      'Нашла отменившееся окно и переиграла запись в пользу пациента.',
      'Сработала как оператор удержания, а не просто регистратор расписания.',
    ],
    breakdown: [
      {
        label: 'Реакция на срочность',
        status: 'done',
        note: 'По симптомам видно, что кейс тревожный, оператор включилась.',
      },
      {
        label: 'Гибкость по расписанию',
        status: 'done',
        note: 'Нашлось более раннее окно без эскалации наружу.',
      },
      {
        label: 'Фиксация маршрута',
        status: 'done',
        note: 'Пациент получил понятный следующий шаг и адресную инструкцию.',
      },
    ],
    evidenceQuotes: [
      {
        id: '8413-a',
        speaker: 'Пациент',
        timestamp: '00:40',
        quote:
          'Сейчас уже сеточки нету, сейчас черная пелена, черные крапушки.',
      },
      {
        id: '8413-b',
        speaker: 'Администратор',
        timestamp: '00:53',
        quote:
          'Я вас сейчас запишу по профилю, но уточню, может ли она взять вас пораньше.',
      },
      {
        id: '8413-c',
        speaker: 'Администратор',
        timestamp: '01:37',
        quote:
          'Только что пациент у Смыковой отменился. Давайте мы к ней вас и запишем.',
      },
    ],
    coachingRewrite: {
      before:
        'Я вас сейчас запишу по профилю, но уточню, может ли она взять вас пораньше.',
      after:
        'Я уже держу для вас ближайший безопасный слот и параллельно ищу окно раньше. Если освобождается более раннее время, я сразу переведу вас туда.',
    },
    expectedOutcomeDelta: '+спасенная запись вместо ухода пациента с острым симптомом',
    recommendation:
      'Выделить отдельный playbook для срочных симптомов и спасения записи через внутренний поиск слотов.',
  },
  {
    id: '10028',
    patientName: 'Не указан',
    title: 'Теплый спрос ушел в “я перезвоню”',
    intent: 'Диагностика после коррекции',
    operatorId: 'yulia',
    operatorName: 'Юлия',
    outcome: 'callback_pending',
    riskLevel: 'high',
    riskLabel: 'Высокий риск',
    score: 52,
    statusLabel: 'Утечка',
    summary:
      'Пациент получил цену и доступность слотов, но разговор не завершился ни бронью, ни обещанным follow-up.',
    date: '04.03.2026 11:48',
    channel: 'Входящий звонок',
    audioDuration: 54,
    playbackMoments: [
      { id: '10028-p1', label: 'Вопрос о цене', time: 4 },
      { id: '10028-p2', label: 'Уход в перезвон', time: 51 },
    ],
    transcriptSegments: [
      {
        id: '10028-t1',
        speaker: 'Пациент',
        start: 4,
        end: 15,
        text: 'Подскажите, пожалуйста, сколько стоит у вас диагностика зрения и когда есть ближайшие окошки?',
      },
      {
        id: '10028-t2',
        speaker: 'Администратор',
        start: 34,
        end: 47,
        text: 'Стоимость зависит от ученой степени специалиста: 4500 рублей или 5500. По времени прием занимает полтора-два часа.',
      },
      {
        id: '10028-t3',
        speaker: 'Пациент',
        start: 51,
        end: 54,
        text: 'Все понял, спасибо, я перезвоню.',
      },
    ],
    strongMoments: [
      'Запрос пациента понятен и теплый.',
      'Окна доступны уже со следующего дня.',
    ],
    breakdown: [
      {
        label: 'Ответ на цену',
        status: 'done',
        note: 'Стоимость и длительность приема названы четко.',
      },
      {
        label: 'Удержание интереса',
        status: 'missed',
        note: 'После “я перезвоню” не предложен ни бронь, ни лист ожидания.',
      },
      {
        label: 'Следующий шаг',
        status: 'missed',
        note: 'Контакт не закреплен за администратором и не обещан обратный звонок.',
      },
    ],
    evidenceQuotes: [
      {
        id: '10028-a',
        speaker: 'Пациент',
        timestamp: '00:04',
        quote:
          'Сколько стоит у вас диагностика зрения и когда есть ближайшие окошки?',
      },
      {
        id: '10028-b',
        speaker: 'Администратор',
        timestamp: '00:47',
        quote: 'На эту неделю можем предложить, начиная с завтрашнего дня.',
      },
      {
        id: '10028-c',
        speaker: 'Пациент',
        timestamp: '00:51',
        quote: 'Все понял, спасибо, я перезвоню.',
      },
    ],
    coachingRewrite: {
      before: 'Все понял, спасибо, я перезвоню.',
      after:
        'Давайте я сразу забронирую для вас удобное окно с завтрашнего дня, а если передумаете, мы без проблем его отпустим.',
    },
    expectedOutcomeDelta: '+1 шанс на запись или зафиксированный follow-up в тот же день',
    recommendation:
      'После ценового запроса обязательно предлагать бронь слота или согласованный обратный звонок в тот же день.',
  },
  {
    id: '8429',
    patientName: 'Не указан',
    title: 'Высокочековый интерес без конверсии',
    intent: 'Премиальный хрусталик',
    operatorId: 'darya',
    operatorName: 'Дарья',
    outcome: 'info_without_booking',
    riskLevel: 'high',
    riskLabel: 'Высокий риск',
    score: 48,
    statusLabel: 'Не доведен',
    summary:
      'Пациент спрашивает про дорогой продукт, но клиника отвечает узко и не конвертирует интерес в консультацию.',
    date: '28.02.2026 06:43',
    channel: 'Входящий звонок',
    audioDuration: 58,
    playbackMoments: [
      { id: '8429-p1', label: 'Цена high-ticket', time: 10 },
      { id: '8429-p2', label: 'Уход без записи', time: 56 },
    ],
    transcriptSegments: [
      {
        id: '8429-t1',
        speaker: 'Пациент',
        start: 10,
        end: 16,
        text: 'Этот хрусталик с продленным фокусом, какая цена его варьируется у вас?',
      },
      {
        id: '8429-t2',
        speaker: 'Администратор',
        start: 16,
        end: 28,
        text: 'Мы не консультируем по хрусталикам. Начальная стоимость от 86 до 222 тысяч рублей.',
      },
      {
        id: '8429-t3',
        speaker: 'Пациент',
        start: 56,
        end: 58,
        text: 'Ну ладно, спасибо большое.',
      },
    ],
    strongMoments: ['Базовый ценовой диапазон озвучен быстро.'],
    breakdown: [
      {
        label: 'Ответ на вопрос',
        status: 'partial',
        note: 'Назван ценовой диапазон, но без маршрута консультации.',
      },
      {
        label: 'Продажа следующего шага',
        status: 'missed',
        note: 'Не предложен врач, формат приема или запись на разбор случая.',
      },
      {
        label: 'Удержание high-ticket спроса',
        status: 'missed',
        note: 'Клиника отдала инициативу пациенту.',
      },
    ],
    evidenceQuotes: [
      {
        id: '8429-a',
        speaker: 'Пациент',
        timestamp: '00:10',
        quote:
          'Этот хрусталик с продленным фокусом, какая цена его варьируется у вас?',
      },
      {
        id: '8429-b',
        speaker: 'Администратор',
        timestamp: '00:16',
        quote:
          'Мы не консультируем по хрусталикам. Начальная стоимость от 86 до 222 тысяч рублей.',
      },
      {
        id: '8429-c',
        speaker: 'Пациент',
        timestamp: '00:56',
        quote: 'Ну ладно, спасибо большое.',
      },
    ],
    coachingRewrite: {
      before:
        'Мы не консультируем по хрусталикам. Начальная стоимость от 86 до 222 тысяч рублей.',
      after:
        'По таким линзам диапазон действительно высокий, потому что он зависит от сценария операции. Давайте я запишу вас на консультацию хирурга, где подберут решение именно под ваш случай.',
    },
    expectedOutcomeDelta: '+конверсия high-ticket интереса в консультацию вместо ухода после цены',
    recommendation:
      'Для high-ticket запросов использовать скрипт “диапазон цены + консультация с врачом + запись на разбор случая”.',
  },
  {
    id: '8388',
    patientName: 'Ребенок, повторный пациент',
    title: 'Повторный спрос возвращен пациенту',
    intent: 'Аппаратное лечение в апреле',
    operatorId: 'alexandra',
    operatorName: 'Александра',
    outcome: 'info_without_booking',
    riskLevel: 'medium',
    riskLabel: 'Средний риск',
    score: 57,
    statusLabel: 'Удержание упущено',
    summary:
      'Повторный пациент хочет продолжить лечение, но вместо фиксации интереса получает просьбу позвонить позже самостоятельно.',
    date: '27.02.2026 16:31',
    channel: 'Входящий звонок',
    audioDuration: 31,
    playbackMoments: [
      { id: '8388-p1', label: 'Запрос на продолжение лечения', time: 0 },
      { id: '8388-p2', label: 'Возврат ответственности пациенту', time: 16 },
    ],
    transcriptSegments: [
      {
        id: '8388-t1',
        speaker: 'Пациент',
        start: 0,
        end: 14,
        text: 'Ребенку на повторное нужно аппаратное лечение записаться, но оно будет в апреле.',
      },
      {
        id: '8388-t2',
        speaker: 'Администратор',
        start: 16,
        end: 22,
        text: 'Еще рано. Позвоните нам 10 марта.',
      },
      {
        id: '8388-t3',
        speaker: 'Пациент',
        start: 22,
        end: 24,
        text: '10 марта, да?',
      },
    ],
    strongMoments: ['Контекст пациента быстро понятен без лишних уточнений.'],
    breakdown: [
      {
        label: 'Понимание контекста',
        status: 'done',
        note: 'Администратор сразу поняла, что речь о продолжении лечения.',
      },
      {
        label: 'Лист ожидания',
        status: 'missed',
        note: 'Интерес пациента не зафиксирован внутри клиники.',
      },
      {
        label: 'Исходящий follow-up',
        status: 'missed',
        note: 'Пациенту предложено перезвонить самому, ownership утерян.',
      },
    ],
    evidenceQuotes: [
      {
        id: '8388-a',
        speaker: 'Пациент',
        timestamp: '00:00',
        quote:
          'Ребенку на повторное нужно аппаратное лечение записаться, но оно будет в апреле.',
      },
      {
        id: '8388-b',
        speaker: 'Администратор',
        timestamp: '00:16',
        quote: 'Еще рано. Позвоните нам 10 марта.',
      },
      {
        id: '8388-c',
        speaker: 'Пациент',
        timestamp: '00:20',
        quote: '10 марта, да?',
      },
    ],
    coachingRewrite: {
      before: 'Еще рано. Позвоните нам 10 марта.',
      after:
        'Я уже фиксирую ваш интерес и оставляю заявку в лист ожидания. Когда график откроется 10 марта, мы сами вам позвоним первыми.',
    },
    expectedOutcomeDelta: '+удержание повторного пациента без лишнего шага с его стороны',
    recommendation:
      'Вводить лист ожидания и исходящий контакт по неоткрытому расписанию, особенно для повторных пациентов.',
  },
]

export const demoData = {
  dashboardMetrics: [
    {
      id: 'booked-share',
      label: 'Оформленные или подтвержденные записи',
      value: '29.5%',
      delta: '+6 тёплых кейсов к базе',
      tone: 'success',
      description: '59 из 200 звонков завершились подтверждением следующего шага.',
    },
    {
      id: 'leakage-share',
      label: 'Звонки без зафиксированного следующего шага',
      value: '39.5%',
      delta: '79 кейсов в зоне потерь',
      tone: 'risk',
      description:
        'Основной резерв роста скрыт в звонках, где пациенту ответили, но не дожали до действия.',
    },
    {
      id: 'callback-share',
      label: 'Отложенные решения “я перезвоню”',
      value: '16.5%',
      delta: '33 кейса',
      tone: 'warning',
      description:
        'Часть теплого спроса уходит в сравнение и не закрепляется за администратором.',
    },
    {
      id: 'mixed-flow',
      label: 'Смешанный поток вместо чистой воронки',
      value: '5 типов',
      delta: 'хирургия, сервис, оптика, лиды, маршрутизация',
      tone: 'primary',
      description:
        'Для управляемой аналитики поток нужно делить хотя бы на пять сценариев.',
    },
  ] satisfies DashboardMetric[],
  trendSeries: [
    { label: '26 Feb', totalCalls: 18, leakageCalls: 5 },
    { label: '27 Feb', totalCalls: 24, leakageCalls: 8 },
    { label: '28 Feb', totalCalls: 31, leakageCalls: 13 },
    { label: '01 Mar', totalCalls: 22, leakageCalls: 7 },
    { label: '02 Mar', totalCalls: 28, leakageCalls: 9 },
    { label: '03 Mar', totalCalls: 35, leakageCalls: 12 },
    { label: '04 Mar', totalCalls: 42, leakageCalls: 16 },
  ] satisfies TrendPoint[],
  outcomeDistribution: [
    { id: 'booked', label: 'Запись', value: 59, tone: 'success' },
    { id: 'info_without_booking', label: 'Без записи', value: 79, tone: 'risk' },
    { id: 'callback_pending', label: 'Перезвоню', value: 33, tone: 'warning' },
    {
      id: 'reschedule_or_cancel',
      label: 'Перенос / отмена',
      value: 20,
      tone: 'primary',
    },
    {
      id: 'transfer_or_routing',
      label: 'Маршрутизация',
      value: 9,
      tone: 'primary',
    },
  ] satisfies OutcomeSlice[],
  operatorStats: [
    {
      id: 'yulia',
      name: 'Юлия',
      callsHandled: 62,
      bookedRate: '38%',
      riskShare: '16%',
      avgScore: 88,
      strengthLabel: 'Лучше всех закрывает понятный первичный спрос',
      attentionLabel: 'Нужно сильнее фиксировать follow-up после цены',
    },
    {
      id: 'evgeniya',
      name: 'Евгения',
      callsHandled: 48,
      bookedRate: '34%',
      riskShare: '19%',
      avgScore: 84,
      strengthLabel: 'Сильна в длинных хирургических сценариях',
      attentionLabel: 'Можно плотнее переводить high-ticket интерес в консультацию',
    },
    {
      id: 'alexandra',
      name: 'Александра',
      callsHandled: 45,
      bookedRate: '26%',
      riskShare: '24%',
      avgScore: 79,
      strengthLabel: 'Хорошо держит повторные и сервисные кейсы',
      attentionLabel: 'Высокий риск потерь, когда график еще не открыт',
    },
    {
      id: 'olesya',
      name: 'Олеся',
      callsHandled: 29,
      bookedRate: '31%',
      riskShare: '14%',
      avgScore: 86,
      strengthLabel: 'Хорошо спасает срочные симптомы и окна день-в-день',
      attentionLabel: 'Нужна более ровная работа в несрочных сценариях',
    },
    {
      id: 'darya',
      name: 'Дарья',
      callsHandled: 17,
      bookedRate: '21%',
      riskShare: '29%',
      avgScore: 73,
      strengthLabel: 'Быстро отвечает на прямые вопросы',
      attentionLabel: 'Главная зона роста — premium-консультация вместо справки',
    },
  ] satisfies OperatorStat[],
  moneyImpactScenarios: [
    {
      id: 'five',
      label: '5% утечек восстановлено',
      recoveredCalls: 4,
      extraBookings: 2,
      revenueLift: '+180 000 ₽ / мес',
    },
    {
      id: 'ten',
      label: '10% утечек восстановлено',
      recoveredCalls: 8,
      extraBookings: 4,
      revenueLift: '+360 000 ₽ / мес',
    },
    {
      id: 'fifteen',
      label: '15% утечек восстановлено',
      recoveredCalls: 12,
      extraBookings: 6,
      revenueLift: '+540 000 ₽ / мес',
    },
  ] satisfies MoneyImpactScenario[],
  serviceLineStats: [
    {
      id: 'diagnostics',
      name: 'Диагностика',
      volume: 42,
      avgScore: 82,
      lossRate: '18%',
      leakageCount: 8,
      tone: 'warning',
    },
    {
      id: 'surgery',
      name: 'Хирургия',
      volume: 68,
      avgScore: 84,
      lossRate: '14%',
      leakageCount: 10,
      tone: 'primary',
    },
    {
      id: 'correction',
      name: 'Коррекция зрения',
      volume: 27,
      avgScore: 79,
      lossRate: '26%',
      leakageCount: 7,
      tone: 'risk',
    },
    {
      id: 'kids',
      name: 'Детский прием',
      volume: 31,
      avgScore: 77,
      lossRate: '22%',
      leakageCount: 7,
      tone: 'warning',
    },
    {
      id: 'repeat',
      name: 'Повторные пациенты',
      volume: 24,
      avgScore: 81,
      lossRate: '17%',
      leakageCount: 4,
      tone: 'primary',
    },
    {
      id: 'optics',
      name: 'Оптика',
      volume: 21,
      avgScore: 73,
      lossRate: '29%',
      leakageCount: 6,
      tone: 'risk',
    },
  ] satisfies ServiceLineStat[],
  operatorSpotlights: [
    {
      id: 'best-conversion',
      title: 'Лучший по конверсии',
      operatorId: 'yulia',
      operatorName: 'Юлия',
      metric: '38% booking rate',
      note: 'Лучше других превращает понятный первичный спрос в запись.',
      tone: 'success',
    },
    {
      id: 'best-retention',
      title: 'Лучший по удержанию сложных кейсов',
      operatorId: 'evgeniya',
      operatorName: 'Евгения',
      metric: 'High-ticket confidence',
      note: 'Сильнее остальных удерживает длинные хирургические сценарии.',
      tone: 'primary',
    },
    {
      id: 'coaching-target',
      title: 'Главная зона коучинга',
      operatorId: 'darya',
      operatorName: 'Дарья',
      metric: '29% risk share',
      note: 'Нужно переводить дорогой интерес из справки в консультацию.',
      tone: 'warning',
    },
    {
      id: 'leak-risk',
      title: 'Риск по утечкам',
      operatorId: 'alexandra',
      operatorName: 'Александра',
      metric: 'Повторные пациенты',
      note: 'Особенно важно не возвращать ответственность пациенту при неоткрытом графике.',
      tone: 'risk',
    },
  ] satisfies OperatorSpotlight[],
  narrativeHighlights: [
    {
      id: 'risk-week',
      label: 'Главный риск недели',
      text: 'Теплые звонки после вопроса о цене слишком часто заканчиваются без зафиксированного следующего шага.',
    },
    {
      id: 'strong-operator',
      label: 'Самый сильный оператор',
      text: 'Юлия лучше других закрывает понятный входящий спрос и быстро переводит симптом в запись.',
    },
    {
      id: 'coaching-priority',
      label: 'Куда направить коучинг первым',
      text: 'High-ticket сценарии и повторные пациенты: там деньги теряются не в тоне, а в отсутствии следующего действия.',
    },
  ] satisfies NarrativeHighlight[],
  benchmarkStats: [
    {
      id: 'booking-rate',
      label: 'Booking rate',
      current: '29.5%',
      target: '35%',
      best: '38%',
    },
    {
      id: 'risk-share',
      label: 'Risk share',
      current: '39.5%',
      target: '28%',
      best: '24%',
    },
    {
      id: 'callback-share',
      label: 'Callback leakage',
      current: '16.5%',
      target: '10%',
      best: '8%',
    },
  ] satisfies BenchmarkStat[],
  insightCards: [
    {
      id: 'hero',
      eyebrow: 'Главный вывод',
      title: 'Клиника теряет не разговоры, а следующий шаг после разговора',
      body:
        'У сильных администраторов спрос быстро превращается в запись. Потери начинаются там, где цена, врач или расписание обсуждены, но действие не закреплено.',
    },
    {
      id: 'strength',
      eyebrow: 'Сильная сторона',
      title: 'Понятный спрос закрывается уверенно',
      body:
        'Когда пациент уже понимает проблему или готов к приему, запись оформляется быстро и без лишнего трения.',
    },
    {
      id: 'opportunity',
      eyebrow: 'Резерв роста',
      title: 'High-ticket и повторный спрос требуют отдельного удержания',
      body:
        'Дорогие хирургические запросы и повторные пациенты нуждаются не в справке, а в продаже следующего шага.',
    },
  ] satisfies InsightCard[],
  lossCategories: [
    {
      id: 'missing-next-step',
      title: 'Нет зафиксированного следующего шага',
      rate: '1 из 4 теплых кейсов',
      impact: 'Главная управленческая утечка',
      tone: 'risk',
      summary:
        'Пациенту отвечают по цене или расписанию, но не закрепляют бронь, обратный звонок или конкретную дату возврата.',
    },
    {
      id: 'doctor-qualification',
      title: 'Пациент не понимает, к какому врачу идти',
      rate: '102 упоминания в неоформленных кейсах',
      impact: 'Сильное влияние на первичные обращения',
      tone: 'warning',
      summary:
        'Нужно чаще превращать неясный запрос в базовую диагностику или консультацию по маршруту.',
    },
    {
      id: 'schedule-friction',
      title: 'Трение по расписанию',
      rate: '37 кейсов',
      impact: 'Особенно бьет по повторным пациентам',
      tone: 'warning',
      summary:
        'Нет открытого графика, нужный врач недоступен или пациенту неудобны предложенные окна.',
    },
    {
      id: 'high-ticket-consulting',
      title: 'High-ticket запросы не доводятся до консультации',
      rate: 'Отдельная зона риска',
      impact: 'Высокая упущенная выручка',
      tone: 'primary',
      summary:
        'Запросы про хрусталики, коррекцию и операции требуют отдельного premium-скрипта.',
    },
  ] satisfies LossCategory[],
  callListItems: callRecords.map(
    ({
      id,
      patientName,
      title,
      intent,
      operatorId,
      operatorName,
      outcome,
      riskLevel,
      riskLabel,
      score,
      statusLabel,
      summary,
    }) => ({
      id,
      patientName,
      title,
      intent,
      operatorId,
      operatorName,
      outcome,
      riskLevel,
      riskLabel,
      score,
      statusLabel,
      summary,
    }),
  ) satisfies CallListItem[],
  callDetailRecords: callRecords,
}

export function getCallRecordById(callId: string) {
  const record = findCallRecordById(callId)

  if (!record) {
    throw new Error(`Call record ${callId} not found`)
  }

  return record
}

export function findCallRecordById(callId: string) {
  return demoData.callDetailRecords.find(({ id }) => id === callId)
}
