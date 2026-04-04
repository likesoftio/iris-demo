import type { ServiceLineStat } from '../data/demoData'

interface ServiceLineHeatmapProps {
  items: ServiceLineStat[]
}

const toneClass = {
  success: 'bg-emerald-400/15 text-emerald-950',
  warning: 'bg-amber-300/20 text-amber-950',
  risk: 'bg-rose-400/16 text-rose-950',
  primary: 'bg-cyan-500/12 text-cyan-950',
} as const

export function ServiceLineHeatmap({ items }: ServiceLineHeatmapProps) {
  return (
    <section className="rounded-[1.75rem] bg-white/95 p-5 shadow-sm ring-1 ring-[var(--line-soft)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Service line heatmap
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[#0d2430]">
            Где риски распределены по направлениям
          </h3>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[1.35rem] ring-1 ring-slate-200/80">
        <div className="grid grid-cols-[1.5fr_0.8fr_0.8fr_0.8fr] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          <span>Направление</span>
          <span>Объем</span>
          <span>Score</span>
          <span>Потери</span>
        </div>

        {items.map((item) => (
          <div
            key={item.id}
            className={`grid grid-cols-[1.5fr_0.8fr_0.8fr_0.8fr] items-center gap-3 px-4 py-3 text-sm ${toneClass[item.tone]}`}
          >
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-xs opacity-70">Loss rate {item.lossRate}</p>
            </div>
            <span className="font-semibold">{item.volume}</span>
            <span className="font-semibold">{item.avgScore}</span>
            <span className="font-semibold">{item.leakageCount}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
