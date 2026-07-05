'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Users, ShoppingCart, TrendingUp, Clock,
  DollarSign, Eye,
} from 'lucide-react'
import { DataTable, type Column } from '@/components/data-table'

interface DashboardStats {
  totalCustomers: number
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
}

interface Order {
  id: string
  order_number: string
  total_amount: number
  status: string
  paid: boolean
  created_at: string
  customers: { name: string; phone: string } | null
}

const statsCardConfig = [
  {
    key: 'revenue',
    title: 'Total Revenue',
    icon: DollarSign,
    bg: 'bg-lime-50',
    iconColor: 'text-lime-600',
    format: (v: number) => {
      if (v >= 1_000_000) return `Rp ${(v / 1_000_000).toFixed(1)}M`
      if (v >= 1_000) return `Rp ${(v / 1_000).toFixed(1)}K`
      return `Rp ${v}`
    },
    growth: '+23% vs last month',
    growthColor: 'text-green-600',
  },
  {
    key: 'customers',
    title: 'Active Customers',
    icon: Users,
    bg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    format: (v: number) => v.toLocaleString('id-ID'),
    growth: '+12% this week',
    growthColor: 'text-green-600',
  },
  {
    key: 'orders',
    title: 'Total Orders',
    icon: Eye,
    bg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    format: (v: number) => v.toLocaleString('id-ID'),
    growth: '+5% today',
    growthColor: 'text-green-600',
  },
  {
    key: 'pending',
    title: 'Pending Orders',
    icon: TrendingUp,
    bg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    format: (v: number, total: number) =>
      total > 0 ? `${((v / total) * 100).toFixed(1)}%` : '0%',
    growth: total => {
      const pct = total > 0 ? (stats.pendingOrders / total) * 100 : 0
      return `${pct.toFixed(1)}% of total`
    },
    growthColor: 'text-amber-600',
  },
]

function StatsCard({
  title,
  value,
  growth,
  growthColor,
  icon: Icon,
  bg,
  iconColor,
}: {
  title: string
  value: string
  growth: string
  growthColor: string
  icon: React.ElementType
  bg: string
  iconColor: string
}) {
  return (
    <div className="rounded-[24px] bg-muted/30 p-3 transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5">
      <p className="text-sm font-medium text-foreground py-2">{title}</p>
      <div className="flex items-start justify-between rounded-xl bg-card p-5">
        <div className="space-y-1">
          <p className="text-5xl font-bold tracking-tight text-foreground">{value}</p>
          <p className={`text-sm ${growthColor}`}>{growth}</p>
        </div>
        <div className={`flex size-[60px] shrink-0 items-center justify-center rounded-xl ${bg}`}>
          <Icon className={`size-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  )
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    const supabase = createClient()

    try {
      setError(null)

      const { count: customersCount, error: err1 } = await supabase
        .from('customers').select('*', { count: 'exact', head: true })
      if (err1) throw err1

      const { count: ordersCount, error: err2 } = await supabase
        .from('orders').select('*', { count: 'exact', head: true })
      if (err2) throw err2

      const { count: pendingCount, error: err3 } = await supabase
        .from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      if (err3) throw err3

      const { data: ordersData, error: err4 } = await supabase
        .from('orders').select('total_amount').eq('paid', true)
      if (err4) throw err4

      const totalRevenue = ordersData?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0

      const { data: recent, error: err5 } = await supabase
        .from('orders').select('*, customers(name, phone)').order('created_at', { ascending: false }).limit(5)
      if (err5) throw err5

      setStats({
        totalCustomers: customersCount ?? 0,
        totalOrders: ordersCount ?? 0,
        pendingOrders: pendingCount ?? 0,
        totalRevenue,
      })
      setRecentOrders(recent ?? [])
    } catch (err: any) {
      console.error('Dashboard error:', err)
      setError(err?.message || err?.name || JSON.stringify(err) || 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const formatRupiah = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`

  const orderColumns: Column<Order>[] = [
    {
      key: 'order_number',
      label: 'Order',
      render: (o) => <span className="font-mono text-xs text-muted-foreground">{o.order_number}</span>,
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (o) => <span className="font-medium">{o.customers?.name || 'N/A'}</span>,
    },
    {
      key: 'amount',
      label: 'Amount',
      align: 'right',
      render: (o) => <span>{formatRupiah(o.total_amount)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (o) => {
        const colors: Record<string, string> = {
          pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
          in_progress: 'bg-blue-50 text-blue-700 ring-blue-600/20',
          ready: 'bg-purple-50 text-purple-700 ring-purple-600/20',
          completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
        }
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${colors[o.status] || 'bg-red-50 text-red-700 ring-red-600/20'}`}>
            {o.status.replace('_', ' ')}
          </span>
        )
      },
    },
    {
      key: 'payment',
      label: 'Payment',
      render: (o) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${o.paid ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-gray-50 text-gray-600 ring-gray-600/20'
          }`}>
          {o.paid ? 'Paid' : 'Unpaid'}
        </span>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse rounded-[24px] bg-muted/30 p-4">
              <div className="rounded-xl bg-card p-5 space-y-3">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-10 w-20 bg-muted rounded" />
                <div className="h-3 w-28 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="animate-pulse h-64 bg-muted rounded-xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-800">Gagal memuat data</h2>
          <p className="mt-1 text-sm text-red-600">{error}</p>
          <button
            onClick={() => { setIsLoading(true); loadDashboardData() }}
            className="mt-3 text-sm font-medium text-red-700 underline underline-offset-2 hover:text-red-800"
          >
            Coba lagi
          </button>
        </div>
      </div>
    )
  }

  const totalRevenue = stats.totalRevenue
  const totalOrders = stats.totalOrders

  return (
    <div className="space-y-8 p-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your laundry business
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={totalRevenue >= 1_000_000
            ? `Rp ${(totalRevenue / 1_000_000).toFixed(1)}M`
            : totalRevenue >= 1_000
              ? `Rp ${(totalRevenue / 1_000).toFixed(1)}K`
              : `Rp ${totalRevenue}`
          }
          growth="+23% vs last month"
          growthColor="text-green-600"
          icon={DollarSign}
          bg="bg-lime-50"
          iconColor="text-lime-600"
        />
        <StatsCard
          title="Active Customers"
          value={stats.totalCustomers.toLocaleString('id-ID')}
          growth="+12% this week"
          growthColor="text-green-600"
          icon={Users}
          bg="bg-cyan-50"
          iconColor="text-cyan-600"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString('id-ID')}
          growth="+5% today"
          growthColor="text-green-600"
          icon={Eye}
          bg="bg-orange-50"
          iconColor="text-orange-600"
        />
        <StatsCard
          title="Pending Orders"
          value={stats.totalOrders > 0
            ? `${((stats.pendingOrders / stats.totalOrders) * 100).toFixed(1)}%`
            : '0%'
          }
          growth={`${stats.pendingOrders} orders pending`}
          growthColor="text-amber-600"
          icon={TrendingUp}
          bg="bg-rose-50"
          iconColor="text-rose-600"
        />
      </div>

      {/* Recent Orders */}
      <DataTable
        title="Recent Orders"
        columns={orderColumns}
        data={recentOrders}
        emptyMessage="No orders yet. Create your first order to get started."
      />
    </div>
  )
}
