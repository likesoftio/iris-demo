import type { OutcomeSlice } from '../data/demoData'

interface Props {
  slices: OutcomeSlice[]
}

export function DonutChart({ slices }: Props) {
  const R = 70
  const r = 46
  const cx = 110
  const cy = 110

  const total = Math.max(1, slices.reduce((s, sl) => s + sl.value, 0))

  const paths = slices.map((sl, index) => {
    const cumulativeBefore = slices.slice(0, index).reduce((sum, item) => sum + item.value, 0)
    const cumulativeAfter = cumulativeBefore + sl.value
    const startAngle = (cumulativeBefore / total) * 2 * Math.PI - Math.PI / 2
    const endAngle = (cumulativeAfter / total) * 2 * Math.PI - Math.PI / 2

    const x1 = cx + R * Math.cos(startAngle)
    const y1 = cy + R * Math.sin(startAngle)
    const x2 = cx + R * Math.cos(endAngle)
    const y2 = cy + R * Math.sin(endAngle)
    const ix1 = cx + r * Math.cos(endAngle)
    const iy1 = cy + r * Math.sin(endAngle)
    const ix2 = cx + r * Math.cos(startAngle)
    const iy2 = cy + r * Math.sin(startAngle)
    const largeArc = sl.value / total > 0.5 ? 1 : 0

    return {
      d: `M ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${r} ${r} 0 ${largeArc} 0 ${ix2} ${iy2} Z`,
      color: sl.color,
      label: sl.label,
      value: sl.value,
    }
  })

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)] h-full">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5b7280]">Исходы звонков</p>
      <h3 className="mt-1 text-lg font-semibold text-[#0d2430]" style={{ fontFamily: 'Sora, sans-serif' }}>
        Распределение
      </h3>

      <div className="mt-4 flex items-center gap-4">
        <svg viewBox="0 0 220 220" className="w-36 shrink-0">
          {paths.map((p) => (
            <path
              key={p.label}
              d={p.d}
              fill={p.color}
              stroke="white"
              strokeWidth={2}
            />
          ))}
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize={22} fontWeight={700} fill="#0d2430" fontFamily="Sora, sans-serif">
            63%
          </text>
          <text x={cx} y={cy + 14} textAnchor="middle" fontSize={10} fill="#5b7280">
            конверсия
          </text>
        </svg>

        <div className="space-y-3">
          {slices.map((sl) => (
            <div key={sl.label} className="flex items-center gap-2">
              <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: sl.color }} />
              <span className="text-xs text-[#5b7280] flex-1">{sl.label}</span>
              <span className="text-xs font-bold text-[#0d2430]">{sl.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
