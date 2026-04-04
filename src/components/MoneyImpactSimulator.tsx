import { useMemo, useState } from 'react'

import type { MoneyImpactScenario } from '../data/demoData'

interface MoneyImpactSimulatorProps {
  scenarios: MoneyImpactScenario[]
}

export function MoneyImpactSimulator({
  scenarios,
}: MoneyImpactSimulatorProps) {
  const [selectedId, setSelectedId] = useState(scenarios[1]?.id ?? scenarios[0]?.id)

  const selectedScenario = useMemo(
    () =>
      scenarios.find((scenario) => scenario.id === selectedId) ?? scenarios[0],
    [scenarios, selectedId],
  )

  if (!selectedScenario) return null

  return (
    <section className="rounded-[1.75rem] bg-white/95 p-5 shadow-sm ring-1 ring-[var(--line-soft)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Money impact simulator
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[#0d2430]">
            Если вернуть утечки в запись
          </h3>
        </div>
        <div className="inline-flex rounded-full bg-slate-100 p-1">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              onClick={() => setSelectedId(scenario.id)}
              className={`rounded-full px-3 py-2 text-xs font-semibold ${
                scenario.id === selectedScenario.id
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-[#56717f]'
              }`}
            >
              {scenario.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.4rem] bg-cyan-500/10 p-4 ring-1 ring-cyan-200">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-900/70">
            Восстановленные звонки
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#0d2430]">
            {selectedScenario.recoveredCalls}
          </p>
        </div>
        <div className="rounded-[1.4rem] bg-emerald-400/12 p-4 ring-1 ring-emerald-200">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-900/70">
            Доп. записи
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#0d2430]">
            {selectedScenario.extraBookings}
          </p>
        </div>
        <div className="rounded-[1.4rem] bg-amber-300/18 p-4 ring-1 ring-amber-200">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-900/70">
            Доп. выручка
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#0d2430]">
            {selectedScenario.revenueLift}
          </p>
        </div>
      </div>
    </section>
  )
}
