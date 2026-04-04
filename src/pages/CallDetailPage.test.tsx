import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'

import { CallDetailPage } from './CallDetailPage'

test('renders audio sync, operator context, evidence quotes, and recommendation for a selected call', async () => {
  const user = userEvent.setup()

  render(
    <MemoryRouter initialEntries={['/calls/10028']}>
      <Routes>
        <Route path="/calls/:callId" element={<CallDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )

  expect(screen.getByRole('heading', { name: /звонок 10028/i })).toBeInTheDocument()
  expect(
    screen.getByRole('button', { name: /jump to 00:51/i }),
  ).toBeInTheDocument()
  expect(screen.getByText(/оператор/i)).toBeInTheDocument()
  expect(screen.getByText(/юлия/i)).toBeInTheDocument()
  expect(screen.getByText(/бронь слота/i)).toBeInTheDocument()
  expect(screen.getByText(/mock audio player/i)).toBeInTheDocument()
  expect(screen.getByText(/transcript sync/i)).toBeInTheDocument()
  expect(screen.getByText(/как звучит сейчас/i)).toBeInTheDocument()
  expect(screen.getByText(/как должен звучать сильный ответ/i)).toBeInTheDocument()
  expect(screen.getByText(/ожидаемый эффект/i)).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: /jump to 00:51/i }))

  expect(screen.getByText(/текущий фрагмент/i)).toBeInTheDocument()
  expect(screen.getByText(/уход в перезвон/i)).toBeInTheDocument()
}, 15000)

test('renders a safe fallback when the call id is unknown', () => {
  render(
    <MemoryRouter initialEntries={['/calls/99999']}>
      <Routes>
        <Route path="/calls/:callId" element={<CallDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )

  expect(
    screen.getByRole('heading', { name: /звонок не найден/i }),
  ).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /назад к списку/i })).toBeInTheDocument()
}, 15000)
