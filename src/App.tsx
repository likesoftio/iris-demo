import { Navigate, Route, Routes } from 'react-router-dom'

import { AppShell } from './components/AppShell'
import { CallDetailPage } from './pages/CallDetailPage'
import { CallsListPage } from './pages/CallsListPage'
import { ExecutiveSummaryPage } from './pages/ExecutiveSummaryPage'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<ExecutiveSummaryPage />} />
        <Route path="calls" element={<CallsListPage />} />
        <Route path="calls/:callId" element={<CallDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
