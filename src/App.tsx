import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { ExecutiveSummaryPage } from './pages/ExecutiveSummaryPage'
import { CallsListPage } from './pages/CallsListPage'
import { CallDetailPage } from './pages/CallDetailPage'
import { CoachingPage } from './pages/CoachingPage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPage } from './pages/SettingsPage'
import { CompanyProvider } from './context/CompanyContext'

function App() {
  return (
    <CompanyProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<ExecutiveSummaryPage />} />
          <Route path="calls" element={<CallsListPage />} />
          <Route path="calls/:callId" element={<CallDetailPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="coaching" element={<CoachingPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CompanyProvider>
  )
}

export default App
