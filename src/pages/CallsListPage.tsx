import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { callsData, type CallRecord, type Outcome } from '../data/demoData'

type SortKey = keyof Pick<CallRecord, 'date' | 'operator' | 'durationSec' | 'score' | 'outcome'>
type SortDir = 'asc' | 'desc'

const outcomeColors: Record<Outcome, string> = {
  'Записался': 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  'Отказ': 'bg-rose-100 text-rose-800 ring-rose-200',
  'Перезвонить': 'bg-amber-100 text-amber-800 ring-amber-200',
  'Переведён': 'bg-sky-100 text-sky-800 ring-sky-200',
}

const errorTypes = ['Все', 'Не предложила альтернативу', 'Затянутый диалог', 'Не выявила потребность', 'Грубость в голосе']
const periods = ['Все', 'Сегодня', '7 дней', '30 дней']
const scoreRanges = ['Все', '0–50', '51–70', '71–100']

function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 75
    ? 'bg-emerald-100 text-emerald-800 ring-emerald-200'
    : score >= 55
      ? 'bg-amber-100 text-amber-800 ring-amber-200'
      : 'bg-rose-100 text-rose-800 ring-rose-200'
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${cls}`}>
      {score}
    </span>
  )
}

function SortIcon({ col, sortKey, dir }: { col: SortKey; sortKey: SortKey; dir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown className="size-3 opacity-30" />
  return dir === 'asc' ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />
}

export function CallsListPage() {
  const [query, setQuery] = useState('')
  const [period, setPeriod] = useState('Все')
  const [errorType, setErrorType] = useState('Все')
  const [scoreRange, setScoreRange] = useState('Все')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const filtered = useMemo(() => {
    let data = callsData.filter((c) => {
      if (query && !c.operator.toLowerCase().includes(query.toLowerCase()) && !c.id.includes(query)) return false
      if (errorType !== 'Все' && c.errorType !== errorType) return false
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
  }, [query, period, errorType, scoreRange, sortKey, sortDir])

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

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' as const }}
      className="space-y-5"
    >
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#0d2430]">Звонки</h1>
        <p className="mt-1 text-sm text-[#5b7280]">{callsData.length} записей · апрель 2026</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#5b7280]" />
          <input
            type="text"
            placeholder="Поиск по оператору, ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 rounded-xl border border-[var(--line-soft)] bg-white pl-9 pr-4 text-sm text-[#16323f] placeholder-[#5b7280] outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
          />
        </div>

        {[
          { label: 'Период', value: period, setValue: setPeriod, options: periods },
          { label: 'Тип ошибки', value: errorType, setValue: setErrorType, options: errorTypes },
          { label: 'Балл', value: scoreRange, setValue: setScoreRange, options: scoreRanges },
        ].map(({ label, value, setValue, options }) => (
          <div key={label} className="flex items-center gap-2">
            <label className="text-xs font-semibold text-[#5b7280]">{label}:</label>
            <select
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="h-9 rounded-xl border border-[var(--line-soft)] bg-white px-3 text-sm text-[#16323f] outline-none focus:border-cyan-400"
            >
              {options.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}

        <span className="ml-auto text-xs text-[#5b7280]">{filtered.length} из {callsData.length}</span>
      </div>

      {/* Table */}
      <div className="rounded-[2rem] bg-white shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--line-soft)] bg-[#f7fbfc]">
                <th className="pl-6 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[#5b7280] w-8">#</th>
                {cols.map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => toggleSort(key)}
                    className="py-3.5 pr-6 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[#5b7280] cursor-pointer hover:text-cyan-700 select-none"
                  >
                    <span className="flex items-center gap-1">
                      {label}
                      <SortIcon col={key} sortKey={sortKey} dir={sortDir} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line-soft)]">
              {filtered.map((call, i) => (
                <tr
                  key={call.id}
                  className="hover:bg-cyan-50/40 cursor-pointer transition-colors"
                >
                  <td className="pl-6 py-3.5 text-xs text-[#5b7280]">{i + 1}</td>
                  <td className="py-3.5 pr-6">
                    <div className="text-[#16323f] font-medium">{call.date}</div>
                    <div className="text-xs text-[#5b7280]">ID: {call.id}</div>
                  </td>
                  <td className="py-3.5 pr-6">
                    <Link to={`/calls/${call.id}`} className="font-medium text-cyan-700 hover:underline">
                      {call.operator}
                    </Link>
                    {call.errorType && (
                      <div className="mt-0.5 text-xs text-rose-600">{call.errorType}</div>
                    )}
                  </td>
                  <td className="py-3.5 pr-6 text-[#5b7280]">{call.duration}</td>
                  <td className="py-3.5 pr-6">
                    <ScoreBadge score={call.score} />
                  </td>
                  <td className="py-3.5 pr-6">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${outcomeColors[call.outcome]}`}>
                      {call.outcome}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-16 text-center text-[#5b7280]">
              <p className="text-sm">Нет звонков по заданным фильтрам</p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  )
}
