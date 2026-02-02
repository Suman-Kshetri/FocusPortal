import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import { routeTree } from './routeTree.gen'
import { SocketProvider } from './context/socketContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, 
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
  context: {
    queryClient, 
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
        </SocketProvider>
      </QueryClientProvider>
  )
}