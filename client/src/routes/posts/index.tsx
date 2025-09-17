import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/posts/')({
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      q: (search.q as string) || ''
    }
  },
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: async ({ deps: { q } }) => {
    const posts = ['post1', 'post2', 'post3', 'post4','post5','post6','post7']
    const filteredPosts = q.trim()
      ? posts.filter((post) => post.includes(q))
      : posts

    return {
      posts: filteredPosts
    }
  }
})

function RouteComponent() {
  const { posts } = Route.useLoaderData()
  const { q } = Route.useSearch()
  const navigate = Route.useNavigate()

  const [searchInput, setSearchInput] = useState(q)

  const handleSearch = () => {
    navigate({ search: { q: searchInput } })
  }

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search posts"
          className="border px-2 py-1"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-3 py-1 rounded">
          Search
        </button>
      </div>

      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => (
          <div key={post}>
            <Link to="/posts/$postId" params={{ postId: post }} className="text-blue-600 underline">
              {post}
            </Link>
          </div>
        ))
      )}
    </div>
  )
}
