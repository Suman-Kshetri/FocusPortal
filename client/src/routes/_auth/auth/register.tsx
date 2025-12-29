import Register from '@/components/pages/register-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/auth/register')({
  component: Register,
})

// function RouteComponent() {
//   return <div>Hello "/_auth/auth/register"!</div>
// }
