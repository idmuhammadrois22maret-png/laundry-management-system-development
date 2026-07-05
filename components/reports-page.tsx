'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { DataTable, type Column } from '@/components/data-table'
import {
  FileDown, BarChart3, TrendingUp, DollarSign, CheckCircle2, Clock,
} from 'lucide-react'
import jsPDF from 'jspdf'
import Papa from 'papaparse'
import { toast } from 'sonner'

interface OrderData {
  id: string
  order_number: string
  customer_id: string
  status: string
  total_amount: number
  paid: boolean
  created_at: string
  customers?: { name: string; phone: string }
}

function StatsCard({ title, value, icon: Icon, bg, color, growth, growthColor }: {
  title: string; value: string; icon: React.ElementType; bg: string; color: string
  growth?: string; growthColor?: string
}) {
  return (
    <div className="rounded-[24px] bg-muted/30 p-4 transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5">
      <div className="flex items-start justify-between rounded-xl bg-card p-5">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-5xl font-bold tracking-tight text-foreground">{value}</p>
          {growth && <p className={`text-sm ${growthColor}`}>{growth}</p>}
        </div>
        <div className={`flex size-[60px] shrink-0 items-center justify-center rounded-xl ${bg}`}>
          <Icon className={`size-6 ${color}`} />
        </div>
      </div>
    </div>
  )
}

export function ReportsPage() {
  const [orders, setOrders] = useState<OrderData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reportData, setReportData] = useState({
    totalOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    pendingAmount: 0,
  })

  const reportColumns: Column<OrderData>[] = [
    {
      key: 'order_number',
      label: 'Pesanan',
      render: (o) => <span className="font-mono text-xs text-muted-foreground">{o.order_number}</span>,
    },
    {
      key: 'customer',
      label: 'Pelanggan',
      render: (o) => <span className="font-medium">{o.customers?.name || 'N/A'}</span>,
    },
    {
      key: 'amount',
      label: 'Jumlah',
      align: 'right',
      render: (o) => <span>Rp {o.total_amount.toLocaleString('id-ID')}</span>,
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
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${colors[o.status] || 'bg-red-50 text-red-700 ring-red-600/20'}`}>
            {o.status.replace(/_/g, ' ')}
          </span>
        )
      },
    },
    {
      key: 'payment',
      label: 'Pembayaran',
      render: (o) => (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${o.paid ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-gray-50 text-gray-600 ring-gray-600/20'}`}>
          {o.paid ? 'Lunas' : 'Belum'}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Tanggal',
      align: 'right',
      render: (o) => <span className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString('id-ID')}</span>,
    },
  ]

  const supabase = createClient()

  useEffect(() => { loadReportData() }, [])

  const loadReportData = async () => {
    try {
      const { data: ordersData } = await supabase
        .from('orders').select('*, customers(name, phone)').order('created_at', { ascending: false })

      setOrders(ordersData || [])

      if (ordersData && ordersData.length > 0) {
        const completed = ordersData.filter(o => o.status === 'completed').length
        const totalRevenue = ordersData.filter(o => o.paid).reduce((sum, o) => sum + (o.total_amount || 0), 0)
        const pendingAmount = ordersData.filter(o => !o.paid).reduce((sum, o) => sum + (o.total_amount || 0), 0)

        setReportData({
          totalOrders: ordersData.length,
          completedOrders: completed,
          totalRevenue,
          averageOrderValue: ordersData.length > 0
            ? ordersData.reduce((sum, o) => sum + (o.total_amount || 0), 0) / ordersData.length : 0,
          pendingAmount,
        })
      }
    } catch (error) {
      console.error('[v0] Error loading report data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const exportToCSV = () => {
    const csvData = orders.map(order => ({
      'Order Number': order.order_number,
      'Customer': order.customers?.name || 'N/A',
      'Phone': order.customers?.phone || 'N/A',
      'Amount': `Rp ${order.total_amount}`,
      'Status': order.status,
      'Paid': order.paid ? 'Yes' : 'No',
      'Date': new Date(order.created_at).toLocaleDateString('id-ID'),
    }))
    const csv = Papa.unparse(csvData)
    const el = document.createElement('a')
    el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv))
    el.setAttribute('download', `laundry_orders_${new Date().toISOString().split('T')[0]}.csv`)
    el.click()
    toast.success('CSV berhasil diexport')
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Laporan LaundryFlow', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' })
    doc.setFontSize(10)
    doc.text(`Dibuat: ${new Date().toLocaleDateString('id-ID')}`, doc.internal.pageSize.getWidth() / 2, 28, { align: 'center' })
    doc.setFontSize(12)
    doc.text('Ringkasan', 20, 40)
    doc.setFontSize(10)
    const items = [
      `Total Pesanan: ${reportData.totalOrders}`,
      `Selesai: ${reportData.completedOrders}`,
      `Pendapatan: Rp ${(reportData.totalRevenue / 1000000).toFixed(2)}M`,
      `Rata-rata: Rp ${(reportData.averageOrderValue / 1000).toFixed(0)}K`,
      `Belum Dibayar: Rp ${(reportData.pendingAmount / 1000000).toFixed(2)}M`,
    ]
    items.forEach((item, i) => doc.text(item, 20, 52 + i * 8))

    doc.save(`laporan_laundry_${new Date().toISOString().split('T')[0]}.pdf`)
    toast.success('PDF berhasil diexport')
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="animate-pulse rounded-[24px] bg-muted/30 p-4">
              <div className="rounded-xl bg-card p-5 space-y-3">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-10 w-20 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="animate-pulse h-64 bg-muted rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laporan</h1>
          <p className="text-sm text-muted-foreground mt-1">Analitik dan export data bisnis Anda</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline" className="gap-2">
            <FileDown className="size-4" /> CSV
          </Button>
          <Button onClick={exportToPDF} className="gap-2">
            <FileDown className="size-4" /> PDF
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Pesanan" value={reportData.totalOrders.toString()} icon={BarChart3} bg="bg-blue-50" color="text-blue-600" growth="All time" growthColor="text-muted-foreground" />
        <StatsCard title="Selesai" value={reportData.completedOrders.toString()} icon={CheckCircle2} bg="bg-emerald-50" color="text-emerald-600" growth={`${reportData.totalOrders > 0 ? ((reportData.completedOrders / reportData.totalOrders) * 100).toFixed(0) : 0}% completion`} growthColor="text-green-600" />
        <StatsCard title="Pendapatan" value={`Rp ${(reportData.totalRevenue / 1000000).toFixed(1)}M`} icon={DollarSign} bg="bg-lime-50" color="text-lime-600" />
        <StatsCard title="Belum Dibayar" value={`Rp ${(reportData.pendingAmount / 1000000).toFixed(1)}M`} icon={Clock} bg="bg-rose-50" color="text-rose-600" />
      </div>

      {/* Table */}
      <DataTable
        title="Detail Pesanan"
        columns={reportColumns}
        data={orders}
        emptyMessage="Belum ada data"
      />
    </div>
  )
}
