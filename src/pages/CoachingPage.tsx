import { ArrowRight, BookOpen, CheckCircle2, CheckSquare, ChevronRight, Square, Target, TrendingUp, User } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

// ─── Data ─────────────────────────────────────────────────────────────────────

const coachingPriorities = [
  {
    id: 'next-step',
    rank: 1,
    title: 'Фиксация следующего шага',
    description: 'Администратор должна заканчивать каждый тёплый разговор конкретным действием: записью, датой обратного звонка или подтверждённым временем визита.',
    frequency: 45,
    impactLabel: '+15 записей/мес',
    callsCount: 12,
    featured: true,
  },
  {
    id: 'premium-close',
    rank: 2,
    title: 'Перевод high-ticket интереса в консультацию',
    description: 'Дорогие запросы (хрусталики, коррекция, операции) требуют отдельного сценария — не справки, а продажи следующего визита.',
    frequency: 32,
    impactLabel: '+8 записей/мес',
    callsCount: 7,
    featured: false,
  },
  {
    id: 'schedule-friction',
    title: 'Работа с закрытым расписанием',
    rank: 3,
    description: 'Когда нет окна у нужного врача, администратор должна предлагать альтернативу, а не перекладывать ответственность на пациента.',
    frequency: 28,
    impactLabel: '+6 записей/мес',
    callsCount: 8,
    featured: false,
  },
]

const speechTemplates = [
  {
    id: 'booking-close',
    skill: 'Предложение записи',
    before: 'Если вас интересует — перезвоните нам, мы подберём время.',
    after: 'Я уже вижу окно на завтра у подходящего специалиста. Давайте сразу запишу — удобнее утро или вторая половина дня?',
    why: 'Конкретное предложение снимает барьер «я подумаю»: пациенту проще согласиться, чем инициировать повторный звонок.',
  },
  {
    id: 'price-to-booking',
    skill: 'После вопроса о цене',
    before: 'Цена от 15 000 рублей, можете уточнить на сайте.',
    after: 'Первичная консультация — 2 500 ₽, займёт около 40 минут. Ближайшее окно есть в четверг в 11:00 — записать вас?',
    why: 'Цена должна заканчиваться следующим шагом, иначе она становится возражением, а не информацией.',
  },
  {
    id: 'no-slot',
    skill: 'Закрытое расписание',
    before: 'К сожалению, у нас пока нет окон. Перезвоните через неделю.',
    after: 'У этого врача ближайшее окно откроется в понедельник. Давайте я запишу вас прямо сейчас, чтобы место не ушло?',
    why: 'Инициатива должна оставаться у администратора — пациент не перезвонит, если ему не дать причину.',
  },
]

const operatorProfiles = [
  {
    id: 'darya',
    name: 'Дарья',
    avgScore: 73,
    callsHandled: 17,
    riskShare: '29%',
    strengths: ['Быстрые и точные ответы на прямые вопросы', 'Не теряет нить разговора'],
    growthPoints: [
      { label: 'Предложение записи', note: 'нарушение в 7 из 8 тёплых звонков' },
      { label: 'Premium-сценарий', note: 'высокий интерес не переводится в консультацию' },
    ],
    priority: true,
  },
  {
    id: 'alexandra',
    name: 'Александра',
    avgScore: 79,
    callsHandled: 45,
    riskShare: '24%',
    strengths: ['Хорошо держит повторные пациенты', 'Уверенный сервисный тон'],
    growthPoints: [
      { label: 'Закрытое расписание', note: 'возвращает ответственность пациенту' },
      { label: 'Фиксация следующего шага', note: 'в 6 из 10 повторных кейсов нет брони' },
    ],
    priority: false,
  },
]

const weeklyChecklist = [
  { id: 'c1', text: 'Проверить долю звонков с предложением записи (цель: выше 60%)' },
  { id: 'c2', text: 'Провести разбор 2–3 звонков Дарьи с командой' },
  { id: 'c3', text: 'Проверить долю «высокий риск» (цель: ниже 25%)' },
  { id: 'c4', text: 'Отработать шаблон «цена → следующий шаг» на планёрке' },
  { id: 'c5', text: 'Зафиксировать улучшенные формулировки в базе знаний' },
]

const baselineMetrics = [
  { label: 'Booking rate', value: '29.5%' },
  { label: 'Высокий риск', value: '39.5%' },
  { label: 'Средний балл', value: '64/100' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function CoachingPriorityCard({ item, index }: { item: typeof coachingPriorities[0]; index: number }) {
  if (item.featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.08 }}
        className="relative overflow-hidden rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(31,183,201,0.12),rgba(107,198,255,0.07))] p-7 ring-2 ring-cyan-300/60"
      >
        <span className="absolute right-6 top-6 text-6xl font-black leading-none text-cyan-500/15 select-none">
          #{item.rank}
        </span>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-800">
          <Target className="size-3" />
          Приоритет #{item.rank}
        </div>
        <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-[#0d2430] pr-10">
          {item.title}
        </h3>
        <p className="mt-2.5 text-sm leading-6 text-[#466372]">{item.description}</p>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#466372]">Встречается в звонках</span>
            <span className="font-semibold text-[#0d2430]">{item.frequency}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-cyan-100">
            <div
              className="h-full rounded-full bg-[#1fb7c9]"
              style={{ width: `${item.frequency}%` }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            <TrendingUp className="size-3" />
            {item.impactLabel}
          </span>
          <Link
            to="/calls"
            className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-700 hover:text-cyan-900 transition-colors"
          >
            Примеры ({item.callsCount})
            <ChevronRight className="size-3.5" />
          </Link>
        </div>
      </motion.article>
    )
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.08 }}
      className="relative overflow-hidden rounded-[1.75rem] bg-white p-7 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]"
    >
      <span className="absolute right-6 top-6 text-6xl font-black leading-none text-slate-200 select-none">
        #{item.rank}
      </span>
      <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
        Приоритет #{item.rank}
      </div>
      <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-[#0d2430] pr-10">
        {item.title}
      </h3>
      <p className="mt-2.5 text-sm leading-6 text-[#466372]">{item.description}</p>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[#466372]">Встречается в звонках</span>
          <span className="font-semibold text-[#0d2430]">{item.frequency}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-400"
            style={{ width: `${item.frequency}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
          <TrendingUp className="size-3" />
          {item.impactLabel}
        </span>
        <Link
          to="/calls"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          Примеры ({item.callsCount})
          <ChevronRight className="size-3.5" />
        </Link>
      </div>
    </motion.article>
  )
}

function SpeechTemplateCard({ item, index }: { item: typeof speechTemplates[0]; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 + index * 0.07 }}
      className="rounded-[1.75rem] bg-white p-7 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]"
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
        Навык
      </p>
      <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[#0d2430]">{item.skill}</h3>

      <div className="mt-5 space-y-3">
        <div className="rounded-xl border-l-4 border-rose-400 bg-rose-50 p-4">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-600">
            Как не надо
          </p>
          <p className="text-sm italic leading-6 text-[#466372]">«{item.before}»</p>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] font-medium text-slate-400">
          <div className="h-px flex-1 bg-slate-100" />
          замените на
          <div className="h-px flex-1 bg-slate-100" />
        </div>

        <div className="rounded-xl border-l-4 border-emerald-400 bg-emerald-50 p-4">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">
            Как надо
          </p>
          <p className="text-sm font-medium leading-6 text-[#0d2430]">«{item.after}»</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
        <p className="text-xs leading-5 text-[#466372]">
          <span className="font-semibold text-[#0d2430]">Почему это работает: </span>
          {item.why}
        </p>
      </div>
    </motion.article>
  )
}

function OperatorCoachingCard({ op, index }: { op: typeof operatorProfiles[0]; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 + index * 0.08 }}
      className={[
        'rounded-[1.75rem] p-7 ring-1',
        op.priority
          ? 'bg-amber-50/60 ring-amber-200/70 shadow-[0_8px_32px_rgba(246,198,103,0.12)]'
          : 'bg-white shadow-[var(--shadow-soft)] ring-[var(--line-soft)]',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-100 text-base font-bold text-cyan-700">
            {op.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-[#0d2430]">{op.name}</p>
              {op.priority && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">
                  Фокус
                </span>
              )}
            </div>
            <p className="text-xs text-[#5b7280]">{op.callsHandled} звонков · риск {op.riskShare}</p>
          </div>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-bold text-[#0d2430]">
          {op.avgScore}
          <span className="ml-0.5 text-xs font-normal text-slate-400">/100</span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">
            Сильные стороны
          </p>
          <ul className="space-y-1.5">
            {op.strengths.map((s) => (
              <li key={s} className="flex items-start gap-2 text-xs leading-5 text-[#466372]">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600">
            Точки роста
          </p>
          <ul className="space-y-1.5">
            {op.growthPoints.map((g) => (
              <li key={g.label} className="text-xs leading-5">
                <span className="font-medium text-[#0d2430]">{g.label}</span>
                <span className="text-[#5b7280]"> — {g.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Link
        to="/calls"
        className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-700 hover:text-cyan-900 transition-colors"
      >
        Звонки {op.name} ({op.callsHandled})
        <ArrowRight className="size-3.5" />
      </Link>
    </motion.article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function CoachingPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="space-y-10"
    >
      {/* Hero */}
      <div className="rounded-[2rem] bg-white p-8 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]">
        <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-800">
          <BookOpen className="size-3.5" />
          Coaching Summary
        </div>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#0d2430] md:text-5xl">
          3 направления обучения с наибольшим влиянием на запись пациентов
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#466372]">
          Сформировано на основе анализа 58 звонков за 2 недели. Каждая рекомендация подкреплена реальными цитатами из разговоров.
        </p>
      </div>

      {/* Coaching Priorities */}
      <section>
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-slate-400">
            Приоритеты обучения
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#0d2430]">
            Где исправление даст максимальный эффект
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {coachingPriorities.map((item, i) => (
            <CoachingPriorityCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* Speech Templates */}
      <section>
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-slate-400">
            Речевые шаблоны
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#0d2430]">
            Конкретные формулировки для команды
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {speechTemplates.map((item, i) => (
            <SpeechTemplateCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* Operator Profiles */}
      <section>
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-slate-400">
            Профили операторов
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#0d2430]">
            На кого направить коучинг в первую очередь
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {operatorProfiles.map((op, i) => (
            <OperatorCoachingCard key={op.id} op={op} index={i} />
          ))}
        </div>
      </section>

      {/* Weekly Checklist */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
        className="rounded-[2rem] bg-[linear-gradient(135deg,rgba(31,183,201,0.07),rgba(107,198,255,0.04))] p-8 ring-1 ring-cyan-200/50"
      >
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CheckSquare className="size-5 text-cyan-600" />
              <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-cyan-700">
                Чеклист на неделю
              </p>
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#0d2430]">
              Что проверить через 7 дней
            </h2>
            <p className="mt-2 text-sm text-[#466372]">
              Отметьте пункты после выполнения — так вы отследите прогресс относительно базовых метрик.
            </p>

            <ul className="mt-6 space-y-3">
              {weeklyChecklist.map((item) => {
                const done = checked.has(item.id)
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => toggle(item.id)}
                      className="flex w-full items-start gap-3 rounded-xl px-4 py-3 text-left text-sm leading-6 transition-colors hover:bg-white/60"
                    >
                      {done ? (
                        <CheckSquare className="mt-0.5 size-4.5 shrink-0 text-cyan-600" />
                      ) : (
                        <Square className="mt-0.5 size-4.5 shrink-0 text-slate-300" />
                      )}
                      <span className={done ? 'text-[#5b7280] line-through' : 'text-[#0d2430]'}>
                        {item.text}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="w-full md:w-auto">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
              Базовые метрики
            </p>
            <div className="flex flex-wrap gap-3 md:flex-col">
              {baselineMetrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl bg-white/70 px-5 py-3 ring-1 ring-cyan-200/60"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {m.label}
                  </p>
                  <p className="mt-1 text-xl font-bold text-[#0d2430]">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA to Calls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]">
        <div className="flex items-center gap-3">
          <User className="size-5 text-cyan-600" />
          <p className="text-sm font-medium text-[#466372]">
            Хотите найти примеры звонков по конкретному паттерну?
          </p>
        </div>
        <Link
          to="/calls"
          className="inline-flex items-center gap-2 rounded-full bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-700 transition-colors"
        >
          Перейти к разбору звонков
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </motion.section>
  )
}
