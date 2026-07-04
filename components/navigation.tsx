'use client'

import { Button } from '@/components/ui/button'

export function Navigation({ user }: { user: any }) {
  // Demo mode - logout disabled for testing

  return (
    <nav className="border-b border-border bg-card">
      <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="font-semibold text-lg text-foreground">Laundry Manager</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user?.email}</span>
          <Button
            variant="outline"
            size="sm"
            disabled
          >
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  )
}
