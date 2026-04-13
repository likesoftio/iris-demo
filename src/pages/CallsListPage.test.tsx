import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { CallsListPage } from './CallsListPage'
import { CompanyProvider } from '../context/CompanyContext'

test('renders all calls in the list by default', () => {
  render(
    <CompanyProvider>
      <MemoryRouter>
        <CallsListPage />
      </MemoryRouter>
    </CompanyProvider>,
  )

  expect(screen.getAllByText(/менеджер/i).length).toBeGreaterThanOrEqual(1)
  expect(screen.getAllByText(/нет отработки ценового возражения/i).length).toBeGreaterThan(0)
}, 15000)

test('filters the calls list by operator through the filter panel', async () => {
  const user = userEvent.setup()

  render(
    <CompanyProvider>
      <MemoryRouter>
        <CallsListPage />
      </MemoryRouter>
    </CompanyProvider>,
  )

  await user.click(screen.getByRole('button', { name: /фильтры/i }))

  const selects = screen.getAllByRole('combobox')
  await user.selectOptions(selects[0], 'Менеджер 1')

  expect(screen.getAllByRole('link', { name: /менеджер 1/i }).length).toBeGreaterThanOrEqual(1)
  expect(screen.queryByRole('link', { name: /менеджер 6/i })).not.toBeInTheDocument()
}, 15000)

test('shows empty state when no calls match the search query', async () => {
  const user = userEvent.setup()

  render(
    <CompanyProvider>
      <MemoryRouter>
        <CallsListPage />
      </MemoryRouter>
    </CompanyProvider>,
  )

  await user.type(
    screen.getByPlaceholderText(/оператор, клиент, телефон/i),
    'xyznonexistent99999',
  )

  expect(screen.getByText(/нет звонков по заданным фильтрам/i)).toBeInTheDocument()
}, 15000)
