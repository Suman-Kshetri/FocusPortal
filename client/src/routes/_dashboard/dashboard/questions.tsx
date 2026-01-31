import { QuestionsAnswers } from '@/components/pages/dashboard/questionsAnswers'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/dashboard/questions')({
  component: QuestionsAnswers,
})
