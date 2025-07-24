import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$postId')({
  component: RouteComponent,
  loader: async({params}) => { // getting data that components before rendering
    //fetch req..eg:
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      postId: params.postId,
    }
  },
  pendingComponent: () => 
    <div>
      Loading ..
    </div>
})

function RouteComponent() {
  const {postId} = Route.useLoaderData();
  return <div>Hello {postId}</div>
}
