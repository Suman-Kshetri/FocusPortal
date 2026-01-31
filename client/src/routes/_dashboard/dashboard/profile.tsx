import {Profile} from '@/components/pages/dashboard/profile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/dashboard/profile')({
  component: Profile,
})
