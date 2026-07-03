'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export function Navigation({ user }: { user: any }) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="font-semibold text-lg text-foreground">Laundry Manager</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user?.email}</span>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  )
}
