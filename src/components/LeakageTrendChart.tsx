import type { TrendPoint } from '../data/demoData'

interface LeakageTrendChartProps {
  points: TrendPoint[]
}

export function LeakageTrendChart({ points }: LeakageTrendChartProps) {
  const chartWidth = 320
  const chartHeight = 120
  const maxValue = Math.max(...points.map((point) => point.totalCalls), 1)
  const stepX = chartWidth / Math.max(points.length - 1, 1)

  const totalPath = points
    .map((point, index) => {
      const x = stepX * index
      const y = chartHeight - (point.totalCalls / maxValue) * chartHeight
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  const leakagePath = points
    .map((point, index) => {
      const x = stepX * index
      const y = chartHeight - (point.leakageCalls / maxValue) * chartHeight
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  const areaPath = `${totalPath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`

  return (
    <div className="rounded-[1.75rem] bg-white/94 p-5 shadow-sm ring-1 ring-[var(--line-soft)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Leakage trend
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[#0d2430]">
            Динамика звонков и утечек
          </h3>
        </div>
        <div className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-900">
          7 дней
        </div>
      </div>

      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight + 8}`}
        className="mt-6 h-40 w-full"
        role="img"
        aria-label="Leakage trend chart"
      >
        <path d={areaPath} fill="rgba(107, 198, 255, 0.18)" />
        <path
          d={totalPath}
          fill="none"
          stroke="#1FB7C9"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={leakagePath}
          fill="none"
          stroke="#FF8E7A"
          strokeWidth="3"
          strokeDasharray="6 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((point, index) => {
          const x = stepX * index
          const y = chartHeight - (point.leakageCalls / maxValue) * chartHeight
          return <circle key={point.label} cx={x} cy={y} r="4" fill="#FF8E7A" />
        })}
      </svg>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
            Все звонки
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            Утечки
          </span>
        </div>

        <div className="flex gap-2">
          {points.map((point) => (
            <span
              key={point.label}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500"
            >
              {point.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
