import { useState } from 'react'
import { SignInForm } from './components/auth/sign-in-form'
import { SignUpForm } from './components/auth/sign-up-form'
import { DashboardPage } from './components/dashboard/dashboard-page'
import { Button } from './components/ui/button'
import './App.css'

function App() {
  const [isSignIn, setIsSignIn] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = (email: string, password: string) => {
    if (email === 'admin@admin.com' && password === '123456') {
      setIsAuthenticated(true)
    }
  }

  const handleSignOut = () => {
    setIsAuthenticated(false)
  }

  if (isAuthenticated) {
    return <DashboardPage onSignOut={handleSignOut} />
  }

  return (
    <div className="min-h-screen auth-container">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-2 text-gradient">
            Timesheet Management
          </h1>
          <p className="text-lg text-gray-600 bg-clip-text">
            Manage your time, track your projects
          </p>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
          <div className="form-container glass-effect p-1 rounded-xl card-glow">
            {isSignIn ? (
              <SignInForm onLogin={handleLogin} />
            ) : (
              <SignUpForm />
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button
              variant="outline"
              onClick={() => setIsSignIn(!isSignIn)}
              className="min-w-[200px] bg-white/50 hover:bg-white/80 transition-all duration-300"
            >
              {isSignIn ? "Create account" : "Sign in"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App