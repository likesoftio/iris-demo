import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Overview', end: true },
  { to: '/calls', label: 'Calls' },
  { to: '/coaching', label: 'Coaching' },
]

export function AppShell() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12rem] top-[-8rem] h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute right-[-10rem] top-24 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-amber-200/20 blur-3xl" />
      </div>

      <header className="sticky top-0 z-10 border-b border-white/60 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">
              Iris Demo
            </p>
            <p className="text-sm text-slate-500">Premium clinic intelligence</p>
          </div>

          <nav aria-label="Primary" className="flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                      : 'text-[#456170] hover:bg-cyan-50 hover:text-cyan-700',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
