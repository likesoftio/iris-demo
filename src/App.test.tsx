import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'

import App from './App'

test('renders demo navigation and executive summary route by default', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )

  expect(screen.getByRole('link', { name: /^обзор$/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /^звонки$/i })).toBeInTheDocument()
  expect(
    screen.getByRole('heading', {
      name: /качество продаж и сервиса/i,
    }),
  ).toBeInTheDocument()
}, 15000)

test('marks calls navigation as active on the calls route', () => {
  render(
    <MemoryRouter initialEntries={['/calls']}>
      <App />
    </MemoryRouter>,
  )

  expect(screen.getByRole('link', { name: /^звонки$/i })).toHaveAttribute(
    'aria-current',
    'page',
  )
  expect(screen.getByRole('link', { name: /^обзор$/i })).not.toHaveAttribute(
    'aria-current',
  )
}, 15000)
