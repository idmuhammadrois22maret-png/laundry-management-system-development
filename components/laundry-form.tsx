'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

interface LaundryFormProps {
  onCycleAdded: () => void
  userId: string
}

export function LaundryForm({ onCycleAdded, userId }: LaundryFormProps) {
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const { error: insertError } = await supabase.from('laundry_cycles').insert([
        {
          user_id: userId,
          status: 'pending',
          notes: notes || null,
        },
      ])

      if (insertError) {
        throw insertError
      }

      setNotes('')
      onCycleAdded()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create cycle')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-card p-6 mb-6"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Cycle Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Whites, Towels, Delicates..."
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            rows={3}
          />
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? 'Creating...' : 'Start New Cycle'}
          </Button>
        </div>
      </div>
    </form>
  )
}
