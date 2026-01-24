import {Profile} from '@/components/pages/dashboard/Profile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/dashboard/profile')({
  component: Profile,
})
