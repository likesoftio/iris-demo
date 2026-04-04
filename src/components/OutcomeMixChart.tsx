import type { OutcomeSlice } from '../data/demoData'

interface OutcomeMixChartProps {
  slices: OutcomeSlice[]
}

const toneMap = {
  success: 'bg-emerald-400',
  risk: 'bg-rose-400',
  warning: 'bg-amber-300',
  primary: 'bg-cyan-500',
} as const

export function OutcomeMixChart({ slices }: OutcomeMixChartProps) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0)

  return (
    <div className="rounded-[1.75rem] bg-white/94 p-5 shadow-sm ring-1 ring-[var(--line-soft)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Outcome mix
      </p>
      <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[#0d2430]">
        Распределение исходов
      </h3>

      <div className="mt-6 flex h-4 overflow-hidden rounded-full bg-slate-100">
        {slices.map((slice) => (
          <div
            key={slice.id}
            className={toneMap[slice.tone]}
            style={{ width: `${(slice.value / total) * 100}%` }}
          />
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {slices.map((slice) => (
          <div key={slice.id} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={`h-3 w-3 rounded-full ${toneMap[slice.tone]}`} />
              <span className="text-sm font-medium text-[#3f5c6a]">{slice.label}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-[#0d2430]">{slice.value}</p>
              <p className="text-xs text-slate-500">
                {Math.round((slice.value / total) * 100)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
