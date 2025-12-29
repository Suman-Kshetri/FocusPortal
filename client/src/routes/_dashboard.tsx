import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import DashboardLayout from '../components/pages/dashboard/DashboardLayout'

export const Route = createFileRoute('/_dashboard')({
  beforeLoad: async () => {
    const isAuthenticated = !!localStorage.getItem('accessToken')
    
    if (!isAuthenticated) {
      throw redirect({
        to: '/auth/login',
        replace: true,
      })
    }
  },
  component: DashboardLayoutWrapper,
})

function DashboardLayoutWrapper() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}