import type { TrendPoint } from '../data/demoData'

interface Props {
  points: TrendPoint[]
}

export function SparklineChart({ points }: Props) {
  const W = 560
  const H = 200
  const pad = { top: 20, right: 20, bottom: 40, left: 44 }
  const innerW = W - pad.left - pad.right
  const innerH = H - pad.top - pad.bottom

  const maxCalls = Math.max(...points.map(p => p.calls), 1)
  const minCalls = 0
  const periodCount = points.length
  const periodsLabel = periodCount > 0 ? `${periodCount} недель` : 'Нет данных'
  const safePointCount = Math.max(1, points.length - 1)

  const xScale = (i: number) => pad.left + (i / safePointCount) * innerW
  const yScale = (v: number) => pad.top + innerH - ((v - minCalls) / Math.max(1, maxCalls - minCalls)) * innerH

  const displayPoints = points.length ? points : [{ week: 'W0', calls: 0, converted: 0, lost: 0 }]

  const convertedPath = displayPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(p.converted)}`)
    .join(' ')

  const lostPath = displayPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(p.lost)}`)
    .join(' ')

  const areaPath =
    displayPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(p.converted)}`).join(' ') +
    ` L ${xScale(displayPoints.length - 1)} ${pad.top + innerH} L ${xScale(0)} ${pad.top + innerH} Z`

  const yTicks = [0, Math.round(maxCalls * 0.33), Math.round(maxCalls * 0.66), maxCalls]

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)] h-full">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5b7280]">Динамика звонков</p>
          <h3 className="mt-1 text-lg font-semibold text-[#0d2430]" style={{ fontFamily: 'Sora, sans-serif' }}>
            {periodsLabel}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-medium text-[#5b7280]">
            <span className="inline-block h-0.5 w-4 rounded bg-[#7fe3c5]" />
            Записались
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-[#5b7280]">
            <span className="inline-block h-0.5 w-4 rounded bg-[#ff8e7a]" />
            Потери
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7fe3c5" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#7fe3c5" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((v) => (
          <g key={v}>
            <line
              x1={pad.left}
              x2={pad.left + innerW}
              y1={yScale(v)}
              y2={yScale(v)}
              stroke="rgba(22,50,63,0.07)"
              strokeWidth={1}
            />
            <text x={pad.left - 8} y={yScale(v) + 4} textAnchor="end" fontSize={10} fill="#5b7280">
              {v}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Lost line */}
        <path d={lostPath} fill="none" stroke="#ff8e7a" strokeWidth={2} strokeDasharray="4 3" />

        {/* Converted line */}
        <path d={convertedPath} fill="none" stroke="#7fe3c5" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

        {/* Points + labels */}
        {displayPoints.map((p, i) => (
          <g key={p.week}>
            <circle cx={xScale(i)} cy={yScale(p.converted)} r={3.5} fill="#7fe3c5" stroke="white" strokeWidth={2} />
            <text x={xScale(i)} y={H - 8} textAnchor="middle" fontSize={9} fill="#5b7280">
              {p.week}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
