import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { BarChart3, PhoneCall, Brain, BarChart2, Settings, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCompany } from '../context/CompanyContext'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', label: 'Обзор', icon: BarChart3, end: true },
  { to: '/calls', label: 'Звонки', icon: PhoneCall },
  { to: '/reports', label: 'Отчёты', icon: BarChart2 },
  { to: '/coaching', label: 'Коучинг', icon: Brain },
  { to: '/settings', label: 'Настройки', icon: Settings },
]

export function AppShell() {
  const { companyId, setCompanyId, companyData, availableCompanies } = useCompany()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const companyLabels = {
    profpotok: 'Профпоток',
    company_b: 'Iris',
  } as const

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/80 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-cyan-600 to-sky-600 text-xs font-extrabold uppercase tracking-tight text-white shadow-lg shadow-cyan-500/30">
                dk
                <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full border border-white/70 bg-emerald-300" />
              </div>
              <div>
                <p className="text-sm font-bold tracking-[-0.02em] text-[#0d2430]" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Dialogik
                </p>
                <p className="max-w-[12rem] truncate text-xs text-[#5b7280] sm:max-w-none">dialogik.ru · {companyData.companyMeta.subtitle}</p>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-xl border border-[var(--line-soft)] bg-white text-[#456170] md:hidden"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            >
              {mobileMenuOpen ? '×' : '☰'}
            </button>

            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all',
                      isActive
                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/25'
                        : 'text-[#456170] hover:bg-cyan-50 hover:text-cyan-700',
                    ].join(' ')
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className="size-4" strokeWidth={isActive ? 2.5 : 2} />
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="hidden items-center gap-2 md:flex">
              <select
                value={companyId}
                onChange={(event) => setCompanyId(event.target.value as 'profpotok' | 'company_b')}
                className="rounded-xl border border-[var(--line-soft)] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#456170] outline-none hover:border-cyan-300"
              >
                {availableCompanies.map((companyOption) => (
                  <option key={companyOption} value={companyOption}>
                    {companyLabels[companyOption]}
                  </option>
                ))}
              </select>
              {user ? (
                <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-cyan-700">
                  {user.name}
                </span>
              ) : null}
              <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-700">
                  {companyData.companyMeta.isReady ? 'Live Demo' : 'Ожидает данные'}
                </span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1 rounded-xl border border-[var(--line-soft)] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#456170] hover:border-rose-300 hover:text-rose-700"
              >
                <LogOut className="size-3.5" />
                Выйти
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 md:hidden">
            <select
              value={companyId}
              onChange={(event) => setCompanyId(event.target.value as 'profpotok' | 'company_b')}
              className="h-10 flex-1 rounded-xl border border-[var(--line-soft)] bg-white px-2.5 text-xs font-semibold text-[#456170] outline-none hover:border-cyan-300"
            >
              {availableCompanies.map((companyOption) => (
                <option key={companyOption} value={companyOption}>
                  {companyLabels[companyOption]}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={logout}
              className="inline-flex h-10 items-center gap-1 rounded-xl border border-[var(--line-soft)] bg-white px-3 text-xs font-semibold text-[#456170] hover:border-rose-300 hover:text-rose-700"
            >
              <LogOut className="size-3.5" />
              Выйти
            </button>
            <div className="inline-flex min-h-8 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              {companyData.companyMeta.isReady ? 'Live' : 'Ожидает'}
            </div>
            {user ? (
              <span className="inline-flex min-h-8 items-center rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-cyan-700">
                {user.name}
              </span>
            ) : null}
          </div>

          {mobileMenuOpen ? (
            <nav id="mobile-nav-menu" className="mt-3 grid gap-2 md:hidden">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    [
                      'inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition-all',
                      isActive
                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/25'
                        : 'bg-white text-[#456170] ring-1 ring-[var(--line-soft)] hover:bg-cyan-50 hover:text-cyan-700',
                    ].join(' ')
                  }
                >
                  <Icon className="size-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
          ) : null}
        </div>
      </header>

      {/* Page */}
      <motion.main
        key="main"
        className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8"
      >
        <Outlet />
      </motion.main>
    </div>
  )
}
