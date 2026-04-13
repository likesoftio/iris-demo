import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, SlidersHorizontal, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { type CallRecord, type Outcome } from '../data/demoData'
import { useCompany } from '../context/CompanyContext'

type SortKey = keyof Pick<CallRecord, 'date' | 'operator' | 'durationSec' | 'score' | 'outcome'>
type SortDir = 'asc' | 'desc'

const outcomeColors: Record<Outcome, string> = {
  'Сделка': 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  'Без сделки': 'bg-rose-100 text-rose-800 ring-rose-200',
  'Follow-up': 'bg-amber-100 text-amber-800 ring-amber-200',
  'Сервис': 'bg-sky-100 text-sky-800 ring-sky-200',
}

const scoreRanges = ['Все', '0–50', '51–70', '71–100']
const periods = ['Все', 'Вчера', 'Сегодня', '7 дней', '30 дней']

function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 75
    ? 'bg-emerald-100 text-emerald-800 ring-emerald-200'
    : score >= 55
      ? 'bg-amber-100 text-amber-800 ring-amber-200'
      : 'bg-rose-100 text-rose-800 ring-rose-200'
  return (
    <span className={`inline-flex size-8 items-center justify-center rounded-full text-xs font-bold ring-1 ${cls}`}>
      {score}
    </span>
  )
}

function SortIcon({ col, sortKey, dir }: { col: SortKey; sortKey: SortKey; dir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown className="size-3 opacity-30" />
  return dir === 'asc' ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />
}

export function CallsListPage() {
  const { companyData } = useCompany()
  const { callsData } = companyData
  const [query, setQuery] = useState('')
  const [period, setPeriod] = useState('Все')
  const [scoreRange, setScoreRange] = useState('Все')
  const [operator, setOperator] = useState('Все')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const operators = useMemo(() => ['Все', ...Array.from(new Set(callsData.map((call) => call.operator)))], [callsData])
  const activeFilterCount = [period, scoreRange, operator].filter(v => v !== 'Все').length

  const filtered = useMemo(() => {
    let data = callsData.filter((c) => {
      if (query) {
        const q = query.toLowerCase()
        if (
          !c.operator.toLowerCase().includes(q) &&
          !c.id.includes(q) &&
          !c.phone.includes(q) &&
          !c.clientName.toLowerCase().includes(q) &&
          !c.keyPhrases.some(p => p.toLowerCase().includes(q))
        ) return false
      }
      if (operator !== 'Все' && c.operator !== operator) return false
      if (scoreRange === '0–50' && c.score > 50) return false
      if (scoreRange === '51–70' && (c.score < 51 || c.score > 70)) return false
      if (scoreRange === '71–100' && c.score < 71) return false
      return true
    })
    data = [...data].sort((a, b) => {
      let av: string | number = a[sortKey]
      let bv: string | number = b[sortKey]
      if (typeof av === 'string') av = av.toLowerCase()
      if (typeof bv === 'string') bv = bv.toLowerCase()
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
    })
    return data
  }, [callsData, query, scoreRange, operator, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const cols: { key: SortKey; label: string }[] = [
    { key: 'date', label: 'Дата/Время' },
    { key: 'operator', label: 'Оператор' },
    { key: 'durationSec', label: 'Длина' },
    { key: 'score', label: 'Балл' },
    { key: 'outcome', label: 'Исход' },
  ]

  const filterChips = [
    { label: 'Период', value: period, set: setPeriod },
    { label: 'Балл', value: scoreRange, set: setScoreRange },
    { label: 'Оператор', value: operator, set: setOperator },
  ].filter(f => f.value !== 'Все')

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' as const }}
      className="space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#0d2430]">Звонки · {companyData.companyMeta.name}</h1>
          <p className="mt-0.5 text-sm text-[#5b7280]">{filtered.length} из {callsData.length} звонков</p>
        </div>

        {/* Period picker buttons */}
        <div className="flex flex-wrap gap-1 rounded-xl bg-[#f0f4f6] p-1">
          {periods.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={[
                'min-h-9 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                period === p
                  ? 'bg-white text-cyan-700 shadow-sm ring-1 ring-[var(--line-soft)]'
                  : 'text-[#5b7280] hover:text-[#16323f]',
              ].join(' ')}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Search + filter toggle */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#5b7280]" />
          <input
            type="text"
            placeholder="Поиск: оператор, клиент, телефон..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-full rounded-xl border border-[var(--line-soft)] bg-white pl-9 pr-4 text-sm text-[#16323f] placeholder-[#5b7280] outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
          />
        </div>
        <button
          onClick={() => setFiltersOpen(o => !o)}
          className={[
            'relative flex h-10 items-center gap-2 rounded-xl border px-3.5 text-sm font-semibold transition-all',
            filtersOpen || activeFilterCount > 0
              ? 'border-cyan-400 bg-cyan-50 text-cyan-700'
              : 'border-[var(--line-soft)] bg-white text-[#5b7280] hover:border-slate-300',
          ].join(' ')}
        >
          <SlidersHorizontal className="size-4" />
          Фильтры
          {activeFilterCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-cyan-600 text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Collapsible filter panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[var(--line-soft)] bg-white p-4 shadow-sm sm:grid-cols-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-[#5b7280]">Оператор</label>
                <select
                  value={operator}
                  onChange={e => setOperator(e.target.value)}
                  className="h-9 rounded-lg border border-[var(--line-soft)] bg-[#f7fbfc] px-2 text-sm text-[#16323f] outline-none focus:border-cyan-400"
                >
                  {operators.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-[#5b7280]">Балл</label>
                <select
                  value={scoreRange}
                  onChange={e => setScoreRange(e.target.value)}
                  className="h-9 rounded-lg border border-[var(--line-soft)] bg-[#f7fbfc] px-2 text-sm text-[#16323f] outline-none focus:border-cyan-400"
                >
                  {scoreRanges.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="col-span-2 flex items-end sm:col-span-1">
                <button
                  onClick={() => { setOperator('Все'); setScoreRange('Все'); setPeriod('Все') }}
                  className="h-9 rounded-lg border border-[var(--line-soft)] bg-[#f7fbfc] px-4 text-sm text-[#5b7280] hover:bg-slate-100 w-full"
                >
                  Сбросить всё
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter chips */}
      {filterChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filterChips.map(({ label, value, set }) => (
            <span key={label} className="flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 pl-3 pr-2 py-1 text-xs font-semibold text-cyan-800">
              {label}: {value}
              <button onClick={() => set('Все')} className="flex size-4 items-center justify-center rounded-full hover:bg-cyan-200">
                <X className="size-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Mobile cards */}
      <div className="space-y-2 md:hidden">
        {filtered.map((call, i) => (
          <div key={call.id} className="rounded-xl border border-[var(--line-soft)] bg-white p-3 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs text-[#5b7280]">{i + 1}. {call.date}</p>
                <Link to={`/calls/${call.id}`} className="mt-0.5 block truncate text-sm font-semibold text-cyan-700 hover:underline">
                  {call.operator}
                </Link>
                <p className="truncate text-xs text-[#5b7280]">{call.clientName}</p>
              </div>
              <ScoreBadge score={call.score} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#5b7280]">
              <span>{call.duration}</span>
              <span>#{call.id}</span>
              <span>{call.phone}</span>
            </div>
            <div className="mt-2">
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${outcomeColors[call.outcome]}`}>
                {call.outcome}
              </span>
              {call.errorType ? <p className="mt-1 text-xs text-rose-600">{call.errorType}</p> : null}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-[var(--line-soft)] bg-white py-10 text-center text-[#5b7280]">
            <p className="text-sm">Нет звонков по заданным фильтрам</p>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)] overflow-hidden">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--line-soft)] bg-[#f7fbfc]">
                <th className="pl-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5b7280] w-8">#</th>
                {cols.map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => toggleSort(key)}
                    className="py-3 pr-5 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5b7280] cursor-pointer hover:text-cyan-700 select-none"
                  >
                    <span className="flex items-center gap-1">
                      {label}
                      <SortIcon col={key} sortKey={sortKey} dir={sortDir} />
                    </span>
                  </th>
                ))}
                <th className="py-3 pr-5 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5b7280]">Клиент</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line-soft)]">
              {filtered.map((call, i) => (
                <tr key={call.id} className="hover:bg-cyan-50/40 cursor-pointer transition-colors">
                  <td className="pl-5 py-2.5 text-xs text-[#5b7280]">{i + 1}</td>
                  <td className="py-2.5 pr-5">
                    <div className="text-sm font-medium text-[#16323f]">{call.date}</div>
                    <div className="text-xs text-[#5b7280]">#{call.id}</div>
                  </td>
                  <td className="py-2.5 pr-5">
                    <Link to={`/calls/${call.id}`} className="font-medium text-cyan-700 hover:underline">
                      {call.operator}
                    </Link>
                    {call.errorType && (
                      <div className="mt-0.5 text-xs text-rose-600">{call.errorType}</div>
                    )}
                  </td>
                  <td className="py-2.5 pr-5 text-sm text-[#5b7280]">{call.duration}</td>
                  <td className="py-2.5 pr-5">
                    <ScoreBadge score={call.score} />
                  </td>
                  <td className="py-2.5 pr-5">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${outcomeColors[call.outcome]}`}>
                      {call.outcome}
                    </span>
                  </td>
                  <td className="py-2.5 pr-5 text-xs text-[#5b7280]">{call.clientName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.section>
  )
}
