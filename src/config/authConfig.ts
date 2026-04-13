import type { CompanyId } from '../data/demoData'

export type AccessLevel = 'all' | 'iris_only' | 'profpotok_only'

export interface AuthConfigUser {
  id: string
  name: string
  login: string
  password: string
  accessLevel: AccessLevel
  allowedCompanies: CompanyId[]
}

function readEnvValue(key: string, fallback: string) {
  const raw = import.meta.env[key]
  if (typeof raw !== 'string') return fallback
  const normalized = raw.trim()
  return normalized.length > 0 ? normalized : fallback
}

export const authUsersConfig: AuthConfigUser[] = [
  {
    id: 'all-access',
    name: 'Демо: Все компании',
    login: readEnvValue('VITE_DEMO_LOGIN_ALL', 'demo-admin'),
    password: readEnvValue('VITE_DEMO_PASSWORD_ALL', 'iris-all'),
    accessLevel: 'all',
    allowedCompanies: ['profpotok', 'company_b'],
  },
  {
    id: 'iris-access',
    name: 'Демо: Только Компания B',
    login: readEnvValue('VITE_DEMO_LOGIN_IRIS', 'demo-iris'),
    password: readEnvValue('VITE_DEMO_PASSWORD_IRIS', 'iris-only'),
    accessLevel: 'iris_only',
    allowedCompanies: ['company_b'],
  },
  {
    id: 'profpotok-access',
    name: 'Демо: Только Профпоток',
    login: readEnvValue('VITE_DEMO_LOGIN_PROFPOTOK', 'demo-profpotok'),
    password: readEnvValue('VITE_DEMO_PASSWORD_PROFPOTOK', 'prof-only'),
    accessLevel: 'profpotok_only',
    allowedCompanies: ['profpotok'],
  },
]
