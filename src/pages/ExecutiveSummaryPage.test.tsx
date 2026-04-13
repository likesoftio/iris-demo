import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'

import { ExecutiveSummaryPage } from './ExecutiveSummaryPage'
import { CompanyProvider } from '../context/CompanyContext'

test('renders hero heading, key metrics, and operator table', () => {
  render(
    <CompanyProvider>
      <MemoryRouter>
        <ExecutiveSummaryPage />
      </MemoryRouter>
    </CompanyProvider>,
  )

  expect(
    screen.getByRole('heading', {
      name: /качество продаж и сервиса/i,
    }),
  ).toBeInTheDocument()

  expect(screen.getByText(/всего звонков/i)).toBeInTheDocument()
  expect(screen.getByText(/конверсия в сделку/i)).toBeInTheDocument()
  expect(screen.getByText(/рисковые звонки/i)).toBeInTheDocument()
  expect(screen.getAllByText(/средний балл/i).length).toBeGreaterThanOrEqual(1)

  expect(screen.getByText(/лучший оператор/i)).toBeInTheDocument()
  expect(screen.getAllByText(/менеджер/i).length).toBeGreaterThanOrEqual(1)

  expect(screen.getByText(/операторы · актуальный срез звонков/i)).toBeInTheDocument()
}, 15000)
