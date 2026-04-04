import type { CoachingRewrite } from '../data/demoData'

interface BeforeAfterCoachingCardProps {
  rewrite: CoachingRewrite
  expectedOutcomeDelta: string
}

export function BeforeAfterCoachingCard({
  rewrite,
  expectedOutcomeDelta,
}: BeforeAfterCoachingCardProps) {
  return (
    <section className="rounded-[1.75rem] bg-white/96 p-5 shadow-sm ring-1 ring-[var(--line-soft)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Coaching rewrite
      </p>
      <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[#0d2430]">
        Как улучшить разговор в следующем звонке
      </h3>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.4rem] bg-rose-400/10 p-4 ring-1 ring-rose-200">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-800">
            Как звучит сейчас
          </p>
          <p className="mt-3 text-sm leading-7 text-[#3f5c6a]">{rewrite.before}</p>
        </div>

        <div className="rounded-[1.4rem] bg-emerald-400/10 p-4 ring-1 ring-emerald-200">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
            Как должен звучать сильный ответ
          </p>
          <p className="mt-3 text-sm leading-7 text-[#3f5c6a]">{rewrite.after}</p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.4rem] bg-cyan-500/10 p-4 ring-1 ring-cyan-200">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-900">
          Ожидаемый эффект
        </p>
        <p className="mt-3 text-sm leading-7 text-[#3f5c6a]">{expectedOutcomeDelta}</p>
      </div>
    </section>
  )
}
