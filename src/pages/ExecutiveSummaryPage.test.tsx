import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'

import { ExecutiveSummaryPage } from './ExecutiveSummaryPage'

test('renders hero insight, key metrics, and top loss categories', () => {
  render(
    <MemoryRouter>
      <ExecutiveSummaryPage />
    </MemoryRouter>,
  )

  expect(
    screen.getByRole('heading', {
      name: /где клиника теряет пациентов и сколько это стоит/i,
    }),
  ).toBeInTheDocument()

  expect(
    screen.getByText(/клиника теряет не разговоры, а следующий шаг/i),
  ).toBeInTheDocument()

  expect(
    screen.getByText(/оформленные или подтвержденные записи/i),
  ).toBeInTheDocument()

  expect(
    screen.getByText(/нет зафиксированного следующего шага/i),
  ).toBeInTheDocument()

  expect(screen.getByText(/leakage trend/i)).toBeInTheDocument()
  expect(screen.getByText(/outcome mix/i)).toBeInTheDocument()
  expect(screen.getByText(/operator performance/i)).toBeInTheDocument()
  expect(screen.getByText(/топ операторы/i)).toBeInTheDocument()
  expect(screen.getByText(/money impact simulator/i)).toBeInTheDocument()
  expect(screen.getByText(/service line heatmap/i)).toBeInTheDocument()
  expect(screen.getByText(/executive narrative/i)).toBeInTheDocument()
  expect(screen.getByText(/benchmark strip/i)).toBeInTheDocument()
}, 15000)
