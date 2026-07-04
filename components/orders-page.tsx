'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit2, Trash2, Calendar, User, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { OrderCreatePage } from './order-create-page'
import { OrderEditPage } from './order-edit-page'

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  paid: boolean
  pickup_date?: string
  created_at: string
  customers?: { name: string; phone: string }
}

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customers (name, phone)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Gagal memuat pesanan')
      return
    }

    setOrders(data || [])
    setIsLoading(false)
  }

  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${orderNumber}?`)) {
      return
    }

    const supabase = createClient()
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)

    if (error) {
      toast.error('Gagal menghapus pesanan')
      return
    }

    toast.success('Pesanan berhasil dihapus')
    loadOrders()
  }

  if (currentView === 'create') {
    return (
      <OrderCreatePage
        onBack={() => {
          setCurrentView('list')
          loadOrders()
        }}
        onSuccess={() => {
          setCurrentView('list')
          loadOrders()
        }}
      />
    )
  }

  if (currentView === 'edit' && selectedOrder) {
    return (
      <OrderEditPage
        order={selectedOrder}
        onBack={() => {
          setCurrentView('list')
          setSelectedOrder(null)
          loadOrders()
        }}
        onSuccess={() => {
          setCurrentView('list')
          setSelectedOrder(null)
          loadOrders()
        }}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'ready':
        return 'bg-purple-100 text-purple-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Manajemen Pesanan</h1>
          <p className="text-muted-foreground mt-2">Kelola pesanan pelanggan Anda</p>
        </div>
        <Button onClick={() => setCurrentView('create')} className="gap-2">
          <Plus className="w-4 h-4" />
          Pesanan Baru
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Belum ada pesanan</p>
              <Button onClick={() => setCurrentView('create')} className="gap-2">
                <Plus className="w-4 h-4" />
                Buat Pesanan Pertama
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-lg font-bold">{order.order_number}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                      {order.paid && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          LUNAS
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{order.customers?.name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-semibold">Rp {order.total_amount.toLocaleString('id-ID')}</span>
                      </div>
                      {order.pickup_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(order.pickup_date).toLocaleDateString('id-ID', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => {
                        setSelectedOrder(order)
                        setCurrentView('edit')
                      }}
                      size="sm"
                      variant="outline"
                      className="gap-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteOrder(order.id, order.order_number)}
                      size="sm"
                      variant="destructive"
                      className="gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
