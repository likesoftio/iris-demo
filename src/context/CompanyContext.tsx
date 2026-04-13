import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { companyDatasets, getCompanyDataset, type CompanyDataset, type CompanyId } from '../data/demoData'

interface CompanyContextValue {
  companyId: CompanyId
  setCompanyId: (next: CompanyId) => void
  companyData: CompanyDataset
}

const STORAGE_KEY = 'iris-demo-company'

const CompanyContext = createContext<CompanyContextValue | null>(null)

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [companyId, setCompanyId] = useState<CompanyId>(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as CompanyId | null
    if (stored && stored in companyDatasets) return stored
    return 'profpotok'
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, companyId)
  }, [companyId])

  const value = useMemo(
    () => ({
      companyId,
      setCompanyId,
      companyData: getCompanyDataset(companyId),
    }),
    [companyId],
  )

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCompany() {
  const context = useContext(CompanyContext)
  if (!context) throw new Error('useCompany must be used inside CompanyProvider')
  return context
}
