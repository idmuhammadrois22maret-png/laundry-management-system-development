'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, Trash2, CheckCircle2 } from 'lucide-react'
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
  const [isConfirmingComplete, setIsConfirmingComplete] = useState(false)
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

  const handleConfirmComplete = async () => {
    if (!confirm('Konfirmasi pesanan sudah selesai? Kami akan menyiapkan notifikasi WhatsApp.')) {
      return
    }

    setIsConfirmingComplete(true)
    const supabase = createClient()

    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'completed', updated_at: new Date().toISOString() })
      .eq('id', order.id)

    if (updateError) {
      toast.error('Gagal mengonfirmasi pesanan selesai')
      setIsConfirmingComplete(false)
      return
    }

    await supabase
      .from('notifications')
      .insert({
        order_id: order.id,
        customer_id: order.customer_id,
        message: `Pesanan Anda ${order.order_number} telah selesai! Silakan ambil pakaian Anda di toko kami. Terima kasih!`,
        notification_type: 'order_completed',
        sent: false,
      })

    toast.success('Pesanan dikonfirmasi selesai!')
    setIsConfirmingComplete(false)
    onSuccess()
  }

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) return

    setIsDeleting(true)
    const supabase = createClient()
    const { error } = await supabase.from('orders').delete().eq('id', order.id)

    if (error) {
      toast.error('Gagal menghapus pesanan')
      setIsDeleting(false)
      return
    }

    toast.success('Pesanan berhasil dihapus')
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order info overview */}
      <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted p-4">
        <div>
          <p className="text-xs text-muted-foreground">Pelanggan</p>
          <p className="font-semibold">{order.customers?.name}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="font-bold text-primary">Rp {order.total_amount.toLocaleString('id-ID')}</p>
        </div>
      </div>

      {/* Confirm complete button */}
      {formData.status !== 'completed' && formData.status !== 'cancelled' && (
        <Button
          type="button"
          onClick={handleConfirmComplete}
          disabled={isConfirmingComplete}
          className="w-full gap-2 bg-green-600 hover:bg-green-700"
        >
          <CheckCircle2 className="size-4" />
          {isConfirmingComplete ? 'Memproses...' : 'Konfirmasi Selesai'}
        </Button>
      )}

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
          >
            <option value="pending">Menunggu</option>
            <option value="in_progress">Sedang Dikerjakan</option>
            <option value="ready">Siap Diambil</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment_method">Pembayaran</Label>
          <select
            id="payment_method"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
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
          <Input id="pickup_date" name="pickup_date" type="date" value={formData.pickup_date} onChange={handleChange} />
        </div>

        <div className="space-y-2 flex items-end">
          <label className="flex items-center gap-3 cursor-pointer w-full p-3 border border-border rounded-md hover:bg-muted">
            <input type="checkbox" checked={formData.paid} onChange={handleChange} name="paid" className="size-4" />
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
          placeholder="Informasi tambahan..."
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm min-h-20 resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button type="submit" disabled={isLoading} className="flex-1 gap-2">
          <Save className="size-4" />
          {isLoading ? 'Menyimpan...' : 'Simpan'}
        </Button>
        <Button type="button" onClick={onBack} variant="outline" className="flex-1">Batal</Button>
        <Button type="button" onClick={handleDelete} disabled={isDeleting} variant="destructive" className="gap-2">
          <Trash2 className="size-4" />
        </Button>
      </div>
    </form>
  )
}
