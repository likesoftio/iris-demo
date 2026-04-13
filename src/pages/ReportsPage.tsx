import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { useCompany } from '../context/CompanyContext'

const PERIODS = ['Вчера', 'Сегодня', '7 дней', 'Месяц', 'Квартал', 'Год', 'За всё время']

const REPORTS = [
  { id: 'operators', label: 'Рейтинг операторов' },
  { id: 'conversion', label: 'Динамика конверсии' },
  { id: 'errors', label: 'Топ ошибок' },
  { id: 'hourly', label: 'Распределение по часам' },
]

const ACCENT = '#06b6d4'
const ACCENT2 = '#10b981'

function OperatorsChart() {
  const { companyData } = useCompany()
  const { operatorStats } = companyData
  const data = operatorStats.map(op => ({ name: op.name.split(' ')[0], балл: op.score, конверсия: Math.round((op.converted / op.calls) * 100) }))
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5eaec" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#5b7280' }} />
        <YAxis tick={{ fontSize: 12, fill: '#5b7280' }} />
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5eaec', fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="балл" fill={ACCENT} radius={[6, 6, 0, 0]} name="Балл" />
        <Bar dataKey="конверсия" fill={ACCENT2} radius={[6, 6, 0, 0]} name="Конверсия %" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function ConversionChart() {
  const { companyData } = useCompany()
  const { dailyTrends } = companyData
  const data = dailyTrends.map(d => ({ день: d.day, звонков: d.calls, конверсия: d.conversion }))
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5eaec" />
        <XAxis dataKey="день" tick={{ fontSize: 11, fill: '#5b7280' }} />
        <YAxis tick={{ fontSize: 12, fill: '#5b7280' }} />
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5eaec', fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="звонков" stroke={ACCENT} strokeWidth={2} dot={{ r: 3 }} name="Звонков" />
        <Line type="monotone" dataKey="конверсия" stroke={ACCENT2} strokeWidth={2} dot={{ r: 3 }} name="Конверсия %" strokeDasharray="5 5" />
      </LineChart>
    </ResponsiveContainer>
  )
}

function ErrorsChart() {
  const { companyData } = useCompany()
  const { errorPatterns } = companyData
  const data = [...errorPatterns].sort((a, b) => b.percent - a.percent)
    .map(e => ({ ошибка: e.label, частота: e.percent }))
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5eaec" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 12, fill: '#5b7280' }} unit="%" />
        <YAxis dataKey="ошибка" type="category" tick={{ fontSize: 11, fill: '#5b7280' }} width={170} />
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5eaec', fontSize: 12 }} formatter={(v) => [`${v}%`, 'Частота']} />
        <Bar dataKey="частота" fill="#f97316" radius={[0, 6, 6, 0]} name="Частота %" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function HourlyChart() {
  const { companyData } = useCompany()
  const { hourlyDistribution } = companyData
  const data = hourlyDistribution.map(h => ({ час: `${h.hour}:00`, звонков: h.calls }))
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5eaec" />
        <XAxis dataKey="час" tick={{ fontSize: 11, fill: '#5b7280' }} />
        <YAxis tick={{ fontSize: 12, fill: '#5b7280' }} />
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5eaec', fontSize: 12 }} />
        <Bar dataKey="звонков" fill={ACCENT} radius={[6, 6, 0, 0]} name="Звонков" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function FunnelTable() {
  const { companyData } = useCompany()
  const { conversionFunnel } = companyData
  if (!conversionFunnel.length) return null
  const total = conversionFunnel[0].count
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--line-soft)] bg-[#f7fbfc]">
            {['Этап', 'Кол-во', 'Доля от звонков', 'Конверсия'].map(h => (
              <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5b7280]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--line-soft)]">
          {conversionFunnel.map((step, i) => {
            const prev = i > 0 ? conversionFunnel[i - 1].count : step.count
            const conv = i === 0 ? 100 : Math.round((step.count / prev) * 100)
            return (
              <tr key={step.stage} className="hover:bg-[#f7fbfc]">
                <td className="px-4 py-2.5 font-medium text-[#16323f]">{step.stage}</td>
                <td className="px-4 py-2.5 font-bold text-cyan-700">{step.count.toLocaleString('ru')}</td>
                <td className="px-4 py-2.5 text-[#5b7280]">{Math.round((step.count / total) * 100)}%</td>
                <td className="px-4 py-2.5">
                  {i === 0
                    ? <span className="text-[#5b7280]">—</span>
                    : <span className={`font-semibold ${conv >= 80 ? 'text-emerald-700' : conv >= 60 ? 'text-amber-700' : 'text-rose-700'}`}>{conv}%</span>
                  }
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function OperatorsTable() {
  const { companyData } = useCompany()
  const { operatorStats } = companyData
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--line-soft)] bg-[#f7fbfc]">
            {['Оператор', 'Звонков', 'Средний балл', 'Конверсия'].map(h => (
              <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5b7280]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--line-soft)]">
          {operatorStats.map(op => (
            <tr key={op.id} className="hover:bg-[#f7fbfc]">
              <td className="px-4 py-2.5 font-medium text-[#16323f]">{op.name}</td>
              <td className="px-4 py-2.5 font-bold text-cyan-700">{op.calls}</td>
              <td className="px-4 py-2.5">
                <span className={`font-semibold ${op.score >= 80 ? 'text-emerald-700' : op.score >= 65 ? 'text-amber-700' : 'text-rose-700'}`}>{op.score}</span>
              </td>
              <td className="px-4 py-2.5 text-[#5b7280]">{Math.round((op.converted / op.calls) * 100)}%</td>
            </tr>
          ))}
          <tr className="border-t-2 border-[var(--line-soft)] bg-[#f7fbfc]">
            <td className="px-4 py-2.5 font-semibold text-[#16323f]">Итого</td>
            <td className="px-4 py-2.5 font-bold text-cyan-700">{operatorStats.reduce((s, o) => s + o.calls, 0).toLocaleString('ru')}</td>
            <td className="px-4 py-2.5 font-semibold text-[#5b7280]">{Math.round(operatorStats.reduce((s, o) => s + o.score, 0) / operatorStats.length)}</td>
            <td className="px-4 py-2.5 text-[#5b7280]">{Math.round(operatorStats.reduce((s, o) => s + (o.converted / o.calls) * 100, 0) / operatorStats.length)}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export function ReportsPage() {
  const { companyData } = useCompany()
  const { conversionFunnel, errorPatterns } = companyData
  const [period, setPeriod] = useState('Месяц')
  const [reportId, setReportId] = useState('operators')

  const report = REPORTS.find(r => r.id === reportId)!

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' as const }}
      className="space-y-5"
    >
      {/* Header + period picker */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#0d2430]">Отчёты · {companyData.companyMeta.name}</h1>
        <div className="flex gap-1 rounded-xl bg-[#f0f4f6] p-1 flex-wrap">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={[
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
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

      {/* Report selector */}
      <div className="flex flex-wrap gap-2">
        {REPORTS.map(r => (
          <button
            key={r.id}
            onClick={() => setReportId(r.id)}
            className={[
              'rounded-xl px-4 py-2 text-sm font-semibold transition-all border',
              reportId === r.id
                ? 'border-cyan-400 bg-cyan-50 text-cyan-700'
                : 'border-[var(--line-soft)] bg-white text-[#5b7280] hover:border-slate-300',
            ].join(' ')}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Chart card */}
      <div className="rounded-2xl bg-white p-5 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5b7280]">График</p>
            <h2 className="mt-0.5 text-base font-semibold text-[#0d2430]">{report.label}</h2>
          </div>
          <span className="rounded-full bg-[#f0f4f6] px-3 py-1 text-xs font-semibold text-[#5b7280]">{period}</span>
        </div>

        {reportId === 'operators' && <OperatorsChart />}
        {reportId === 'conversion' && <ConversionChart />}
        {reportId === 'errors' && <ErrorsChart />}
        {reportId === 'hourly' && <HourlyChart />}
      </div>

      {/* Funnel summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {conversionFunnel.map((step, i) => {
          const prev = i > 0 ? conversionFunnel[i - 1].count : step.count
          const conv = i === 0 ? null : Math.round((step.count / prev) * 100)
          return (
            <div key={step.stage} className="rounded-xl bg-white px-4 py-3 ring-1 ring-[var(--line-soft)] shadow-sm">
              <p className="text-[11px] font-semibold text-[#5b7280] truncate">{step.stage}</p>
              <p className="mt-1 text-2xl font-bold tracking-[-0.04em] text-[#0d2430]">{step.count.toLocaleString('ru')}</p>
              {conv !== null && (
                <p className={`mt-0.5 text-xs font-semibold ${conv >= 80 ? 'text-emerald-700' : conv >= 60 ? 'text-amber-700' : 'text-rose-700'}`}>
                  {conv}% от предыдущего
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Data table */}
      <div className="rounded-2xl bg-white shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--line-soft)] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#0d2430]">{report.label}</h3>
          <span className="text-xs text-[#5b7280]">Данные за: {period}</span>
        </div>
        {(reportId === 'operators' || reportId === 'conversion' || reportId === 'hourly') && <OperatorsTable />}
        {reportId === 'errors' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--line-soft)] bg-[#f7fbfc]">
                  {['Тип ошибки', 'Частота'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5b7280]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line-soft)]">
                {[...errorPatterns].sort((a, b) => b.percent - a.percent).map(ep => (
                  <tr key={ep.id} className="hover:bg-[#f7fbfc]">
                    <td className="px-4 py-2.5 font-medium text-[#16323f]">{ep.label}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 rounded-full bg-[#eaf4f6] overflow-hidden max-w-[120px]">
                          <div className="h-full rounded-full bg-orange-400" style={{ width: `${ep.percent}%` }} />
                        </div>
                        <span className="font-semibold text-orange-700">{ep.percent}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {reportId === 'conversion' && <FunnelTable />}
      </div>
    </motion.section>
  )
}
