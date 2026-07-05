'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { DataTable, type Column } from '@/components/data-table'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { MessageCircle, CheckCircle2, AlertCircle, Send, Bell, Smartphone, Ban } from 'lucide-react'
import { toast } from 'sonner'

interface Notification {
  id: string
  order_id: string
  customer_id: string
  message: string
  notification_type: string
  sent: boolean
  sent_at?: string
  customers?: { name: string; phone: string }
  orders?: { order_number: string }
}

function StatsCard({ title, value, icon: Icon, bg, color }: {
  title: string; value: string; icon: React.ElementType; bg: string; color: string
}) {
  return (
    <div className="rounded-[24px] bg-muted/30 p-3 transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5">
          <p className="text-sm font-medium py-2 text-foreground">{title}</p>
      <div className="flex items-start justify-between rounded-xl bg-card p-5">
        <div className="space-y-1">
          <p className="text-5xl font-bold tracking-tight text-foreground">{value}</p>
        </div>
        <div className={`flex size-[60px] shrink-0 items-center justify-center rounded-xl ${bg}`}>
          <Icon className={`size-6 ${color}`} />
        </div>
      </div>
    </div>
  )
}

export function NotificationsPageFull() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null)
  const [composeOpen, setComposeOpen] = useState(false)
  const [customMessage, setCustomMessage] = useState('')
  const [messageType, setMessageType] = useState('payment_reminder')

  useEffect(() => { loadNotifications() }, [])

  const loadNotifications = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('notifications')
      .select('*, customers(name, phone), orders(order_number)')
      .order('created_at', { ascending: false })
    if (error) { toast.error('Gagal memuat notifikasi'); return }
    setNotifications(data || [])
    setIsLoading(false)
  }

  const handleSendViaWhatsApp = async (notif: Notification) => {
    const message = customMessage || notif.message
    if (!message.trim()) { toast.error('Pesan tidak boleh kosong'); return }
    const phone = notif.customers?.phone.replace(/^0/, '62')
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
    const supabase = createClient()
    await supabase.from('notifications').update({ sent: true, sent_at: new Date().toISOString() }).eq('id', notif.id)
    toast.success('Notifikasi dikirim')
    loadNotifications()
    setComposeOpen(false)
    setSelectedNotif(null)
  }

  const notificationColumns: Column<Notification>[] = [
    {
      key: 'customer',
      label: 'Pelanggan',
      render: (n) => (
        <div>
          <p className="font-medium">{n.customers?.name}</p>
          <p className="text-xs text-muted-foreground">{n.customers?.phone}</p>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Tipe',
      render: (n) => (
        <span className="inline-flex rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 px-2.5 py-0.5 text-xs font-medium">
          {n.notification_type.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'message',
      label: 'Pesan',
      render: (n) => <span className="max-w-xs truncate text-muted-foreground block">{n.message}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (n) => (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${
          n.sent ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-amber-50 text-amber-700 ring-amber-600/20'
        }`}>
          {n.sent ? <CheckCircle2 className="size-3" /> : <Ban className="size-3" />}
          {n.sent ? 'Terkirim' : 'Belum'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Aksi',
      align: 'right',
      render: (n) => !n.sent ? (
        <Button size="sm" variant="outline" className="gap-1"
          onClick={() => { setSelectedNotif(n); setCustomMessage(n.message); setComposeOpen(true) }}>
          <MessageCircle className="size-3.5" /> Kirim
        </Button>
      ) : (
        <span className="text-xs text-muted-foreground">
          {n.sent_at ? new Date(n.sent_at).toLocaleDateString('id-ID') : ''}
        </span>
      ),
    },
  ]

  const sent = notifications.filter(n => n.sent).length
  const pending = notifications.filter(n => !n.sent).length

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
        <h1 className="text-2xl font-bold tracking-tight">Notifikasi</h1>
        <p className="text-sm text-muted-foreground mt-1">Kirim notifikasi WhatsApp ke pelanggan</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Notifikasi" value={notifications.length.toString()} icon={Bell} bg="bg-blue-50" color="text-blue-600" />
        <StatsCard title="Terkirim" value={sent.toString()} icon={CheckCircle2} bg="bg-emerald-50" color="text-emerald-600" />
        <StatsCard title="Menunggu" value={pending.toString()} icon={AlertCircle} bg="bg-amber-50" color="text-amber-600" />
        <StatsCard title="Pelanggan Dihubungi" value={new Set(notifications.map(n => n.customer_id)).size.toString()} icon={Smartphone} bg="bg-purple-50" color="text-purple-600" />
      </div>

      {/* Compose Dialog */}
      <Dialog open={composeOpen} onOpenChange={(o) => { setComposeOpen(o); if (!o) setSelectedNotif(null) }}>
        {selectedNotif && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Kirim Pesan WhatsApp</DialogTitle>
              <DialogDescription>{selectedNotif.customers?.name} — {selectedNotif.customers?.phone}</DialogDescription>
            </DialogHeader>
            <div className="space-y-5">
              <div className="rounded-lg bg-blue-50 border border-blue-100 p-4 space-y-2 text-sm">
                <p><span className="text-muted-foreground">Pesanan:</span> {selectedNotif.orders?.order_number}</p>
                <p><span className="text-muted-foreground">Tipe:</span> {selectedNotif.notification_type.replace(/_/g, ' ')}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="msg-type">Tipe Notifikasi</Label>
                <select id="msg-type" value={messageType} onChange={e => setMessageType(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm">
                  <option value="payment_reminder">Pengingat Pembayaran</option>
                  <option value="order_ready">Pesanan Siap</option>
                  <option value="order_update">Update Pesanan</option>
                  <option value="custom">Pesan Khusus</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="msg">Pesan</Label>
                <textarea id="msg" value={customMessage} onChange={e => setCustomMessage(e.target.value)}
                  placeholder="Ketik pesan..."
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm min-h-28 resize-none" />
              </div>

              <div className="flex gap-3">
                <Button onClick={() => handleSendViaWhatsApp(selectedNotif)} className="flex-1 gap-2">
                  <Send className="size-4" /> Kirim WhatsApp
                </Button>
                <Button variant="outline" onClick={() => setComposeOpen(false)}>Batal</Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Table */}
      <DataTable
        title="Riwayat Notifikasi"
        columns={notificationColumns}
        data={notifications}
        emptyMessage="Belum ada notifikasi"
      />
    </div>
  )
}
