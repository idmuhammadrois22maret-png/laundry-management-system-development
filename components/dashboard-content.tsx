'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LaundryForm } from '@/components/laundry-form'
import { LaundryCard } from '@/components/laundry-card'
import { Navigation } from '@/components/navigation'

interface LaundryProfile {
  id: string
  email: string
  created_at: string
}

interface LaundryCycle {
  id: string
  user_id: string
  status: 'pending' | 'running' | 'completed'
  created_at: string
  started_at: string | null
  completed_at: string | null
  notes: string | null
}

export function DashboardContent({ user }: { user: any }) {
  const [cycles, setCycles] = useState<LaundryCycle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [profile, setProfile] = useState<LaundryProfile | null>(null)

  const supabase = createClient()

  useEffect(() => {
    loadCycles()
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) {
      setProfile(data)
    }
  }

  const loadCycles = async () => {
    setIsLoading(true)
    const { data } = await supabase
      .from('laundry_cycles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) {
      setCycles(data)
    }
    setIsLoading(false)
  }

  const handleCycleAdded = async () => {
    setShowForm(false)
    loadCycles()
  }

  const handleCycleUpdated = async () => {
    loadCycles()
  }

  const handleCycleDeleted = async () => {
    loadCycles()
  }

  const activeCycles = cycles.filter((c) => c.status !== 'completed')
  const completedCycles = cycles.filter((c) => c.status === 'completed')

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navigation user={user} />

      <div className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Laundry Manager</h1>
              <p className="text-muted-foreground mt-2">
                Track washing machine cycles for {profile?.email || 'your household'}
              </p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              {showForm ? 'Cancel' : 'New Cycle'}
            </Button>
          </div>

          {showForm && <LaundryForm onCycleAdded={handleCycleAdded} userId={user.id} />}
        </div>

        {/* Active Cycles */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Active Cycles</h2>
          {activeCycles.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">No active laundry cycles</p>
              <p className="text-sm text-muted-foreground mt-1">Start a new cycle to track your laundry</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {activeCycles.map((cycle) => (
                <LaundryCard
                  key={cycle.id}
                  cycle={cycle}
                  onUpdated={handleCycleUpdated}
                  onDeleted={handleCycleDeleted}
                />
              ))}
            </div>
          )}
        </div>

        {/* Completed Cycles */}
        {completedCycles.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Completed Cycles</h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {completedCycles.map((cycle) => (
                <div
                  key={cycle.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card/50 p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                      <span className="text-sm font-medium text-foreground">
                        Completed {new Date(cycle.completed_at!).toLocaleDateString()}
                      </span>
                    </div>
                    {cycle.notes && <p className="text-sm text-muted-foreground mt-1">{cycle.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
