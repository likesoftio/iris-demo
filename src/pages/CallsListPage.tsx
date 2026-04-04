import { useMemo, useState } from 'react'
import { AlertTriangle, ArrowUpRight, Filter, ShieldAlert } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { demoData } from '../data/demoData'

export function CallsListPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'high-risk'>('all')
  const [selectedOperatorId, setSelectedOperatorId] = useState<'all' | string>('all')

  const selectedOperator =
    selectedOperatorId === 'all'
      ? null
      : demoData.operatorStats.find((operator) => operator.id === selectedOperatorId) ?? null

  const filteredCalls = useMemo(() => {
    let nextCalls = demoData.callListItems

    if (activeFilter === 'high-risk') {
      nextCalls = nextCalls.filter((call) => call.riskLevel === 'high')
    }

    if (selectedOperatorId !== 'all') {
      nextCalls = nextCalls.filter((call) => call.operatorId === selectedOperatorId)
    }

    return nextCalls
  }, [activeFilter, selectedOperatorId])

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 rounded-[2rem] bg-white p-8 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Call review flow
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#0d2430]">
              Разбор звонков с быстрым фокусом на риски
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[#496674]">
              Отфильтруйте проблемные кейсы, откройте звонок и перейдите к
              доказательным цитатам, breakdown и конкретному next step.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-full bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  activeFilter === 'all'
                    ? 'bg-white text-[#0d2430] shadow-sm'
                    : 'text-[#56717f]'
                }`}
              >
                All calls
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('high-risk')}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  activeFilter === 'high-risk'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-[#56717f]'
                }`}
              >
                High risk
              </button>
            </div>

            <label className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-[#456170]">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Operator filter
              </span>
              <select
                aria-label="Operator filter"
                value={selectedOperatorId}
                onChange={(event) => setSelectedOperatorId(event.target.value)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-[#0d2430] outline-none"
              >
                <option value="all">Все операторы</option>
                {demoData.operatorStats.map((operator) => (
                  <option key={operator.id} value={operator.id}>
                    {operator.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {demoData.operatorStats.slice(0, 3).map((operator) => (
            <div
              key={operator.id}
              className="rounded-[1.4rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(234,244,246,0.92))] p-4 ring-1 ring-slate-200/80"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-[#0d2430]">{operator.name}</p>
                  <p className="text-sm text-slate-500">{operator.callsHandled} звонков</p>
                </div>
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-900">
                  {operator.bookedRate}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-[#496674]">
                {operator.strengthLabel}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-900">
            <Filter className="size-4" />
            {filteredCalls.length} звонков в текущем срезе
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-900">
            <ShieldAlert className="size-4" />
            Показываем проблемные кейсы через outcome и risk markers
          </div>
          {selectedOperator ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Активный оператор
              </span>
              <span className="font-semibold text-[#0d2430]">
                {selectedOperator.name}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {filteredCalls.length === 0 ? (
        <div className="rounded-[1.75rem] bg-white/96 p-8 text-center shadow-sm ring-1 ring-[var(--line-soft)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Empty state
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[#0d2430]">
            В этом срезе пока нет звонков
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#496674]">
            Попробуйте сбросить risk-фильтр или выбрать другого оператора, чтобы
            вернуться к активным кейсам.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4">
        {filteredCalls.map((call) => (
          <motion.article
            key={call.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="group rounded-[1.75rem] bg-white/95 p-5 shadow-sm ring-1 ring-[var(--line-soft)] transition-transform hover:-translate-y-0.5"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {call.id}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      call.riskLabel === 'Высокий риск'
                        ? 'bg-rose-500/12 text-rose-900'
                        : call.riskLabel === 'Средний риск'
                          ? 'bg-amber-300/20 text-amber-950'
                          : 'bg-emerald-400/14 text-emerald-950'
                    }`}
                  >
                    {call.riskLabel}
                  </span>
                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-900">
                    Score {call.score}
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#0d2430]">
                    {call.title}
                  </h2>
                  <p className="mt-2 text-sm font-medium text-[#58727f]">
                    {call.patientName} · {call.intent}
                  </p>
                </div>

                <p className="max-w-3xl text-sm leading-7 text-[#496674]">
                  {call.summary}
                </p>
              </div>

              <div className="flex min-w-[12rem] flex-col items-start gap-3 rounded-[1.4rem] bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <AlertTriangle className="size-4 text-amber-500" />
                  {call.statusLabel}
                </div>
                <Link
                  to={`/calls/${call.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-transform group-hover:-translate-y-0.5"
                >
                  Открыть звонок
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}
