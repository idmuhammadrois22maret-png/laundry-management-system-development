'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, Globe } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/app')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    const supabase = createClient()
    setGoogleLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) throw error
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      setGoogleLoading(false)
    }
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.1, 0, 1] },
    }),
  }

  return (
    <div className="flex min-h-svh flex-col lg:flex-row">
      {/* Left — hero image */}
      <div className="relative flex flex-col justify-between px-8 py-10 lg:w-[60%] lg:px-14 lg:py-12 overflow-hidden">
        {/* Background + overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#1e293b] to-[#0f172a]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIG9wYWNpdHk9IjAuMDMiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48cGF0aCBkPSJNNDAgMGg0MHY0MEg0MHoiLz48cGF0aCBkPSJNMCA0MGg0MHY0MEgweiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik00MCA0MGg0MHY0MEg0MHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

        {/* Badge */}
        <motion.div
          custom={0} variants={fadeUp} initial="hidden" animate="visible"
          className="relative z-10 mb-auto"
        >
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur-sm">
            LaundryFlow Dashboard
          </span>
        </motion.div>

        {/* Text */}
        <div className="relative z-10 max-w-lg">
          <motion.h1
            custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            Welcome Back
          </motion.h1>
          <motion.p
            custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className="mt-4 text-lg leading-relaxed text-white/60"
          >
            Manage your laundry business, customers, orders, and payments from one modern dashboard.
          </motion.p>
        </div>

        {/* Copyright */}
        <motion.p
          custom={3} variants={fadeUp} initial="hidden" animate="visible"
          className="relative z-10 text-xs text-white/30"
        >
          &copy; {new Date().getFullYear()} LaundryFlow. All rights reserved.
        </motion.p>
      </div>

      {/* Right — login card */}
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-10 lg:w-[40%]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
          className="w-full max-w-[420px] space-y-8"
        >
          {/* Logo */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#111827]">
                <span className="text-sm font-bold text-white">L</span>
              </div>
              <span className="text-lg font-bold tracking-tight">LaundryFlow</span>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Sign in</h2>
            <p className="text-sm text-muted-foreground">Enter your credentials to continue.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" checked={remember} onCheckedChange={(v) => setRemember(v as boolean)} />
              <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">
                Remember me
              </Label>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" className="gap-2 h-11" disabled={googleLoading} onClick={handleGoogleLogin}>
                <Globe className="size-4" />
                Google
              </Button>
              <Button type="button" variant="outline" className="gap-2 h-11" disabled>
                <svg className="size-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                GitHub
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/auth/sign-up" className="font-medium text-foreground underline underline-offset-2 hover:text-primary">
              Register
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
