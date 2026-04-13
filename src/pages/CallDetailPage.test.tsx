import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'

import { CallDetailPage } from './CallDetailPage'
import { CompanyProvider } from '../context/CompanyContext'
import { profpotokDataset } from '../data/profpotokDataset'

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

test('renders call header, scorecard analysis and transcript tab for generated call', async () => {
  const user = userEvent.setup()
  const firstCallId = profpotokDataset.callsData[0]?.id ?? 'missing-call'
  const firstQuote = profpotokDataset.transcripts[firstCallId]?.[0]?.text

  render(
    <CompanyProvider>
      <MemoryRouter initialEntries={[`/calls/${firstCallId}`]}>
        <Routes>
          <Route path="/calls/:callId" element={<CallDetailPage />} />
        </Routes>
      </MemoryRouter>
    </CompanyProvider>,
  )

  expect(screen.getByText(new RegExp(`звонок #${firstCallId}`, 'i'))).toBeInTheDocument()
  expect(screen.getAllByText(/менеджер/i).length).toBeGreaterThanOrEqual(1)
  expect(screen.getByText(/оценка по критериям/i)).toBeInTheDocument()
  expect(screen.getByText(/цепочка ошибок/i)).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: /транскрипция/i }))

  expect(screen.getByText(/расшифровка разговора/i)).toBeInTheDocument()
  if (firstQuote) expect(screen.getByText(new RegExp(escapeRegExp(firstQuote.slice(0, 20)), 'i'))).toBeInTheDocument()
}, 15000)

test('renders a safe fallback when the call id is unknown', () => {
  render(
    <CompanyProvider>
      <MemoryRouter initialEntries={['/calls/99999']}>
        <Routes>
          <Route path="/calls/:callId" element={<CallDetailPage />} />
        </Routes>
      </MemoryRouter>
    </CompanyProvider>,
  )

  expect(
    screen.getByRole('heading', { name: /звонок не найден/i }),
  ).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /назад к списку/i })).toBeInTheDocument()
}, 15000)
