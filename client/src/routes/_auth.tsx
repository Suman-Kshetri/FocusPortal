import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  beforeLoad:async() => {
    const isAuthenticated = !!localStorage.getItem("accessToken")
    if(isAuthenticated){
      throw redirect({
        to:"/dashboard",
      })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (

          <Outlet />
  )
}