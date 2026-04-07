import { NavLink, Outlet } from 'react-router-dom'
import { BarChart3, PhoneCall, Brain, Waves } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { to: '/', label: 'Обзор', icon: BarChart3, end: true },
  { to: '/calls', label: 'Звонки', icon: PhoneCall },
  { to: '/coaching', label: 'Коучинг', icon: Brain },
]

export function AppShell() {
  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/30">
              <Waves className="size-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-bold tracking-[-0.02em] text-[#0d2430]" style={{ fontFamily: 'Sora, sans-serif' }}>
                Iris Analytics
              </p>
              <p className="text-xs text-[#5b7280]">Медицинский колл-центр</p>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all',
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

          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700">Live Demo</span>
          </div>
        </div>
      </header>

      {/* Page */}
      <motion.main
        key="main"
        className="mx-auto max-w-7xl px-6 py-8"
      >
        <Outlet />
      </motion.main>
    </div>
  )
}
