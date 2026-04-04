import type { OperatorStat } from '../data/demoData'

interface OperatorPerformancePanelProps {
  operators: OperatorStat[]
}

export function OperatorPerformancePanel({
  operators,
}: OperatorPerformancePanelProps) {
  const maxScore = Math.max(...operators.map((operator) => operator.avgScore), 1)

  return (
    <div className="rounded-[1.75rem] bg-white/94 p-5 shadow-sm ring-1 ring-[var(--line-soft)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Operator performance
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[#0d2430]">
            Топ операторы
          </h3>
        </div>
        <div className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-900">
          {operators.length} операторов
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {operators.map((operator) => (
          <div key={operator.id} className="rounded-[1.4rem] bg-slate-50/90 p-4 ring-1 ring-slate-200/80">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-[#0d2430]">{operator.name}</p>
                <p className="text-sm text-slate-500">{operator.callsHandled} звонков</p>
              </div>
              <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-cyan-900 ring-1 ring-slate-200">
                Score {operator.avgScore}
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#1FB7C9,#6BC6FF)]"
                style={{ width: `${(operator.avgScore / maxScore) * 100}%` }}
              />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Сильная сторона
                </p>
                <p className="mt-2 text-sm leading-6 text-[#3f5c6a]">
                  {operator.strengthLabel}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                  Зона внимания
                </p>
                <p className="mt-2 text-sm leading-6 text-[#3f5c6a]">
                  {operator.attentionLabel}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                Booking {operator.bookedRate}
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                Risk {operator.riskShare}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
