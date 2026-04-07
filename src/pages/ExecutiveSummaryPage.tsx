import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, TrendingDown, Minus, Sparkles, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { kpiCards, trendSeries, outcomeDistribution, operatorStats } from '../data/demoData'
import { SparklineChart } from '../components/SparklineChart'
import { DonutChart } from '../components/DonutChart'
import { ErrorPatternChart } from '../components/ErrorPatternChart'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: 'easeOut' as const, delay },
})

const toneMap = {
  primary: {
    bg: 'bg-gradient-to-br from-cyan-500/10 to-sky-400/8',
    ring: 'ring-cyan-200/70',
    val: 'text-cyan-900',
    label: 'text-cyan-700',
  },
  success: {
    bg: 'bg-gradient-to-br from-emerald-400/10 to-teal-300/8',
    ring: 'ring-emerald-200/70',
    val: 'text-emerald-900',
    label: 'text-emerald-700',
  },
  risk: {
    bg: 'bg-gradient-to-br from-rose-400/12 to-orange-300/8',
    ring: 'ring-rose-200/70',
    val: 'text-rose-900',
    label: 'text-rose-700',
  },
  warning: {
    bg: 'bg-gradient-to-br from-amber-300/16 to-yellow-200/10',
    ring: 'ring-amber-200/70',
    val: 'text-amber-900',
    label: 'text-amber-700',
  },
  neutral: {
    bg: 'bg-white/80',
    ring: 'ring-slate-200/70',
    val: 'text-slate-900',
    label: 'text-slate-600',
  },
}

function TrendIcon({ positive }: { positive: boolean }) {
  if (positive) return <TrendingUp className="size-3.5 text-emerald-500" />
  return <TrendingDown className="size-3.5 text-rose-500" />
}

export function ExecutiveSummaryPage() {
  return (
    <motion.section {...fade()} className="space-y-6">
      {/* Hero */}
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <motion.article
          {...fade(0.05)}
          className="overflow-hidden rounded-[2rem] bg-white p-8 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-800">
            <Sparkles className="size-3" />
            Executive Summary · Апрель 2026
          </div>

          <h1 className="mt-5 text-4xl leading-tight tracking-[-0.04em] text-[#0d2430]">
            Клиника теряет ₽1.2 млн в&nbsp;месяц на&nbsp;неэффективных звонках
          </h1>

          <p className="mt-4 text-base leading-7 text-[#466372]">
            63.4% звонков завершаются записью — рост на&nbsp;4.1 пп. Главная точка роста: работа с&nbsp;ценовым
            возражением у&nbsp;2 операторов. Исправление даст +18% конверсии.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.25rem] bg-emerald-50/80 p-4 ring-1 ring-emerald-200">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Сильная сторона</p>
              <p className="mt-2 text-sm font-semibold text-[#0d2430]">Анна Смирнова — топ-оператор с&nbsp;91 баллом и&nbsp;275 записями</p>
            </div>
            <div className="rounded-[1.25rem] bg-amber-50/80 p-4 ring-1 ring-amber-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 size-3.5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">Риск</p>
                  <p className="mt-2 text-sm font-semibold text-[#0d2430]">Елена Сидорова — 3 отказных звонка из-за ценового возражения за 2 дня</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              to="/calls"
              className="inline-flex items-center gap-2 rounded-full bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 hover:-translate-y-0.5"
            >
              Все звонки <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/calls/10028"
              className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 ring-1 ring-rose-200 hover:-translate-y-0.5"
            >
              Слабый кейс
            </Link>
            <Link
              to="/coaching"
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:-translate-y-0.5"
            >
              Коучинг
            </Link>
          </div>
        </motion.article>

        {/* Operator leaderboard mini */}
        <motion.aside
          {...fade(0.1)}
          className="rounded-[2rem] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5b7280]">Операторы</p>
          <h3 className="mt-1 text-lg font-semibold text-[#0d2430]">Рейтинг за месяц</h3>

          <div className="mt-5 space-y-3">
            {operatorStats.map((op, i) => (
              <div key={op.id} className="flex items-center gap-3 rounded-xl bg-[#f7fbfc] px-3 py-2.5">
                <span className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-slate-300 text-slate-700' : 'bg-slate-100 text-slate-500'}`}>
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-medium text-[#16323f] truncate">{op.name}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`text-sm font-bold ${op.score >= 80 ? 'text-emerald-700' : op.score >= 65 ? 'text-amber-700' : 'text-rose-700'}`}>
                    {op.score}
                  </span>
                  {op.trend === 'up' ? <TrendingUp className="size-3.5 text-emerald-500" /> : op.trend === 'down' ? <TrendingDown className="size-3.5 text-rose-500" /> : <Minus className="size-3.5 text-slate-400" />}
                </div>
              </div>
            ))}
          </div>
        </motion.aside>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi, i) => {
          const s = toneMap[kpi.tone]
          return (
            <motion.article
              key={kpi.id}
              {...fade(0.12 + i * 0.04)}
              className={`rounded-[1.75rem] p-5 ring-1 shadow-sm ${s.bg} ${s.ring}`}
            >
              <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${s.label}`}>{kpi.label}</p>
              <p className={`mt-4 text-3xl font-bold leading-none tracking-[-0.05em] ${s.val}`}>{kpi.value}</p>
              <div className="mt-3 flex items-center gap-1">
                <TrendIcon positive={kpi.deltaPositive} />
                <span className="text-xs font-semibold text-current/80">{kpi.delta}</span>
              </div>
              <p className="mt-3 text-xs leading-5 text-current/70">{kpi.description}</p>
            </motion.article>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <motion.div {...fade(0.2)}>
          <SparklineChart points={trendSeries} />
        </motion.div>
        <motion.div {...fade(0.22)}>
          <DonutChart slices={outcomeDistribution} />
        </motion.div>
      </div>

      {/* Error Pattern Chart */}
      <motion.div {...fade(0.24)}>
        <ErrorPatternChart />
      </motion.div>

      {/* Operator table */}
      <motion.div
        {...fade(0.26)}
        className="rounded-[2rem] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5b7280]">Команда</p>
        <h3 className="mt-1 text-lg font-semibold text-[#0d2430]">Статистика операторов</h3>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--line-soft)]">
                {['Оператор', 'Звонков', 'Ср. балл', 'Записей', 'Конверсия', 'Тренд'].map(h => (
                  <th key={h} className="pb-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[#5b7280] pr-6 last:pr-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line-soft)]">
              {operatorStats.map((op) => (
                <tr key={op.id} className="hover:bg-[#f7fbfc]">
                  <td className="py-3 pr-6 font-medium text-[#16323f]">{op.name}</td>
                  <td className="py-3 pr-6 text-[#5b7280]">{op.calls.toLocaleString('ru')}</td>
                  <td className="py-3 pr-6">
                    <span className={`font-bold ${op.score >= 80 ? 'text-emerald-700' : op.score >= 65 ? 'text-amber-700' : 'text-rose-700'}`}>
                      {op.score}
                    </span>
                  </td>
                  <td className="py-3 pr-6 text-[#5b7280]">{op.converted}</td>
                  <td className="py-3 pr-6 text-[#5b7280]">{Math.round((op.converted / op.calls) * 100)}%</td>
                  <td className="py-3">
                    {op.trend === 'up' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        <TrendingUp className="size-3" /> Рост
                      </span>
                    ) : op.trend === 'down' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700">
                        <TrendingDown className="size-3" /> Падение
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                        <Minus className="size-3" /> Стабильно
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.section>
  )
}
