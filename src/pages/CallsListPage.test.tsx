import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { CallsListPage } from './CallsListPage'

test('filters the calls list to focus on high-risk leaks', async () => {
  const user = userEvent.setup()

  render(
    <MemoryRouter>
      <CallsListPage />
    </MemoryRouter>,
  )

  expect(screen.getByText(/теплый спрос ушел/i)).toBeInTheDocument()
  expect(screen.getByText(/высокочековый интерес/i)).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: /high risk/i }))

  expect(screen.getByText(/теплый спрос ушел/i)).toBeInTheDocument()
  expect(screen.getByText(/высокочековый интерес/i)).toBeInTheDocument()
  expect(
    screen.queryByText(/первичная запись по новообразованию/i),
  ).not.toBeInTheDocument()
}, 15000)

test('filters the calls list by operator', async () => {
  const user = userEvent.setup()

  render(
    <MemoryRouter>
      <CallsListPage />
    </MemoryRouter>,
  )

  await user.selectOptions(screen.getByLabelText(/operator filter/i), 'darya')

  expect(screen.getByText(/активный оператор/i)).toBeInTheDocument()
  expect(screen.getAllByText(/дарья/i).length).toBeGreaterThanOrEqual(1)
  expect(screen.getByText(/высокочековый интерес/i)).toBeInTheDocument()
  expect(
    screen.queryByText(/теплый спрос ушел/i),
  ).not.toBeInTheDocument()
}, 15000)

test('shows a safe empty state when filters return no calls', async () => {
  const user = userEvent.setup()

  render(
    <MemoryRouter>
      <CallsListPage />
    </MemoryRouter>,
  )

  await user.click(screen.getByRole('button', { name: /high risk/i }))
  await user.selectOptions(screen.getByLabelText(/operator filter/i), 'alexandra')

  expect(
    screen.getByText(/в этом срезе пока нет звонков/i),
  ).toBeInTheDocument()
}, 15000)
