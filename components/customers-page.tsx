'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit2, Trash2, Phone, Mail, MapPin } from 'lucide-react'
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
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Gagal memuat pelanggan')
      return
    }

    setCustomers(data || [])
    setIsLoading(false)
  }

  const handleDeleteCustomer = async (customerId: string, customerName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${customerName}?`)) {
      return
    }

    const supabase = createClient()
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', customerId)

    if (error) {
      toast.error('Gagal menghapus pelanggan')
      return
    }

    toast.success('Pelanggan berhasil dihapus')
    loadCustomers()
  }

  if (currentView === 'create') {
    return (
      <CustomerCreatePage
        onBack={() => {
          setCurrentView('list')
          loadCustomers()
        }}
        onSuccess={() => {
          setCurrentView('list')
          loadCustomers()
        }}
      />
    )
  }

  if (currentView === 'edit' && selectedCustomer) {
    return (
      <CustomerEditPage
        customer={selectedCustomer}
        onBack={() => {
          setCurrentView('list')
          setSelectedCustomer(null)
          loadCustomers()
        }}
        onSuccess={() => {
          setCurrentView('list')
          setSelectedCustomer(null)
          loadCustomers()
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

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Manajemen Pelanggan</h1>
          <p className="text-muted-foreground mt-2">Kelola data pelanggan Anda</p>
        </div>
        <Button onClick={() => setCurrentView('create')} className="gap-2">
          <Plus className="w-4 h-4" />
          Tambah Pelanggan
        </Button>
      </div>

      {customers.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Belum ada pelanggan</p>
              <Button onClick={() => setCurrentView('create')} className="gap-2">
                <Plus className="w-4 h-4" />
                Tambah Pelanggan Pertama
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{customer.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {customer.phone}
                  </div>
                  {customer.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {customer.email}
                    </div>
                  )}
                  {customer.city && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {customer.city}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-border grid grid-cols-2 gap-2 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Pesanan</p>
                    <p className="text-lg font-bold">{customer.total_orders}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Belanja</p>
                    <p className="text-lg font-bold">Rp {((customer.total_spent || 0) / 1000).toLocaleString('id-ID')}K</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-border">
                  <Button
                    onClick={() => {
                      setSelectedCustomer(customer)
                      setCurrentView('edit')
                    }}
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                    size="sm"
                    variant="destructive"
                    className="gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
