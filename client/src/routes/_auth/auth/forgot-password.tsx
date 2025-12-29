import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/auth/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/auth/forget-password"!</div>
}
