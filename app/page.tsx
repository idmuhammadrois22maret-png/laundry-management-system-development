'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DashboardContent } from '@/components/dashboard-content'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUser(user)
      } else {
        // Demo mode with first user from database
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email')
          .limit(1)
          .single()

        if (profiles) {
          setUser({ id: profiles.id, email: profiles.email })
        }
      }
      setIsLoading(false)
    }

    loadUser()
  }, [])

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">No user found</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <DashboardContent user={user} />
    </main>
  )
}
