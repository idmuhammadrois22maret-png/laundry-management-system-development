'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Trash2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  paid: boolean
  payment_method?: string
  pickup_date?: string
  notes?: string
  customer_id: string
  customers?: { name: string; phone: string }
  order_items?: any[]
}

interface OrderEditPageProps {
  order: Order
  onBack: () => void
  onSuccess: () => void
}

export function OrderEditPage({ order, onBack, onSuccess }: OrderEditPageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    status: order.status,
    payment_method: order.payment_method || 'cash',
    pickup_date: order.pickup_date ? order.pickup_date.split('T')[0] : '',
    notes: order.notes || '',
    paid: order.paid,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? !prev[name as keyof typeof formData] : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('orders')
      .update({
        status: formData.status,
        payment_method: formData.payment_method,
        pickup_date: formData.pickup_date,
        notes: formData.notes,
        paid: formData.paid,
      })
      .eq('id', order.id)

    if (error) {
      toast.error('Gagal memperbarui pesanan')
      setIsLoading(false)
      return
    }

    if (formData.paid && !order.paid) {
      await supabase
        .from('payments')
        .insert({
          order_id: order.id,
          amount: order.total_amount,
          payment_method: formData.payment_method,
          payment_status: 'completed',
        })
    }

    toast.success('Pesanan berhasil diperbarui')
    onSuccess()
  }

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
      return
    }

    setIsDeleting(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', order.id)

    if (error) {
      toast.error('Gagal menghapus pesanan')
      setIsDeleting(false)
      return
    }

    toast.success('Pesanan berhasil dihapus')
    onSuccess()
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    ready: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Pesanan</h1>
          <p className="text-muted-foreground mt-1">{order.order_number}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pesanan</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Pelanggan</p>
                    <p className="text-lg font-semibold">{order.customers?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-lg font-bold text-primary">Rp {order.total_amount.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status Pesanan</Label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="pending">Menunggu</option>
                      <option value="in_progress">Sedang Dikerjakan</option>
                      <option value="ready">Siap Diambil</option>
                      <option value="completed">Selesai</option>
                      <option value="cancelled">Dibatalkan</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment_method">Metode Pembayaran</Label>
                    <select
                      id="payment_method"
                      name="payment_method"
                      value={formData.payment_method}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="cash">Tunai</option>
                      <option value="bank_transfer">Transfer Bank</option>
                      <option value="card">Kartu Kredit</option>
                      <option value="e_wallet">E-Wallet</option>
                      <option value="qris">QRIS</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pickup_date">Tanggal Pengambilan</Label>
                    <Input
                      id="pickup_date"
                      name="pickup_date"
                      type="date"
                      value={formData.pickup_date}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2 flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer w-full p-3 border border-border rounded-md hover:bg-muted">
                      <input
                        type="checkbox"
                        checked={formData.paid}
                        onChange={handleChange}
                        name="paid"
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">Sudah Dibayar</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Informasi tambahan tentang pesanan..."
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground min-h-24 resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-6 border-t border-border">
                  <Button type="submit" disabled={isLoading} className="gap-2 flex-1">
                    <Save className="w-4 h-4" />
                    {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                  <Button type="button" onClick={onBack} variant="outline" className="flex-1">
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`px-4 py-2 rounded-full font-semibold text-center ${statusColors[formData.status] || statusColors.pending}`}>
                {formData.status.replace('_', ' ').toUpperCase()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detail Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Metode</p>
                <p className="font-semibold capitalize">{formData.payment_method.replace('_', ' ')}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Status Pembayaran</p>
                  <p className="font-semibold">
                    {formData.paid ? 'Sudah Dibayar' : 'Belum Dibayar'}
                  </p>
                </div>
                {formData.paid && <CheckCircle2 className="w-5 h-5 text-green-600" />}
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-lg text-red-900">Zona Bahaya</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                variant="destructive"
                className="w-full gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? 'Menghapus...' : 'Hapus Pesanan'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
