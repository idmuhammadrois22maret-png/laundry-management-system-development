import { Button } from '@/components/ui/button'
import { LayoutDashboard, Users, ShoppingCart, FileText, Bell } from 'lucide-react'

interface AppSidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export function AppSidebar({ currentPage, onPageChange }: AppSidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'reports', label: 'Reports', icon: FileText },
  ]

  return (
    <aside className="w-64 border-r border-border bg-card">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">LaundryPro</h1>
        <p className="text-xs text-muted-foreground mt-1">Business Management</p>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <Button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              variant={isActive ? 'default' : 'ghost'}
              className="w-full justify-start gap-2"
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <div className="bg-primary/10 rounded-lg p-3">
          <p className="text-xs font-semibold text-foreground">Demo Mode</p>
          <p className="text-xs text-muted-foreground mt-1">All features unlocked for testing</p>
        </div>
      </div>
    </aside>
  )
}
