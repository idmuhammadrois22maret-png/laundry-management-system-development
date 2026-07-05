'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Save } from 'lucide-react'
import { toast } from 'sonner'

interface Customer {
  id: string
  name: string
  phone: string
}

interface Service {
  id: string
  name: string
  price: number
}

interface OrderItem {
  service_id: string
  quantity: number
  unit_price: number
}

interface OrderCreatePageProps {
  onBack: () => void
  onSuccess: () => void
}

export function OrderCreatePage({ onBack, onSuccess }: OrderCreatePageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [orderItems, setOrderItems] = useState<(OrderItem & { serviceName: string })[]>([])
  const [notes, setNotes] = useState('')
  const [pickupDate, setPickupDate] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const supabase = createClient()
    const [customersRes, servicesRes] = await Promise.all([
      supabase.from('customers').select('id, name, phone').order('name'),
      supabase.from('services').select('id, name, price').order('name'),
    ])

    if (customersRes.data) setCustomers(customersRes.data)
    if (servicesRes.data) setServices(servicesRes.data)
  }

  const handleAddService = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId)
    if (!service) return

    const exists = orderItems.find(item => item.service_id === serviceId)
    if (exists) {
      toast.error('Layanan sudah ditambahkan')
      return
    }

    setOrderItems([
      ...orderItems,
      {
        service_id: serviceId,
        quantity: 1,
        unit_price: service.price,
        serviceName: service.name,
      },
    ])
  }

  const handleRemoveService = (serviceId: string) => {
    setOrderItems(orderItems.filter(item => item.service_id !== serviceId))
  }

  const handleQuantityChange = (serviceId: string, quantity: number) => {
    if (quantity < 1) return
    setOrderItems(
      orderItems.map(item =>
        item.service_id === serviceId ? { ...item, quantity } : item
      )
    )
  }

  const totalAmount = orderItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCustomer || orderItems.length === 0) {
      toast.error('Pilih pelanggan dan tambahkan minimal satu layanan')
      return
    }

    setIsLoading(true)
    const supabase = createClient()
    const orderNumber = `ORD-${Date.now()}`

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: selectedCustomer,
        order_number: orderNumber,
        status: 'pending',
        total_amount: totalAmount,
        pickup_date: pickupDate || null,
        notes,
      })
      .select()
      .single()

    if (orderError || !orderData) {
      toast.error('Gagal membuat pesanan')
      setIsLoading(false)
      return
    }

    const itemsToInsert = orderItems.map(item => ({
      order_id: orderData.id,
      service_id: item.service_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.unit_price * item.quantity,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert)

    if (itemsError) {
      toast.error('Gagal menambahkan item pesanan')
      setIsLoading(false)
      return
    }

    toast.success('Pesanan berhasil dibuat')
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Customer & Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customer">Pelanggan *</Label>
          <select
            id="customer"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
          >
            <option value="">Pilih Pelanggan</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name} ({customer.phone})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pickup">Tanggal Pengambilan</Label>
          <Input id="pickup" type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Catatan</Label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Catatan pesanan..."
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm min-h-20 resize-none"
          />
        </div>
      </div>

      {/* Services */}
      <div className="space-y-3">
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-2">
            <Label>Layanan</Label>
            <select
              onChange={(e) => {
                if (e.target.value) handleAddService(e.target.value)
                e.target.value = ''
              }}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
            >
              <option value="">Pilih layanan...</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} - Rp {service.price.toLocaleString('id-ID')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {orderItems.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {orderItems.map(item => (
              <div key={item.service_id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{item.serviceName}</p>
                  <p className="text-xs text-muted-foreground">Rp {item.unit_price.toLocaleString('id-ID')}</p>
                </div>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.service_id, parseInt(e.target.value) || 1)}
                  className="w-14 text-center text-sm"
                />
                <p className="text-sm font-medium w-20 text-right">
                  Rp {(item.unit_price * item.quantity).toLocaleString('id-ID')}
                </p>
                <Button type="button" onClick={() => handleRemoveService(item.service_id)} variant="ghost" size="icon" className="size-8">
                  <Trash2 className="size-3.5 text-red-600" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="border-t border-border pt-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">Rp {totalAmount.toLocaleString('id-ID')}</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" onClick={onBack} variant="outline">Batal</Button>
          <Button type="submit" disabled={isLoading || orderItems.length === 0 || !selectedCustomer} className="gap-2">
            <Save className="size-4" />
            {isLoading ? 'Menyimpan...' : 'Buat Pesanan'}
          </Button>
        </div>
      </div>
    </form>
  )
}
