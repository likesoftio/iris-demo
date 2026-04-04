import type { BenchmarkStat } from '../data/demoData'

interface BenchmarkStripProps {
  stats: BenchmarkStat[]
}

export function BenchmarkStrip({ stats }: BenchmarkStripProps) {
  return (
    <section className="rounded-[1.75rem] bg-white/95 p-5 shadow-sm ring-1 ring-[var(--line-soft)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Benchmark strip
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[#0d2430]">
            Текущий уровень vs цель vs лучший стандарт
          </h3>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="rounded-[1.35rem] bg-slate-50/90 p-4 ring-1 ring-slate-200/80"
          >
            <p className="text-sm font-semibold text-[#0d2430]">{stat.label}</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3 text-[#56717f]">
                <span>Сейчас</span>
                <span className="font-semibold text-[#0d2430]">{stat.current}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[#56717f]">
                <span>Цель</span>
                <span className="font-semibold text-cyan-900">{stat.target}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[#56717f]">
                <span>Лучший</span>
                <span className="font-semibold text-emerald-900">{stat.best}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
