import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, AlertTriangle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SparklineChart } from '../components/SparklineChart'
import { DonutChart } from '../components/DonutChart'
import { ErrorPatternChart } from '../components/ErrorPatternChart'
import { PerformanceOverviewCard } from '../components/PerformanceOverviewCard'
import { useCompany } from '../context/CompanyContext'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: 'easeOut' as const, delay },
})

function ScoreColor({ score }: { score: number }) {
  if (score >= 75) return <span className="font-bold text-emerald-700">{score}</span>
  if (score >= 55) return <span className="font-bold text-amber-700">{score}</span>
  return <span className="font-bold text-rose-700">{score}</span>
}

export function ExecutiveSummaryPage() {
  const { companyData } = useCompany()
  const { kpiCards, trendSeries, outcomeDistribution, operatorStats } = companyData
  const topOperator = operatorStats[0]
  const reviewCalls = companyData.callsData.filter((call) => call.riskLevel === 'high').length

  return (
    <motion.section {...fade()} className="space-y-5">
      {/* Compact hero strip */}
      <motion.div
        {...fade(0.04)}
        className="flex flex-wrap items-center gap-4 rounded-2xl bg-white px-4 py-4 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)] sm:px-6"
      >
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-700">
            Executive Summary · {companyData.companyMeta.periodLabel}
          </p>
          <h1 className="mt-1 text-lg font-bold tracking-[-0.03em] text-[#0d2430] sm:text-xl">
            Качество продаж и сервиса: {companyData.companyMeta.name}
          </h1>
          <p className="mt-1 text-sm text-[#466372]">
            Автоматический разбор звонков по B2B-критериям с фокусом на конверсию, возражения и следующий шаг.
          </p>
        </div>
        <div className="flex w-full shrink-0 flex-wrap gap-2 sm:w-auto">
          <Link to="/calls" className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow shadow-cyan-500/25 transition-transform hover:-translate-y-0.5 sm:flex-none">
            Все звонки <ArrowRight className="size-3.5" />
          </Link>
          <Link to="/coaching" className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition-transform hover:-translate-y-0.5 sm:flex-none">
            Коучинг
          </Link>
        </div>
      </motion.div>

      {/* KPI compact grid — 4 in one row */}
      <motion.div {...fade(0.08)} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpiCards.map((kpi) => {
          const isPos = kpi.deltaPositive
          return (
            <div key={kpi.id} className="rounded-xl bg-white px-4 py-3 ring-1 ring-[var(--line-soft)] shadow-sm flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-[#5b7280] truncate">{kpi.label}</p>
                <p className="mt-0.5 text-2xl font-bold tracking-[-0.04em] text-[#0d2430]">{kpi.value}</p>
                <div className="mt-1 flex items-center gap-1">
                  {isPos
                    ? <TrendingUp className="size-3 text-emerald-500 shrink-0" />
                    : <TrendingDown className="size-3 text-rose-500 shrink-0" />
                  }
                  <span className={`text-[11px] font-semibold ${isPos ? 'text-emerald-700' : 'text-rose-700'}`}>{kpi.delta}</span>
                </div>
              </div>
            </div>
          )
        })}
      </motion.div>

      {/* Alerts row */}
      <motion.div {...fade(0.1)} className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-xl bg-emerald-50/80 px-4 py-3 ring-1 ring-emerald-200">
          <TrendingUp className="size-4 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Лучший оператор</p>
            <p className="mt-0.5 text-sm font-semibold text-[#0d2430]">
              {topOperator ? `${topOperator.name} — ${topOperator.score}/100, ${topOperator.converted} сделок` : 'Нет данных'}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl bg-amber-50/80 px-4 py-3 ring-1 ring-amber-200">
          <AlertTriangle className="size-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">На контроле</p>
            <p className="mt-0.5 text-sm font-semibold text-[#0d2430]">{reviewCalls} звонков требуют проверки</p>
          </div>
        </div>
      </motion.div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <motion.div {...fade(0.12)}>
          <SparklineChart points={trendSeries} />
        </motion.div>
        <motion.div {...fade(0.14)}>
          <DonutChart slices={outcomeDistribution} />
        </motion.div>
      </div>

      {/* Error chart */}
      <motion.div {...fade(0.16)}>
        <ErrorPatternChart patterns={companyData.errorPatterns} />
      </motion.div>

      {/* Performance overview */}
      <motion.div {...fade(0.17)}>
        <PerformanceOverviewCard
          performanceMetrics={companyData.performanceMetrics}
          operatorStats={operatorStats}
          callsData={companyData.callsData}
          periodLabel={companyData.companyMeta.periodLabel}
        />
      </motion.div>

      {/* Compact operator table */}
      <motion.div {...fade(0.18)} className="rounded-2xl bg-white shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--line-soft)]">
          <h3 className="text-sm font-semibold text-[#0d2430]">Операторы · {companyData.companyMeta.periodLabel}</h3>
          <span className="text-xs text-[#5b7280]">{operatorStats.length} операторов</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--line-soft)] bg-[#f7fbfc]">
                {['Оператор', 'Звонков', 'Балл', 'Сделок', 'Конверсия', 'Тренд'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5b7280]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line-soft)]">
              {operatorStats.map((op) => (
                <tr key={op.id} className="hover:bg-[#f7fbfc] transition-colors">
                  <td className="px-4 py-2.5 font-medium text-[#16323f]">{op.name}</td>
                  <td className="px-4 py-2.5 text-[#5b7280]">{op.calls.toLocaleString('ru')}</td>
                  <td className="px-4 py-2.5"><ScoreColor score={op.score} /></td>
                  <td className="px-4 py-2.5 text-[#5b7280]">{op.converted}</td>
                  <td className="px-4 py-2.5 text-[#5b7280]">{Math.round((op.converted / op.calls) * 100)}%</td>
                  <td className="px-4 py-2.5">
                    {op.trend === 'up'
                      ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700"><TrendingUp className="size-3" />Рост</span>
                      : op.trend === 'down'
                      ? <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700"><TrendingDown className="size-3" />Падение</span>
                      : <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600"><Minus className="size-3" />Стабильно</span>
                    }
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
