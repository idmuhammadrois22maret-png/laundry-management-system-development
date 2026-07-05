'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { DataTable, type Column } from '@/components/data-table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { QRCodeSVG } from 'qrcode.react'
import {
  MessageCircle, CheckCircle2, AlertCircle, DollarSign, CreditCard, TrendingUp, Clock,
} from 'lucide-react'
import { toast } from 'sonner'

interface Payment {
  id: string
  order_id: string
  amount: number
  payment_method: string
  payment_status: string
  orders?: {
    order_number: string
    customers?: { name: string; phone: string }
  }
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

export function PaymentsPageFull() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  useEffect(() => { loadPayments() }, [])

  const loadPayments = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('payments')
      .select('*, orders(order_number, customers(name, phone))')
      .order('created_at', { ascending: false })
    if (error) { toast.error('Gagal memuat pembayaran'); return }
    setPayments(data || [])
    setIsLoading(false)
  }

  const handleMarkAsPaid = async (paymentId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('payments').update({ payment_status: 'completed' }).eq('id', paymentId)
    if (error) { toast.error('Gagal mengupdate'); return }
    toast.success('Pembayaran diperbarui')
    loadPayments()
    setDetailOpen(false)
    setSelectedPayment(null)
  }

  const handleSendViaWhatsApp = (payment: Payment) => {
    const msg = `Pembayaran untuk ${payment.orders?.order_number} sebesar Rp ${payment.amount.toLocaleString('id-ID')} telah dikirim. Silakan lakukan pembayaran.`
    const phone = payment.orders?.customers?.phone.replace(/^0/, '62')
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
    toast.success('Membuka WhatsApp...')
  }

  const paymentColumns: Column<Payment>[] = [
    {
      key: 'order',
      label: 'Pesanan',
      render: (p) => <span className="font-mono text-xs text-muted-foreground">{p.orders?.order_number}</span>,
    },
    {
      key: 'customer',
      label: 'Pelanggan',
      render: (p) => <span>{p.orders?.customers?.name || 'N/A'}</span>,
    },
    {
      key: 'amount',
      label: 'Jumlah',
      align: 'right',
      render: (p) => <span className="font-medium">Rp {p.amount.toLocaleString('id-ID')}</span>,
    },
    {
      key: 'method',
      label: 'Metode',
      render: (p) => <span className="capitalize text-xs text-muted-foreground">{p.payment_method}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (p) => (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${
          p.payment_status === 'completed' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-amber-50 text-amber-700 ring-amber-600/20'
        }`}>
          {p.payment_status === 'completed' ? <CheckCircle2 className="size-3" /> : <AlertCircle className="size-3" />}
          {p.payment_status === 'completed' ? 'Lunas' : 'Menunggu'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Aksi',
      align: 'right',
      render: (p) => (
        <Button size="sm" variant="outline" onClick={() => { setSelectedPayment(p); setDetailOpen(true) }}>
          Detail
        </Button>
      ),
    },
  ]

  const completed = payments.filter(p => p.payment_status === 'completed').length
  const totalAmount = payments.reduce((s, p) => s + p.amount, 0)
  const pendingAmount = payments.filter(p => p.payment_status !== 'completed').reduce((s, p) => s + p.amount, 0)

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pembayaran</h1>
        <p className="text-sm text-muted-foreground mt-1">Kelola pembayaran dan kirim notifikasi</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Pembayaran" value={payments.length.toString()} icon={DollarSign} bg="bg-lime-50" color="text-lime-600" growth="All time" growthColor="text-muted-foreground" />
        <StatsCard title="Lunas" value={completed.toString()} icon={CheckCircle2} bg="bg-emerald-50" color="text-emerald-600" growth={`${payments.length > 0 ? ((completed / payments.length) * 100).toFixed(0) : 0}% rate`} growthColor="text-green-600" />
        <StatsCard title="Total Nominal" value={`Rp ${(totalAmount / 1000).toFixed(0)}K`} icon={CreditCard} bg="bg-cyan-50" color="text-cyan-600" />
        <StatsCard title="Belum Dibayar" value={`Rp ${(pendingAmount / 1000).toFixed(0)}K`} icon={Clock} bg="bg-rose-50" color="text-rose-600" />
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={(o) => { setDetailOpen(o); if (!o) setSelectedPayment(null) }}>
        {selectedPayment && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detail Pembayaran</DialogTitle>
              <DialogDescription>{selectedPayment.orders?.order_number}</DialogDescription>
            </DialogHeader>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Pesanan</p>
                  <p className="font-semibold">{selectedPayment.orders?.order_number}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pelanggan</p>
                  <p className="font-semibold">{selectedPayment.orders?.customers?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Jumlah</p>
                  <p className="text-xl font-bold">Rp {selectedPayment.amount.toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Metode</p>
                  <p className="font-semibold capitalize">{selectedPayment.payment_method}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                {selectedPayment.payment_status === 'completed'
                  ? <><CheckCircle2 className="size-5 text-green-600" /><span className="font-semibold text-green-600">Lunas</span></>
                  : <><AlertCircle className="size-5 text-amber-600" /><span className="font-semibold text-amber-600">Menunggu</span></>
                }
              </div>

              {selectedPayment.payment_status !== 'completed' && (
                <div className="flex gap-3">
                  <Button onClick={() => handleSendViaWhatsApp(selectedPayment)} variant="outline" className="flex-1 gap-2">
                    <MessageCircle className="size-4" />
                    WhatsApp
                  </Button>
                  <Button onClick={() => handleMarkAsPaid(selectedPayment.id)} className="flex-1">Tandai Lunas</Button>
                </div>
              )}

              <div className="flex justify-center">
                <QRCodeSVG value={`ORDER:${selectedPayment.orders?.order_number}|AMOUNT:${selectedPayment.amount}`} size={160} level="H" includeMargin />
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Table */}
      <DataTable
        title="Riwayat Pembayaran"
        columns={paymentColumns}
        data={payments}
        emptyMessage="Belum ada pembayaran"
      />
    </div>
  )
}
