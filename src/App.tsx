import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { AuthScreen } from './components/AuthScreen'
import { Dashboard } from './components/Dashboard'
import { authService } from './lib/auth'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const session = await authService.getSession()
      setIsAuthenticated(!!session?.isAuthenticated)
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = async () => {
    await authService.logout()
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-display font-bold mb-2">OVIA</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <AuthScreen onLogin={handleLogin} />
      )}
      <Toaster position="top-center" />
    </>
  )
}

export default App
