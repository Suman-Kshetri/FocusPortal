import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div>
      <h1>Welcome to Focus Portal</h1>
      <Link to="/auth/login">Login</Link>
      <Link to="/dashboard">Dashboard</Link>
    </div>
  )
}