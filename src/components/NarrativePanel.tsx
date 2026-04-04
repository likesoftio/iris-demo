import type { NarrativeHighlight } from '../data/demoData'

interface NarrativePanelProps {
  highlights: NarrativeHighlight[]
}

export function NarrativePanel({ highlights }: NarrativePanelProps) {
  return (
    <section className="rounded-[1.75rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(234,244,246,0.92))] p-5 shadow-sm ring-1 ring-[var(--line-soft)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Executive narrative
      </p>
      <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[#0d2430]">
        Что AI-слой сказал бы руководителю
      </h3>

      <div className="mt-5 space-y-4">
        {highlights.map((highlight) => (
          <div
            key={highlight.id}
            className="rounded-[1.35rem] bg-white/90 px-4 py-4 ring-1 ring-slate-200/80"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-800">
              {highlight.label}
            </p>
            <p className="mt-3 text-sm leading-7 text-[#3f5c6a]">{highlight.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
