import { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, User, Calendar, Clock } from 'lucide-react'
import { WaveformBar } from '../components/WaveformBar'
import { TranscriptViewer } from '../components/TranscriptViewer'
import { useCompany } from '../context/CompanyContext'

type Tab = 'analysis' | 'transcript'

export function CallDetailPage() {
  const { companyData } = useCompany()
  const { callId } = useParams()
  const call = companyData.callsData.find((item) => item.id === callId)
  const [tab, setTab] = useState<Tab>('analysis')

  if (!call) {
    return (
      <div className="py-16 text-center space-y-4">
        <h1 className="text-xl font-semibold text-[#0d2430]">Звонок не найден</h1>
        <p className="text-sm text-[#5b7280]">Звонок #{callId} не существует в базе.</p>
        <Link to="/calls" className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white">
          Назад к списку
        </Link>
      </div>
    )
  }

  const scorecardCriteria = companyData.scorecardByCall[call.id] ?? []
  const passed = scorecardCriteria.filter((criterion) => criterion.passed).length
  const total = scorecardCriteria.length
  const failedCriteria = scorecardCriteria.filter((criterion) => !criterion.passed)
  const transcript = companyData.transcripts[call.id] ?? []

  const outcomeColor = call.outcome === 'Сделка'
    ? 'bg-emerald-100 text-emerald-800 ring-emerald-200'
    : call.outcome === 'Без сделки'
      ? 'bg-rose-100 text-rose-800 ring-rose-200'
      : call.outcome === 'Follow-up'
        ? 'bg-amber-100 text-amber-800 ring-amber-200'
        : 'bg-sky-100 text-sky-800 ring-sky-200'

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' as const }}
      className="space-y-5"
    >
      <Link to="/calls" className="inline-flex items-center gap-1.5 text-sm text-[#5b7280] hover:text-cyan-700">
        <ArrowLeft className="size-4" />
        К списку звонков
      </Link>

      {/* Header card */}
      <div className="rounded-2xl bg-white p-5 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5b7280]">Звонок #{call.id}</p>
            <h1 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[#0d2430]">{call.operator}</h1>
              <p className="text-xs text-[#5b7280] mt-1">Тип: {call.callType}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ring-1 ${outcomeColor}`}>
            {call.outcome}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-5">
          {[
            { icon: Calendar, label: 'Дата', value: call.date },
            { icon: Clock, label: 'Длина', value: call.duration },
            { icon: User, label: 'Телефон', value: call.phone },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-full bg-[#eaf4f6]">
                <Icon className="size-3.5 text-cyan-700" />
              </div>
              <div>
                <p className="text-[11px] text-[#5b7280]">{label}</p>
                <p className="text-sm font-semibold text-[#16323f]">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <WaveformBar duration={call.duration} score={call.score} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex w-full gap-1 rounded-xl bg-[#f0f4f6] p-1 sm:w-fit">
        {([['analysis', 'Анализ'], ['transcript', 'Транскрипция']] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={[
              'flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all sm:flex-none sm:px-5',
              tab === key
                ? 'bg-white text-cyan-700 shadow-sm ring-1 ring-[var(--line-soft)]'
                : 'text-[#5b7280] hover:text-[#16323f]',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Analysis tab */}
      {tab === 'analysis' && (
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          {/* Scorecard */}
          <div className="rounded-2xl bg-white p-5 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5b7280]">Scorecard</p>
                <h2 className="mt-1 text-base font-semibold text-[#0d2430]">Оценка по критериям</h2>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#0d2430]">{passed}/{total}</p>
                <p className="text-[11px] text-[#5b7280]">пройдено</p>
              </div>
            </div>

            <div className="mt-3 h-1.5 rounded-full bg-[#eaf4f6] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                    style={{ width: `${total > 0 ? (passed / total) * 100 : 0}%` }}
              />
            </div>

            <div className="mt-4 space-y-2">
              {scorecardCriteria.map((c) => (
                <div
                  key={c.id}
                  className={`rounded-xl p-3 ring-1 ${c.passed ? 'bg-emerald-50/60 ring-emerald-200' : 'bg-rose-50/60 ring-rose-200'}`}
                >
                  <div className="flex items-start gap-2.5">
                    {c.passed
                      ? <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                      : <XCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
                    }
                    <div>
                      <p className="text-sm font-semibold text-[#16323f]">{c.label}</p>
                      <p className="mt-1 text-xs italic leading-5 text-[#5b7280]">{c.quote}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error chain + CTA */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-5 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5b7280]">Цепочка ошибок</p>
              <h2 className="mt-1 text-base font-semibold text-[#0d2430]">Ошибка → Цитата → Рекомендация</h2>

              <div className="mt-4 space-y-4">
                {failedCriteria.map((c, i) => (
                  <div key={c.id}>
                    <div className="flex items-start gap-3">
                      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-[10px] font-bold text-rose-700 mt-0.5">
                        {i + 1}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="rounded-lg bg-rose-50 p-2.5 ring-1 ring-rose-200">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-700">Ошибка</p>
                          <p className="mt-0.5 text-sm font-medium text-[#16323f]">{c.label}</p>
                        </div>
                        <div className="ml-2 flex items-center text-[#5b7280]"><ChevronRight className="size-3.5" /></div>
                        <div className="rounded-lg bg-amber-50 p-2.5 ring-1 ring-amber-200">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">Цитата</p>
                          <p className="mt-0.5 text-xs italic leading-5 text-[#5b7280]">{c.quote}</p>
                        </div>
                        <div className="ml-2 flex items-center text-[#5b7280]"><ChevronRight className="size-3.5" /></div>
                        <div className="rounded-lg bg-cyan-50 p-2.5 ring-1 ring-cyan-200">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-cyan-700">Рекомендация</p>
                          <p className="mt-0.5 text-xs leading-5 text-[#16323f]">{c.recommendation}</p>
                        </div>
                      </div>
                    </div>
                    {i < failedCriteria.length - 1 && <div className="mt-3 h-px bg-[var(--line-soft)]" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-cyan-600 to-cyan-700 p-5 text-white shadow-lg shadow-cyan-500/25">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-cyan-200">Следующий шаг</p>
              <p className="mt-1.5 text-sm font-semibold">Оператор включён в план коучинга на неделю</p>
              <Link to="/coaching" className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/25">
                Перейти в Коучинг <ChevronRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Transcript tab */}
      {tab === 'transcript' && (
        <div className="rounded-2xl bg-white p-5 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5b7280]">Транскрипция</p>
              <h2 className="mt-1 text-base font-semibold text-[#0d2430]">Расшифровка разговора</h2>
            </div>
            <div className="flex gap-4 text-xs text-[#5b7280]">
              <span className="flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-full bg-cyan-100 ring-1 ring-cyan-300" /> Оператор</span>
              <span className="flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-full bg-slate-100 ring-1 ring-slate-300" /> Клиент</span>
            </div>
          </div>
          <div className="mb-4">
            <WaveformBar duration={call.duration} score={call.score} />
          </div>
          <TranscriptViewer lines={transcript} />
        </div>
      )}
    </motion.section>
  )
}
