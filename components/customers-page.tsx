'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTable, type Column } from '@/components/data-table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Plus, Edit2, Trash2, Phone, Mail, MapPin, Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { CustomerCreatePage } from './customer-create-page'
import { CustomerEditPage } from './customer-edit-page'

interface Customer {
  id: string
  name: string
  email?: string
  phone: string
  address?: string
  city?: string
  postal_code?: string
  total_orders: number
  total_spent: number
}

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  useEffect(() => { loadCustomers() }, [])

  const loadCustomers = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false })
    if (error) { toast.error('Gagal memuat pelanggan'); return }
    setCustomers(data || [])
    setIsLoading(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus ${name}?`)) return
    const supabase = createClient()
    const { error } = await supabase.from('customers').delete().eq('id', id)
    if (error) { toast.error('Gagal menghapus'); return }
    toast.success('Pelanggan dihapus')
    loadCustomers()
  }

  const customerColumns: Column<Customer>[] = [
    {
      key: 'name',
      label: 'Nama',
      render: (c) => <span className="font-medium">{c.name}</span>,
    },
    {
      key: 'phone',
      label: 'Kontak',
      render: (c) => (
        <div className="flex items-center gap-2">
          <Phone className="size-3 text-muted-foreground" />
          <span>{c.phone}</span>
        </div>
      ),
    },
    {
      key: 'city',
      label: 'Kota',
      render: (c) => <span className="text-muted-foreground">{c.city || '-'}</span>,
    },
    {
      key: 'orders',
      label: 'Pesanan',
      align: 'center',
      render: (c) => <span>{c.total_orders || 0}</span>,
    },
    {
      key: 'total',
      label: 'Total',
      align: 'right',
      render: (c) => <span className="font-medium">Rp {((c.total_spent || 0) / 1000).toLocaleString('id-ID')}K</span>,
    },
    {
      key: 'actions',
      label: 'Aksi',
      align: 'right',
      render: (c) => (
        <div className="flex justify-end gap-1">
          <Button size="sm" variant="ghost" onClick={() => { setSelectedCustomer(c); setEditOpen(true) }}>
            <Edit2 className="size-3.5" />
          </Button>
          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(c.id, c.name)}>
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  const stats = [
    { title: 'Total Pelanggan', value: customers.length.toString(), icon: Users, bg: 'bg-cyan-50', color: 'text-cyan-600' },
    { title: 'Total Pesanan', value: customers.reduce((s, c) => s + (c.total_orders || 0), 0).toLocaleString('id-ID'), icon: ShoppingCart, bg: 'bg-orange-50', color: 'text-orange-600' },
    { title: 'Total Belanja', value: `Rp ${(customers.reduce((s, c) => s + (c.total_spent || 0), 0) / 1000).toFixed(0)}K`, icon: DollarSign, bg: 'bg-lime-50', color: 'text-lime-600' },
    { title: 'Rata-rata Pesanan', value: customers.length > 0 ? (customers.reduce((s, c) => s + (c.total_orders || 0), 0) / customers.length).toFixed(1) : '0', icon: TrendingUp, bg: 'bg-rose-50', color: 'text-rose-600' },
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pelanggan</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola data pelanggan Anda</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="size-4" />
          Pelanggan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => {
          const Icon = s.icon
          return (
            <div key={s.title} className="rounded-[24px] bg-muted/30 p-2 transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5">
              <p className="text-sm font-medium text-foreground font-bold p-2">{s.title}</p>
              <div className="flex items-center justify-between rounded-xl bg-card p-5">
                <div className="space-y-1">
                  <p className="text-5xl font-bold tracking-tight text-foreground">{s.value}</p>
                </div>
                <div className={`flex size-[60px] shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
                  <Icon className={`size-6 ${s.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Tambah Pelanggan</DialogTitle>
            <DialogDescription>Masukkan data pelanggan baru</DialogDescription>
          </DialogHeader>
          <CustomerCreatePage
            onBack={() => setCreateOpen(false)}
            onSuccess={() => { setCreateOpen(false); loadCustomers() }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(o) => { setEditOpen(o); if (!o) setSelectedCustomer(null) }}>
        {selectedCustomer && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Pelanggan</DialogTitle>
              <DialogDescription>{selectedCustomer.name}</DialogDescription>
            </DialogHeader>
            <CustomerEditPage
              customer={selectedCustomer}
              onBack={() => { setEditOpen(false); setSelectedCustomer(null); loadCustomers() }}
              onSuccess={() => { setEditOpen(false); setSelectedCustomer(null); loadCustomers() }}
            />
          </DialogContent>
        )}
      </Dialog>

      {/* Table */}
      <DataTable
        title="Daftar Pelanggan"
        columns={customerColumns}
        data={customers}
        emptyMessage="Belum ada pelanggan. Tambahkan pelanggan pertama Anda."
      />
    </div>
  )
}
