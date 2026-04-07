import { motion } from 'framer-motion'
import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, User, Calendar, Clock } from 'lucide-react'
import { callsData, scorecardCriteria } from '../data/demoData'
import { WaveformBar } from '../components/WaveformBar'

export function CallDetailPage() {
  const { callId } = useParams()
  const call = callsData.find(c => c.id === callId) ?? callsData[0]

  if (!call) return <Navigate to="/calls" replace />

  const passed = scorecardCriteria.filter(c => c.passed).length
  const total = scorecardCriteria.length

  const outcomeColor = call.outcome === 'Записался'
    ? 'bg-emerald-100 text-emerald-800 ring-emerald-200'
    : call.outcome === 'Отказ'
      ? 'bg-rose-100 text-rose-800 ring-rose-200'
      : call.outcome === 'Перезвонить'
        ? 'bg-amber-100 text-amber-800 ring-amber-200'
        : 'bg-sky-100 text-sky-800 ring-sky-200'

  const failedCriteria = scorecardCriteria.filter(c => !c.passed)

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' as const }}
      className="space-y-6"
    >
      {/* Breadcrumb */}
      <Link
        to="/calls"
        className="inline-flex items-center gap-1.5 text-sm text-[#5b7280] hover:text-cyan-700"
      >
        <ArrowLeft className="size-4" />
        К списку звонков
      </Link>

      {/* Header card */}
      <div className="rounded-[2rem] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5b7280]">Звонок #{call.id}</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#0d2430]">{call.operator}</h1>
          </div>
          <span className={`rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ${outcomeColor}`}>
            {call.outcome}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-6">
          {[
            { icon: Calendar, label: 'Дата', value: call.date },
            { icon: Clock, label: 'Длина', value: call.duration },
            { icon: User, label: 'Телефон', value: call.phone },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-[#eaf4f6]">
                <Icon className="size-4 text-cyan-700" />
              </div>
              <div>
                <p className="text-xs text-[#5b7280]">{label}</p>
                <p className="text-sm font-semibold text-[#16323f]">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <WaveformBar duration={call.duration} score={call.score} />
        </div>
      </div>

      {/* Scorecard */}
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5b7280]">Scorecard</p>
              <h2 className="mt-1 text-lg font-semibold text-[#0d2430]">Оценка по критериям</h2>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#0d2430]">{passed}/{total}</p>
              <p className="text-xs text-[#5b7280]">критериев пройдено</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-2 rounded-full bg-[#eaf4f6] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all"
              style={{ width: `${(passed / total) * 100}%` }}
            />
          </div>

          <div className="mt-5 space-y-3">
            {scorecardCriteria.map((c) => (
              <div
                key={c.id}
                className={`rounded-xl p-4 ring-1 ${c.passed ? 'bg-emerald-50/60 ring-emerald-200' : 'bg-rose-50/60 ring-rose-200'}`}
              >
                <div className="flex items-start gap-3">
                  {c.passed
                    ? <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    : <XCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#16323f]">{c.label}</p>
                    <p className="mt-1.5 text-xs italic leading-5 text-[#5b7280]">{c.quote}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Error chain */}
        <div className="space-y-5">
          <div className="rounded-[2rem] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5b7280]">Цепочка ошибок</p>
            <h2 className="mt-1 text-lg font-semibold text-[#0d2430]">Ошибка → Цитата → Рекомендация</h2>

            <div className="mt-5 space-y-4">
              {failedCriteria.map((c, i) => (
                <div key={c.id}>
                  {/* Step: Error */}
                  <div className="flex items-start gap-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700 mt-0.5">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="rounded-xl bg-rose-50 p-3 ring-1 ring-rose-200">
                        <p className="text-xs font-semibold text-rose-700 uppercase tracking-[0.14em]">Ошибка</p>
                        <p className="mt-1 text-sm font-medium text-[#16323f]">{c.label}</p>
                      </div>

                      <div className="ml-3 mt-1 flex items-center gap-1 text-[#5b7280]">
                        <ChevronRight className="size-4" />
                      </div>

                      <div className="rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200">
                        <p className="text-xs font-semibold text-amber-700 uppercase tracking-[0.14em]">Цитата</p>
                        <p className="mt-1 text-xs italic leading-5 text-[#5b7280]">{c.quote}</p>
                      </div>

                      <div className="ml-3 mt-1 flex items-center gap-1 text-[#5b7280]">
                        <ChevronRight className="size-4" />
                      </div>

                      <div className="rounded-xl bg-cyan-50 p-3 ring-1 ring-cyan-200">
                        <p className="text-xs font-semibold text-cyan-700 uppercase tracking-[0.14em]">Рекомендация</p>
                        <p className="mt-1 text-xs leading-5 text-[#16323f]">{c.recommendation}</p>
                      </div>
                    </div>
                  </div>

                  {i < failedCriteria.length - 1 && (
                    <div className="ml-3 mt-3 h-px bg-[var(--line-soft)]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick nav */}
          <div className="rounded-[1.5rem] bg-gradient-to-br from-cyan-600 to-cyan-700 p-5 text-white shadow-lg shadow-cyan-500/25">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Следующий шаг</p>
            <p className="mt-2 text-sm font-semibold">Этот оператор включён в план коучинга на неделю</p>
            <Link
              to="/coaching"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/25"
            >
              Перейти в Коучинг <ArrowLeft className="size-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
