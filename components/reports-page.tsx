'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileDown, BarChart3, TrendingUp } from 'lucide-react'
import jsPDF from 'jspdf'
import Papa from 'papaparse'

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

  const supabase = createClient()

  useEffect(() => {
    loadReportData()
  }, [])

  const loadReportData = async () => {
    try {
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, customers(name, phone)')
        .order('created_at', { ascending: false })

      setOrders(ordersData || [])

      // Calculate report metrics
      if (ordersData && ordersData.length > 0) {
        const completed = ordersData.filter(o => o.status === 'completed').length
        const totalRevenue = ordersData
          .filter(o => o.paid)
          .reduce((sum, o) => sum + (o.total_amount || 0), 0)
        const pendingAmount = ordersData
          .filter(o => !o.paid)
          .reduce((sum, o) => sum + (o.total_amount || 0), 0)

        setReportData({
          totalOrders: ordersData.length,
          completedOrders: completed,
          totalRevenue,
          averageOrderValue: ordersData.length > 0 ? 
            ordersData.reduce((sum, o) => sum + (o.total_amount || 0), 0) / ordersData.length : 0,
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
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv))
    element.setAttribute('download', `laundry_orders_${new Date().toISOString().split('T')[0]}.csv`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = 20

    // Title
    doc.setFontSize(16)
    doc.text('Laundry Business Report', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 15

    // Report Date
    doc.setFontSize(10)
    doc.text(`Report Generated: ${new Date().toLocaleDateString('id-ID')}`, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 15

    // Summary Section
    doc.setFontSize(12)
    doc.text('Summary', 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    const summaryData = [
      `Total Orders: ${reportData.totalOrders}`,
      `Completed Orders: ${reportData.completedOrders}`,
      `Total Revenue: Rp ${(reportData.totalRevenue / 1000000).toFixed(2)}M`,
      `Average Order Value: Rp ${(reportData.averageOrderValue / 1000).toFixed(0)}K`,
      `Pending Amount: Rp ${(reportData.pendingAmount / 1000000).toFixed(2)}M`,
    ]

    summaryData.forEach(item => {
      doc.text(item, 20, yPosition)
      yPosition += 8
    })

    yPosition += 10

    // Orders Table
    doc.setFontSize(12)
    doc.text('Orders List', 20, yPosition)
    yPosition += 10

    const tableData = orders.slice(0, 20).map(order => [
      order.order_number,
      order.customers?.name || 'N/A',
      `Rp ${(order.total_amount / 1000).toFixed(0)}K`,
      order.status,
      order.paid ? 'Yes' : 'No',
    ])

    doc.setFontSize(9)
    doc.autoTable({
      head: [['Order #', 'Customer', 'Amount', 'Status', 'Paid']],
      body: tableData,
      startY: yPosition,
      margin: { left: 20, right: 20 },
      styles: { fontSize: 9 },
      headStyles: { fillColor: [66, 135, 245] },
    })

    const filename = `laundry_report_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(filename)
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline" className="gap-2">
            <FileDown className="w-4 h-4" />
            Export CSV
          </Button>
          <Button onClick={exportToPDF} className="gap-2">
            <FileDown className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalOrders}</div>
            <p className="text-xs text-muted-foreground">All orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{reportData.completedOrders}</div>
            <p className="text-xs text-muted-foreground">Finished orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <FileDown className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Rp {(reportData.totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Paid orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {(reportData.averageOrderValue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Average value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">Rp {(reportData.pendingAmount / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Unpaid amount</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Order #</th>
                  <th className="text-left py-3 px-4 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Payment</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      No orders to report
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono text-xs">{order.order_number}</td>
                      <td className="py-3 px-4">{order.customers?.name || 'N/A'}</td>
                      <td className="py-3 px-4">Rp {(order.total_amount / 1000).toFixed(0)}K</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'ready' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.paid ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {new Date(order.created_at).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
