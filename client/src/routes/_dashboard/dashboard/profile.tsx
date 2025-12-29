import { createFileRoute } from '@tanstack/react-router'
// import Profile from '../../../components/pages/dashboard/Profile'

export const Route = createFileRoute('/_dashboard/dashboard/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='text-3xl'>Hello "/_dashboard/dashboard/profile"!</div>
}