import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

interface DashboardLayoutProps {
  children: ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    window.location.href = '/auth/login'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600">FocusPortal</h1>
        </div>
        
        <nav className="mt-6">
          <Link
            to="/dashboard"
            className="block px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Dashboard
          </Link>
          <Link
            to="/dashboard/profile"
            className="block px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Profile
          </Link>
          {/* Add more navigation links as needed */}
        </nav>

        <div className="absolute bottom-0 w-full p-6">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout