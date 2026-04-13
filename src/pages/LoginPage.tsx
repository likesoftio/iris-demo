import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const { login } = useAuth()
  const [form, setForm] = useState({ login: '', password: '' })
  const [error, setError] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const ok = login(form.login, form.password)
    if (!ok) {
      setError('Неверный логин или пароль. Проверьте доступы в конфигурации проекта.')
      return
    }
    setError('')
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,rgba(14,165,233,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(45,212,191,0.12),transparent_38%),#f4fbff] px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <section className="rounded-[2rem] bg-white p-8 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line-soft)]">
          <div className="mb-5 flex items-center gap-3">
            <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-cyan-600 to-sky-600 text-sm font-extrabold uppercase tracking-tight text-white shadow-lg shadow-cyan-500/30">
              dk
              <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full border border-white/70 bg-emerald-300" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-[-0.02em] text-[#0d2430]" style={{ fontFamily: 'Sora, sans-serif' }}>
                Dialogik
              </p>
              <p className="text-xs text-[#5b7280]">dialogik.ru · Вход в демо-кабинет</p>
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#0d2430]">Авторизация</h1>
          <p className="mt-1 text-sm text-[#5b7280]">
            Войдите под одним из тестовых доступов: полный доступ, только Iris или только Профпоток.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#5b7280]" htmlFor="login">
                Логин
              </label>
              <input
                id="login"
                value={form.login}
                onChange={(event) => setForm((prev) => ({ ...prev, login: event.target.value }))}
                className="h-11 w-full rounded-xl border border-[var(--line-soft)] px-3 text-sm text-[#16323f] outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#5b7280]" htmlFor="password">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                className="h-11 w-full rounded-xl border border-[var(--line-soft)] px-3 text-sm text-[#16323f] outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </div>
            {error ? (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-cyan-600 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 hover:bg-cyan-500"
            >
              Войти в демо
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
