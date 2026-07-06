'use client'

import * as React from 'react'
import {
  LayoutDashboard, Users, ShoppingCart, CreditCard, Bell, FileText,
  ChevronLeft, Sparkles, Moon, Sun, LogOut,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger,
} from '@/components/ui/sidebar'
import { useTheme } from '@/hooks/use-theme'
import { createClient } from '@/lib/supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AppSidebarProps {
  children: React.ReactNode
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'customers', label: 'Customers', icon: Users, href: '/customers' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, href: '/orders' },
  { id: 'payments', label: 'Payments', icon: CreditCard, href: '/payments' },
  { id: 'notifications', label: 'Notifications', icon: Bell, href: '/notifications' },
  { id: 'reports', label: 'Reports', icon: FileText, href: '/reports' },
]

export function AppSidebar({ children }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggle } = useTheme()
  const currentPage = pathname.split('/').pop() || 'dashboard'

  const breadcrumbLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    customers: 'Customers',
    orders: 'Orders',
    payments: 'Payments',
    notifications: 'Notifications',
    reports: 'Reports',
  }
  const breadcrumb = breadcrumbLabels[currentPage] || 'Dashboard'

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="flex items-center gap-3 w-full group cursor-default"
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                  <rect width="32" height="32" rx="8" fill="#111827"/>
                  <path d="M10 20V12L16 8L22 12V20L16 24L10 20Z" fill="white" opacity="0.9"/>
                  <path d="M13 16L15 18L19 14" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-bold text-base tracking-tight group-data-[collapsible=icon]:hidden">Laundrio</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = currentPage === item.id
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => router.push(item.href)}
                        tooltip={item.label}
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent data-[open]:bg-sidebar-accent">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-[10px] font-bold text-white">
                    A
                  </div>
                  <div className="flex-1 text-left min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="truncate text-sm font-medium">Akun</p>
                    <p className="truncate text-xs text-muted-foreground">Kelola akun</p>
                  </div>
                  <LogOut className="size-3.5 shrink-0 text-muted-foreground/60 group-data-[collapsible=icon]:hidden" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="top" className="w-56">
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 gap-3">
                    <LogOut className="size-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2 bg-background">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1">
              <ChevronLeft className="size-4" />
            </SidebarTrigger>
            <span className="text-sm font-medium text-foreground ml-1">/ {breadcrumb}</span>
          </div>
          <button
            onClick={toggle}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
            title={theme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
            <span className="hidden sm:inline">{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}
