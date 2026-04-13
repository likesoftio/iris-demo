import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Target, CheckSquare, Square, TrendingDown, ArrowRight } from 'lucide-react'
import { useCompany } from '../context/CompanyContext'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: 'easeOut' as const, delay },
})

const impactColors = {
  high: 'bg-rose-100 text-rose-700 ring-rose-200',
  medium: 'bg-amber-100 text-amber-700 ring-amber-200',
  low: 'bg-slate-100 text-slate-600 ring-slate-200',
}
const impactLabels = { high: 'Высокий', medium: 'Средний', low: 'Низкий' }

export function CoachingPage() {
  const { companyData } = useCompany()
  const { coachingPriorities, speechTemplates, operatorProfiles, weeklyChecklist } = companyData
  const [checked, setChecked] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const categories = [...new Set(weeklyChecklist.map(i => i.category))]

  return (
    <motion.section {...fade()} className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#0d2430]">Коучинг</h1>
        <p className="mt-1 text-sm text-[#5b7280]">AI-рекомендации для руководителя продаж · {companyData.companyMeta.periodLabel}</p>
      </div>

      {/* Priorities */}
      <motion.div {...fade(0.06)}>
        <div className="mb-4 flex items-center gap-2">
          <Target className="size-4 text-cyan-600" />
          <h2 className="text-base font-semibold text-[#16323f]">Приоритеты обучения</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {coachingPriorities.map((p, i) => (
            <div
              key={p.id}
              className="rounded-[1.75rem] bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-[var(--line-soft)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-700">
                  {i + 1}
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${impactColors[p.impact]}`}>
                  {impactLabels[p.impact]} impact
                </span>
              </div>

              <h3 className="mt-4 text-sm font-semibold leading-snug text-[#0d2430]">{p.title}</h3>
              <p className="mt-2 text-xs leading-5 text-[#5b7280]">{p.description}</p>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-[#5b7280] mb-1.5">
                  <span>Частота ошибки</span>
                  <span className="font-bold text-rose-700">{p.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#eaf4f6] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-500 transition-all"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold text-[#5b7280] mb-2">Операторы:</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.operators.map(op => (
                    <span key={op} className="rounded-full bg-[#eaf4f6] px-2.5 py-0.5 text-xs font-medium text-[#16323f]">
                      {op.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Speech Templates */}
      <motion.div {...fade(0.12)}>
        <div className="mb-4 flex items-center gap-2">
          <Zap className="size-4 text-amber-500" />
          <h2 className="text-base font-semibold text-[#16323f]">Речевые шаблоны</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {speechTemplates.map((t) => (
            <div
              key={t.id}
              className="rounded-[1.75rem] bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-[var(--line-soft)]"
            >
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                <span>Ситуация:</span>
                <span>{t.situation}</span>
              </div>

              <div className="mt-5 grid gap-3 grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600 mb-2">До</p>
                  <div className="rounded-xl bg-rose-50 p-3 ring-1 ring-rose-200">
                    <p className="text-xs italic leading-5 text-[#5b7280]">{t.before}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-2">После</p>
                  <div className="rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-200">
                    <p className="text-xs italic leading-5 text-[#16323f]">{t.after}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl bg-cyan-50 px-3 py-2">
                <ArrowRight className="size-3.5 text-cyan-600 shrink-0" />
                <p className="text-xs font-semibold text-cyan-700">{t.improvement}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Operator Profiles */}
      <motion.div {...fade(0.18)}>
        <div className="mb-4 flex items-center gap-2">
          <TrendingDown className="size-4 text-rose-500" />
          <h2 className="text-base font-semibold text-[#16323f]">Профили операторов — фокус недели</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {operatorProfiles.map((op) => (
            <div
              key={op.id}
              className="rounded-[1.75rem] bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-[var(--line-soft)]"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-sm font-bold text-white shadow-lg shadow-cyan-500/25">
                  {op.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-[#0d2430]">{op.name}</h3>
                  <p className="text-xs text-[#5b7280]">{op.calls} звонков за месяц</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-2xl font-bold text-rose-600">{op.score}</p>
                  <p className="text-xs text-[#5b7280]">средний балл</p>
                </div>
              </div>

              {/* Score bar */}
              <div className="mt-4 h-2 rounded-full bg-[#eaf4f6] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-400 to-amber-400"
                  style={{ width: `${op.score}%` }}
                />
              </div>

              <div className="mt-5 grid gap-4 grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-emerald-700 mb-2">Сильные стороны</p>
                  <ul className="space-y-1">
                    {op.strengths.map(s => (
                      <li key={s} className="flex items-center gap-1.5 text-xs text-[#16323f]">
                        <span className="size-1.5 rounded-full bg-emerald-400 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-rose-700 mb-2">Точки роста</p>
                  <ul className="space-y-1">
                    {op.growthPoints.map(g => (
                      <li key={g} className="flex items-start gap-1.5 text-xs text-[#16323f]">
                        <span className="size-1.5 rounded-full bg-rose-400 shrink-0 mt-1" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Checklist */}
      <motion.div {...fade(0.24)}>
        <div className="rounded-[2rem] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5b7280]">Чеклист</p>
              <h2 className="mt-1 text-lg font-semibold text-[#0d2430]">Задачи на неделю</h2>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-cyan-700">{checked.size}/{weeklyChecklist.length}</p>
              <p className="text-xs text-[#5b7280]">выполнено</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6 h-2 rounded-full bg-[#eaf4f6] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${(checked.size / weeklyChecklist.length) * 100}%` }}
            />
          </div>

          <div className="space-y-6">
            {categories.map(cat => (
              <div key={cat}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#5b7280]">{cat}</p>
                <div className="space-y-2">
                  {weeklyChecklist.filter(i => i.category === cat).map(item => (
                    <button
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left ring-1 transition-all hover:-translate-y-0.5"
                      style={{
                        backgroundColor: checked.has(item.id) ? 'rgba(127,227,197,0.12)' : 'white',
                        borderColor: checked.has(item.id) ? 'rgba(127,227,197,0.5)' : 'rgba(22,50,63,0.08)',
                      }}
                    >
                      {checked.has(item.id)
                        ? <CheckSquare className="size-5 text-emerald-500 shrink-0" />
                        : <Square className="size-5 text-[#5b7280] shrink-0" />
                      }
                      <span className={`text-sm ${checked.has(item.id) ? 'text-[#5b7280] line-through' : 'text-[#16323f] font-medium'}`}>
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
}
