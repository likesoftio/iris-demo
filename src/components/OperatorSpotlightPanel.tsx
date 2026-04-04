import type { OperatorSpotlight } from '../data/demoData'

interface OperatorSpotlightPanelProps {
  spotlights: OperatorSpotlight[]
}

const toneClass = {
  success: 'bg-emerald-400/12 text-emerald-950 ring-emerald-200',
  warning: 'bg-amber-300/16 text-amber-950 ring-amber-200',
  risk: 'bg-rose-400/14 text-rose-950 ring-rose-200',
  primary: 'bg-cyan-500/12 text-cyan-950 ring-cyan-200',
} as const

export function OperatorSpotlightPanel({
  spotlights,
}: OperatorSpotlightPanelProps) {
  return (
    <section className="rounded-[1.75rem] bg-white/95 p-5 shadow-sm ring-1 ring-[var(--line-soft)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Operator spotlight
      </p>
      <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[#0d2430]">
        Кто тянет результат вверх, а где нужен коучинг
      </h3>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {spotlights.map((spotlight) => (
          <div
            key={spotlight.id}
            className={`rounded-[1.35rem] p-4 ring-1 ${toneClass[spotlight.tone]}`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-current/75">
              {spotlight.title}
            </p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-lg font-semibold text-[#0d2430]">
                {spotlight.operatorName}
              </p>
              <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-current ring-1 ring-current/10">
                {spotlight.metric}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#3f5c6a]">{spotlight.note}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
