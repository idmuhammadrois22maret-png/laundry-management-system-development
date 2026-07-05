'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
/**/
import { Plus, Edit2, Trash2, Calendar, User, DollarSign, Printer, MessageSquare, Search } from 'lucide-react'
import { toast } from 'sonner'
import { OrderCreatePage } from './order-create-page'
import { OrderEditPage } from './order-edit-page'
import { DeleteConfirmDialog } from './delete-confirm-dialog'
import { openInvoiceWindow, getWhatsAppUrl } from '@/lib/invoice'

interface Order {
  id: string
  customer_id: string
  order_number: string
  status: string
  total_amount: number
  paid: boolean
  pickup_date?: string
  notes?: string
  created_at: string
  customers?: { name: string; phone: string }
}

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [search, setSearch] = useState('')

  // Delete confirm dialog
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const filteredOrders = orders.filter(o => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      o.order_number.toLowerCase().includes(q) ||
      o.customers?.name?.toLowerCase().includes(q) ||
      o.customers?.phone?.toLowerCase().includes(q) ||
      o.status.toLowerCase().includes(q)
    )
  })

  const handlePrintInvoice = (order: Order) => {
    openInvoiceWindow(order)
  }

  const handleSendWhatsApp = (order: Order) => {
    const url = getWhatsAppUrl(order)
    if (!url) {
      toast.error('Nomor pelanggan tidak tersedia')
      return
    }
    window.open(url, '_blank')
  }

  const openDeleteDialog = (order: Order) => {
    setDeletingOrder(order)
    setDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingOrder) return
    setIsDeleting(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', deletingOrder.id)

    setIsDeleting(false)
    setDeleteOpen(false)
    setDeletingOrder(null)

    if (error) {
      toast.error('Gagal menghapus pesanan')
      return
    }

    toast.success(`Pesanan ${deletingOrder.order_number} berhasil dihapus`)
    loadOrders()
  }

  const handleCreateSuccess = () => {
    setCreateOpen(false)
    loadOrders()
  }

  const handleEditSuccess = () => {
    setEditOpen(false)
    setSelectedOrder(null)
    loadOrders()
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-48" />
          <div className="h-8 bg-muted rounded w-64" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'ready': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pesanan</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola pesanan laundry pelanggan</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="size-4" />
          Pesanan Baru
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Cari no. pesanan, nama pelanggan, status..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 max-w-md"
        />
      </div>

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Hapus Pesanan"
        message={`Yakin ingin menghapus ${deletingOrder?.order_number}?\nTindakan ini tidak bisa dibatalkan.`}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pesanan Baru</DialogTitle>
            <DialogDescription>Buat pesanan laundry untuk pelanggan</DialogDescription>
          </DialogHeader>
          <OrderCreatePage
            onBack={() => setCreateOpen(false)}
            onSuccess={handleCreateSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) setSelectedOrder(null) }}>
        {selectedOrder && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Pesanan</DialogTitle>
              <DialogDescription>{selectedOrder.order_number}</DialogDescription>
            </DialogHeader>
            <OrderEditPage
              order={selectedOrder}
              onBack={() => { setEditOpen(false); setSelectedOrder(null) }}
              onSuccess={handleEditSuccess}
            />
          </DialogContent>
        )}
      </Dialog>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                {search ? 'Pesanan tidak ditemukan' : 'Belum ada pesanan'}
              </p>
              {!search && (
                <Button onClick={() => setCreateOpen(true)} className="gap-2">
                  <Plus className="size-4" />
                  Buat Pesanan Pertama
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-bold">{order.order_number}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                      {order.paid && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          LUNAS
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="size-3.5 text-muted-foreground shrink-0" />
                        <span>{order.customers?.name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="size-3.5 text-muted-foreground shrink-0" />
                        <span className="font-semibold">Rp {order.total_amount.toLocaleString('id-ID')}</span>
                      </div>
                      {order.pickup_date && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                          <span>{new Date(order.pickup_date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => handlePrintInvoice(order)}
                      size="sm"
                      variant="outline"
                      className="gap-1"
                    >
                      <Printer className="size-3.5" />
                      Invoice
                    </Button>
                    <Button
                      onClick={() => handleSendWhatsApp(order)}
                      size="sm"
                      variant="outline"
                      className="gap-1"
                    >
                      <MessageSquare className="size-3.5" />
                      WA
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedOrder(order)
                        setEditOpen(true)
                      }}
                      size="sm"
                      variant="outline"
                      className="gap-1"
                    >
                      <Edit2 className="size-3.5" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => openDeleteDialog(order)}
                      size="sm"
                      variant="destructive"
                      className="gap-1"
                    >
                      <Trash2 className="size-3.5" />
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
