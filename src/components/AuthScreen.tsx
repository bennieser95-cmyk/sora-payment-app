import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sparkle, ArrowRight } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface AuthScreenProps {
  onLogin: () => void
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [mode, setMode] = useState<'welcome' | 'login' | 'signup'>('welcome')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { authService } = await import('@/lib/auth')
      
      if (mode === 'signup') {
        await authService.register({ email, password, name })
        toast.success('Account created successfully!')
      }
      
      await authService.login({ email, password })
      toast.success('Welcome back!')
      onLogin()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (mode === 'welcome') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="relative w-64 h-64 mx-auto mb-12">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-mint via-lavender to-peach opacity-20 blur-3xl"></div>
            <div className="relative w-full h-full rounded-full bg-primary flex items-center justify-center">
              <div className="absolute inset-8 rounded-full border-4 border-mint/30"></div>
              <div className="absolute inset-12 rounded-full border-2 border-lavender/20"></div>
              <div className="absolute inset-16 rounded-full border border-peach/10"></div>
              <h1 className="text-6xl font-display font-bold text-primary-foreground tracking-tight">
                SORA
              </h1>
            </div>
            <Sparkle className="absolute top-4 right-8 text-mint" size={32} weight="fill" />
            <Sparkle className="absolute bottom-12 left-4 text-lavender" size={24} weight="fill" />
          </div>

          <h2 className="text-4xl font-display font-bold mb-4">
            Easy ways to<br />manage your<br />finances
          </h2>
          
          <p className="text-muted-foreground text-lg mb-12">
            Take control of your financial future with smart tracking and insights
          </p>

          <Button
            size="lg"
            className="w-full h-14 text-lg font-semibold rounded-full"
            onClick={() => setMode('login')}
          >
            Get Started
            <ArrowRight size={24} weight="bold" className="ml-2" />
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl font-display font-bold mb-2">SORA</h1>
          <p className="text-muted-foreground">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="James Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 rounded-full font-semibold"
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {mode === 'login' 
              ? "Don't have an account? Sign up" 
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
