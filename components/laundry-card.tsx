'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

interface LaundryCycle {
  id: string
  user_id: string
  status: 'pending' | 'running' | 'completed'
  created_at: string
  started_at: string | null
  completed_at: string | null
  notes: string | null
}

interface LaundryCardProps {
  cycle: LaundryCycle
  onUpdated: () => void
  onDeleted: () => void
}

export function LaundryCard({ cycle, onUpdated, onDeleted }: LaundryCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
      case 'running':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-400'
      case 'completed':
        return 'bg-green-500/20 text-green-700 dark:text-green-400'
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const handleStatusChange = async (newStatus: 'pending' | 'running' | 'completed') => {
    setIsUpdating(true)
    setError(null)

    try {
      const updateData: any = { status: newStatus }

      if (newStatus === 'running' && !cycle.started_at) {
        updateData.started_at = new Date().toISOString()
      }

      if (newStatus === 'completed' && !cycle.completed_at) {
        updateData.completed_at = new Date().toISOString()
      }

      const { error: updateError } = await supabase
        .from('laundry_cycles')
        .update(updateData)
        .eq('id', cycle.id)

      if (updateError) {
        throw updateError
      }

      onUpdated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cycle')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this cycle? This cannot be undone.')) {
      return
    }

    setIsUpdating(true)
    setError(null)

    try {
      const { error: deleteError } = await supabase
        .from('laundry_cycles')
        .delete()
        .eq('id', cycle.id)

      if (deleteError) {
        throw deleteError
      }

      onDeleted()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete cycle')
    } finally {
      setIsUpdating(false)
    }
  }

  const createdDate = new Date(cycle.created_at)
  const startedDate = cycle.started_at ? new Date(cycle.started_at) : null
  const completedDate = cycle.completed_at ? new Date(cycle.completed_at) : null

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(cycle.status)}`}>
            {getStatusLabel(cycle.status)}
          </span>
          <span className="text-xs text-muted-foreground">
            {createdDate.toLocaleDateString()} {createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {cycle.notes && (
          <p className="text-sm text-foreground mb-3 bg-muted/30 rounded p-2">
            {cycle.notes}
          </p>
        )}

        {startedDate && (
          <p className="text-xs text-muted-foreground mb-1">
            Started: {startedDate.toLocaleDateString()} {startedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}

        {completedDate && (
          <p className="text-xs text-muted-foreground">
            Completed: {completedDate.toLocaleDateString()} {completedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-2 mb-3 text-xs text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {cycle.status !== 'completed' && (
          <>
            {cycle.status === 'pending' && (
              <Button
                onClick={() => handleStatusChange('running')}
                disabled={isUpdating}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                {isUpdating ? 'Updating...' : 'Start Cycle'}
              </Button>
            )}

            {cycle.status === 'running' && (
              <Button
                onClick={() => handleStatusChange('completed')}
                disabled={isUpdating}
                className="w-full bg-green-600 hover:bg-green-700"
                size="sm"
              >
                {isUpdating ? 'Updating...' : 'Mark Complete'}
              </Button>
            )}
          </>
        )}

        <Button
          onClick={handleDelete}
          disabled={isUpdating}
          variant="outline"
          size="sm"
          className="w-full text-destructive hover:text-destructive"
        >
          Delete
        </Button>
      </div>
    </div>
  )
}
