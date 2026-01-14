import { createFileRoute } from '@tanstack/react-router'
import {VerifyEmail} from '@/components/pages/verification-page'

export const Route = createFileRoute('/_auth/auth/verify-email')({
  component: VerifyEmail,
})

// function RouteComponent() {
//   return <div>Hello "/_auth/auth/verify-email"!</div>
// }
