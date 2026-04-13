import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authUsersConfig, type AuthConfigUser } from '../config/authConfig'

export type AuthUser = AuthConfigUser

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (login: string, password: string) => boolean
  logout: () => void
}

const STORAGE_KEY = 'iris-demo-auth-user-id'

const AuthContext = createContext<AuthContextValue | null>(null)

function getInitialUser() {
  if (import.meta.env.MODE === 'test') {
    return authUsersConfig[0]
  }

  const storedId = window.localStorage.getItem(STORAGE_KEY)
  if (!storedId) return null
  return authUsersConfig.find((user) => user.id === storedId) ?? null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getInitialUser)

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, user.id)
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: (loginValue, passwordValue) => {
        const matched = authUsersConfig.find(
          (candidate) => candidate.login === loginValue.trim() && candidate.password === passwordValue.trim(),
        )
        if (!matched) return false
        setUser(matched)
        return true
      },
      logout: () => setUser(null),
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
