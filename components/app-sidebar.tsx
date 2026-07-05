'use client'

import * as React from 'react'
import {
  LayoutDashboard, Users, ShoppingCart, CreditCard, Bell, FileText,
  ChevronLeft, Sparkles, Moon, Sun,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger,
} from '@/components/ui/sidebar'
import { useTheme } from '@/hooks/use-theme'

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
                <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 shadow-sm ring-1 ring-white/20">
                  <Sparkles className="size-4 text-white" />
                </div>
                <span className="font-bold text-base tracking-tight">LaundryFlow</span>
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
                        <Icon className="size-4" />
                        <span>{item.label}</span>
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
              <div className="px-3 py-2">
                <div className="rounded-lg bg-sidebar-accent p-3">
                  <p className="text-xs font-semibold">Demo Mode</p>
                  <p className="text-[10px] text-sidebar-accent-foreground/60 mt-0.5">
                    All features unlocked
                  </p>
                </div>
              </div>
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
