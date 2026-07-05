'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Users, ShoppingCart, TrendingUp, Clock,
  DollarSign, Eye,
} from 'lucide-react'
import { DataTable, type Column } from '@/components/data-table'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

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

const PIE_COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#22c55e', '#ef4444']

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
  const [revenueByDay, setRevenueByDay] = useState<{ day: string; revenue: number }[]>([])
  const [ordersByDay, setOrdersByDay] = useState<{ day: string; orders: number }[]>([])
  const [ordersByStatus, setOrdersByStatus] = useState<{ name: string; value: number }[]>([])

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
        .from('orders').select('total_amount, created_at, status, paid')
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

      // ——— Chart data ———

      // Revenue by day (last 7 days)
      const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu']
      const dayMap: Record<string, number> = {}
      const orderDayMap: Record<string, number> = {}
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const key = d.toISOString().split('T')[0]
        dayMap[key] = 0
        orderDayMap[key] = 0
      }
      ;(ordersData || []).forEach(o => {
        const key = o.created_at?.split('T')[0]
        if (key && key in dayMap) {
          dayMap[key] += o.total_amount || 0
          orderDayMap[key] += 1
        }
      })
      setRevenueByDay(
        Object.entries(dayMap).map(([date, revenue]) => ({
          day: dayNames[new Date(date).getDay()],
          revenue,
        }))
      )
      setOrdersByDay(
        Object.entries(orderDayMap).map(([date, orders]) => ({
          day: dayNames[new Date(date).getDay()],
          orders,
        }))
      )

      // Orders by status (pie)
      const statusCount: Record<string, number> = { pending: 0, in_progress: 0, ready: 0, completed: 0, cancelled: 0 }
      ;(ordersData || []).forEach(o => {
        if (statusCount.hasOwnProperty(o.status)) statusCount[o.status]++
      })
      const statusLabels: Record<string, string> = {
        pending: 'Pending',
        in_progress: 'Diproses',
        ready: 'Siap',
        completed: 'Selesai',
        cancelled: 'Batal',
      }
      setOrdersByStatus(
        Object.entries(statusCount)
          .filter(([, v]) => v > 0)
          .map(([k, v]) => ({ name: statusLabels[k] || k, value: v }))
      )
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

  const formatToIDR = (v: number) => `Rp ${(v / 1000).toFixed(0)}K`
  const formatTooltip = (v: number) => `Rp ${v.toLocaleString('id-ID')}`

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1,2].map(i => <div key={i} className="animate-pulse h-72 bg-muted rounded-[24px]" />)}
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-muted-foreground">{formatTooltip(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-muted-foreground">{payload[0].value} pesanan</p>
        </div>
      )
    }
    return null
  }

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

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="rounded-[24px] bg-muted/30 p-3">
          <h3 className="text-sm font-medium text-foreground px-2 py-2">Pendapatan 7 Hari</h3>
          <div className="rounded-xl bg-card p-5">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueByDay}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tickFormatter={formatToIDR} tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#revenueGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders by status (Pie) */}
        <div className="rounded-[24px] bg-muted/30 p-3">
          <h3 className="text-sm font-medium text-foreground px-2 py-2">Pesanan per Status</h3>
          <div className="rounded-xl bg-card p-5 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {ordersByStatus.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="hidden md:block space-y-2 ml-2">
              {ordersByStatus.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bar chart — orders per day */}
      <div className="rounded-[24px] bg-muted/30 p-3">
        <h3 className="text-sm font-medium text-foreground px-2 py-2">Pesanan 7 Hari</h3>
        <div className="rounded-xl bg-card p-5">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ordersByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip content={({ active, payload, label }: any) =>
                active && payload?.length ? (
                  <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-md">
                    <p className="font-medium">{label}</p>
                    <p className="text-muted-foreground">{payload[0].value} pesanan</p>
                  </div>
                ) : null
              } />
              <Bar dataKey="orders" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
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
