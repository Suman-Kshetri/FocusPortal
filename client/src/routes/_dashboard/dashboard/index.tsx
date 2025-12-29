import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/dashboard/')({
  component: DashboardIndex,
})

function DashboardIndex() {
  return (
    <div>
      <h1>Dashboard Home</h1>
      {/* Or redirect to profile */}
    </div>
  )
}