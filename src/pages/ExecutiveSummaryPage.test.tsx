import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'

import { ExecutiveSummaryPage } from './ExecutiveSummaryPage'

test('renders hero heading, key metrics, and operator table', () => {
  render(
    <MemoryRouter>
      <ExecutiveSummaryPage />
    </MemoryRouter>,
  )

  expect(
    screen.getByRole('heading', {
      name: /клиника теряет ₽1\.2 млн/i,
    }),
  ).toBeInTheDocument()

  expect(screen.getByText(/всего звонков/i)).toBeInTheDocument()
  expect(screen.getByText(/конверсия в запись/i)).toBeInTheDocument()
  expect(screen.getByText(/потеря выручки/i)).toBeInTheDocument()
  expect(screen.getAllByText(/средний балл/i).length).toBeGreaterThanOrEqual(1)

  expect(screen.getByText(/лучший оператор/i)).toBeInTheDocument()
  expect(screen.getAllByText(/анна смирнова/i).length).toBeGreaterThanOrEqual(1)

  expect(screen.getByText(/операторы · апрель 2026/i)).toBeInTheDocument()
}, 15000)
