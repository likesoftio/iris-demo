import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import type { CallRecord, OperatorStat, PerformanceMetric } from '../data/demoData'

interface PerformanceOverviewCardProps {
  performanceMetrics: PerformanceMetric[]
  operatorStats: OperatorStat[]
  callsData: CallRecord[]
  periodLabel: string
}

export function PerformanceOverviewCard({ performanceMetrics, operatorStats, callsData, periodLabel }: PerformanceOverviewCardProps) {
  const avgScore = operatorStats.length
    ? Math.round(operatorStats.reduce((s, o) => s + o.score, 0) / operatorStats.length)
    : 0
  const conversionRate = operatorStats.length
    ? Math.round(operatorStats.reduce((s, o) => s + (o.converted / Math.max(1, o.calls)) * 100, 0) / operatorStats.length)
    : 0
  const topOperators = [...operatorStats].sort((a, b) => b.score - a.score).slice(0, 2)
  const riskyCallsCount = callsData.filter((c) => c.score < 55 || c.riskLevel === 'high').length

  return (
    <div className="rounded-[2rem] bg-white shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)] overflow-hidden">
      <div className="px-6 pt-5 pb-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5b7280]">Обзор производительности</p>
        <p className="mt-0.5 text-[11px] text-[#5b7280]">
          Анализ диалогов операторов по ключевым показателям · {periodLabel}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-0 divide-y md:divide-y-0 md:divide-x divide-[var(--line-soft)]">
        {/* Left: radar + badges */}
        <div className="px-6 py-4 flex flex-col items-center gap-4">
          {/* Score + rate badges */}
          <div className="flex gap-3 w-full">
            <div className="flex-1 rounded-xl bg-[#f0fdf8] ring-1 ring-emerald-100 px-4 py-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Средний балл</p>
              <p className="mt-1 text-3xl font-bold tracking-[-0.05em] text-[#0d2430]">{(avgScore / 20).toFixed(2)}</p>
              <p className="text-[11px] text-emerald-700">из 5</p>
            </div>
            <div className="flex-1 rounded-xl bg-[#f0f7ff] ring-1 ring-cyan-100 px-4 py-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-700">Конверсия</p>
              <p className="mt-1 text-3xl font-bold tracking-[-0.05em] text-[#0d2430]">{conversionRate}%</p>
              <p className="text-[11px] text-cyan-700">в запись</p>
            </div>
          </div>

          {/* Radar chart */}
          <div className="w-full">
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={performanceMetrics} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
                <PolarGrid stroke="#e5eaec" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 11, fill: '#5b7280', fontWeight: 600 }}
                />
                <Radar
                  name="Показатели"
                  dataKey="value"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.18}
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#06b6d4', strokeWidth: 0 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Metric bars */}
          <div className="w-full space-y-2">
            {performanceMetrics.map(m => (
              <div key={m.subject} className="flex items-center gap-2">
                <span className="w-24 text-[11px] font-medium text-[#5b7280] shrink-0">{m.subject}</span>
                <div className="flex-1 h-1.5 rounded-full bg-[#eaf4f6] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-cyan-400 transition-all"
                    style={{ width: `${m.value}%` }}
                  />
                </div>
                <span className={`w-8 text-right text-[11px] font-semibold ${m.value >= 75 ? 'text-emerald-700' : m.value >= 55 ? 'text-amber-700' : 'text-rose-700'}`}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: top operators + risky calls */}
        <div className="px-6 py-4 flex flex-col gap-5 md:w-64">
          {/* Top operators */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5b7280] mb-3">Лучшие операторы</p>
            <div className="space-y-2">
              {topOperators.map((op, i) => (
                <div key={op.id} className="flex items-center gap-3 rounded-xl bg-[#f7fbfc] px-3 py-2.5 ring-1 ring-[var(--line-soft)]">
                  <div className="size-8 rounded-full bg-cyan-100 flex items-center justify-center text-[11px] font-bold text-cyan-700 shrink-0">
                    {op.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#16323f] truncate">{op.name.split(' ')[0]} {op.name.split(' ')[1]?.[0]}.</p>
                    <p className="text-[10px] text-[#5b7280]">{op.calls} звонков</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-bold ${op.score >= 80 ? 'text-emerald-700' : 'text-amber-700'}`}>{(op.score / 20).toFixed(2)}</p>
                    {i === 0 && <TrendingUp className="size-3 text-emerald-500 ml-auto" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risky calls counter */}
          <div className="rounded-xl bg-amber-50 ring-1 ring-amber-200 px-4 py-3 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">Требуют проверки</p>
            <p className="mt-1 text-4xl font-bold tracking-[-0.05em] text-amber-800">{riskyCallsCount}</p>
            <p className="text-[11px] text-amber-700">звонков в риске</p>
          </div>

          {/* Problematic calls list */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5b7280] mb-3">Звонки, ожидающие проверки</p>
            <div className="space-y-1.5">
              {callsData.filter(c => c.score < 55).slice(0, 4).map(call => (
                <div key={call.id} className="flex items-center gap-2 rounded-lg px-3 py-2 ring-1 ring-[var(--line-soft)] bg-white">
                  <div className="size-6 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-bold text-rose-700">{call.score}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-[#16323f] truncate">{call.operator.split(' ')[0]}</p>
                    <p className="text-[10px] text-[#5b7280] truncate">{call.errorType || 'Требует проверки'}</p>
                  </div>
                  <span className="text-[10px] text-[#5b7280] shrink-0">{call.date.split(',')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
