import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { companyDatasets, getCompanyDataset, type CompanyDataset, type CompanyId } from '../data/demoData'

interface CompanyContextValue {
  companyId: CompanyId
  setCompanyId: (next: CompanyId) => void
  companyData: CompanyDataset
  availableCompanies: CompanyId[]
}

const STORAGE_KEY = 'iris-demo-company'

const CompanyContext = createContext<CompanyContextValue | null>(null)

export function CompanyProvider({
  children,
  allowedCompanies = ['profpotok', 'company_b'],
}: {
  children: ReactNode
  allowedCompanies?: CompanyId[]
}) {
  const effectiveCompanies = useMemo(
    () => allowedCompanies.filter((companyId): companyId is CompanyId => companyId in companyDatasets),
    [allowedCompanies],
  )
  const fallbackCompany = effectiveCompanies[0] ?? 'profpotok'

  const [companyId, setCompanyId] = useState<CompanyId>(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as CompanyId | null
    if (stored && stored in companyDatasets && effectiveCompanies.includes(stored)) return stored
    return fallbackCompany
  })

  const resolvedCompanyId = effectiveCompanies.includes(companyId) ? companyId : fallbackCompany

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, resolvedCompanyId)
  }, [resolvedCompanyId])

  const guardedSetCompanyId = useCallback(
    (next: CompanyId) => {
      if (!effectiveCompanies.includes(next)) return
      setCompanyId(next)
    },
    [effectiveCompanies],
  )

  const value = useMemo(
    () => ({
      companyId: resolvedCompanyId,
      setCompanyId: guardedSetCompanyId,
      companyData: getCompanyDataset(resolvedCompanyId),
      availableCompanies: effectiveCompanies,
    }),
    [effectiveCompanies, guardedSetCompanyId, resolvedCompanyId],
  )

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCompany() {
  const context = useContext(CompanyContext)
  if (!context) throw new Error('useCompany must be used inside CompanyProvider')
  return context
}
