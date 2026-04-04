import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'

import App from './App'

test('renders demo navigation and executive summary route by default', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )

  expect(screen.getByRole('link', { name: /overview/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /calls/i })).toBeInTheDocument()
  expect(
    screen.getByRole('heading', {
      name: /где клиника теряет пациентов и сколько это стоит/i,
    }),
  ).toBeInTheDocument()
}, 15000)

test('marks calls navigation as active on the calls route', () => {
  render(
    <MemoryRouter initialEntries={['/calls']}>
      <App />
    </MemoryRouter>,
  )

  expect(screen.getByRole('link', { name: /calls/i })).toHaveAttribute(
    'aria-current',
    'page',
  )
  expect(screen.getByRole('link', { name: /overview/i })).not.toHaveAttribute(
    'aria-current',
  )
}, 15000)
