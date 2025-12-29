import { createFileRoute } from '@tanstack/react-router'
import LoginPage from '../../../components/pages/login-page'

export const Route = createFileRoute('/_auth/auth/login')({
  component: LoginPage,
})
