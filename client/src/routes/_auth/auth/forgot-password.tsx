import { ForgotPasswordPage } from '@/components/pages/forgot-pasword-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/auth/forgot-password')({
component: ForgotPasswordPage,
})

// function RouteComponent() {
//   return <div>Hello "/_auth/auth/forget-password"!</div>
// }
