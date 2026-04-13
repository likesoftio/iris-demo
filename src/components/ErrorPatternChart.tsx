import { useNavigate } from 'react-router-dom'
import type { ErrorPattern } from '../data/demoData'

export function ErrorPatternChart({ patterns }: { patterns: ErrorPattern[] }) {
  const navigate = useNavigate()
  const max = Math.max(...patterns.map((p) => p.percent), 1)

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5b7280]">Паттерны ошибок команды</p>
      <h3 className="mt-1 text-lg font-semibold text-[#0d2430]">Топ-5 нарушений</h3>

      <div className="mt-5 space-y-3.5">
        {patterns.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate(`/calls?pattern=${p.id}`)}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-cyan-50"
          >
            <span className="w-44 shrink-0 text-sm text-[#466372] group-hover:text-cyan-700 truncate">
              {p.label}
            </span>
            <div className="relative flex-1 h-2 rounded-full bg-[#eaf4f6] overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-[#1fb7c9] transition-all duration-500"
                style={{ width: `${(p.percent / max) * 100}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-sm font-semibold text-[#0d2430]">
              {p.percent}%
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
