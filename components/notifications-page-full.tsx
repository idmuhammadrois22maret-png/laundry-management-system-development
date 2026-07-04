'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MessageCircle, CheckCircle2, AlertCircle, Send } from 'lucide-react'
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

export function NotificationsPageFull() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null)
  const [customMessage, setCustomMessage] = useState('')
  const [messageType, setMessageType] = useState('payment_reminder')

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        customers (name, phone),
        orders (order_number)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Gagal memuat notifikasi')
      return
    }

    setNotifications(data || [])
    setIsLoading(false)
  }

  const handleSendViaWhatsApp = async (notif: Notification) => {
    const message = notif.message || customMessage
    if (!message.trim()) {
      toast.error('Pesan tidak boleh kosong')
      return
    }

    const phone = notif.customers?.phone.replace(/^0/, '62')
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')

    // Mark as sent
    const supabase = createClient()
    await supabase
      .from('notifications')
      .update({ sent: true, sent_at: new Date().toISOString() })
      .eq('id', notif.id)

    toast.success('Notifikasi dikirim via WhatsApp')
    loadNotifications()
    setSelectedNotif(null)
  }

  const handleCreateNotification = async () => {
    if (!customMessage.trim() || !selectedNotif) {
      toast.error('Silakan isi semua kolom')
      return
    }

    const supabase = createClient()
    const { error } = await supabase
      .from('notifications')
      .insert({
        customer_id: selectedNotif.customer_id,
        order_id: selectedNotif.order_id,
        message: customMessage,
        notification_type: messageType,
        sent: false,
      })

    if (error) {
      toast.error('Gagal membuat notifikasi')
      return
    }

    toast.success('Notifikasi berhasil dibuat')
    setCustomMessage('')
    setSelectedNotif(null)
    loadNotifications()
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
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Notifikasi WhatsApp</h1>
        <p className="text-muted-foreground mt-2">Kirim pesan WhatsApp kepada pelanggan</p>
      </div>

      {selectedNotif ? (
        <Card>
          <CardHeader>
            <CardTitle>Komposer Pesan WhatsApp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Pelanggan</p>
                <p className="text-lg font-semibold">{selectedNotif.customers?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nomor WhatsApp</p>
                <p className="text-lg font-mono">{selectedNotif.customers?.phone}</p>
              </div>
              {selectedNotif.orders && (
                <div>
                  <p className="text-sm text-muted-foreground">No. Pesanan</p>
                  <p className="text-lg font-semibold">{selectedNotif.orders?.order_number}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message-type">Tipe Notifikasi</Label>
              <select
                id="message-type"
                value={messageType}
                onChange={(e) => setMessageType(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="payment_reminder">Pengingat Pembayaran</option>
                <option value="order_ready">Pesanan Siap</option>
                <option value="order_update">Update Pesanan</option>
                <option value="custom">Pesan Khusus</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Pesan</Label>
              <textarea
                id="message"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Ketik pesan Anda di sini..."
                className="w-full px-3 py-3 border border-border rounded-md bg-background text-foreground min-h-32 resize-none"
              />
              <p className="text-xs text-muted-foreground">{customMessage.length} karakter</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">Preview WhatsApp:</p>
              <div className="bg-white rounded border border-gray-200 p-3 text-sm max-h-32 overflow-y-auto">
                {customMessage || '(Pesan akan muncul di sini)'}
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => handleSendViaWhatsApp(selectedNotif)} className="flex-1 gap-2">
                <Send className="w-4 h-4" />
                Kirim via WhatsApp
              </Button>
              <Button onClick={() => handleCreateNotification()} variant="outline" className="flex-1">
                Simpan & Tunda
              </Button>
              <Button onClick={() => setSelectedNotif(null)} variant="ghost" className="flex-1">
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Notifikasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Pelanggan</th>
                    <th className="text-left py-3 px-4 font-semibold">Tipe</th>
                    <th className="text-left py-3 px-4 font-semibold">Pesan</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-muted-foreground">
                        Tidak ada notifikasi
                      </td>
                    </tr>
                  ) : (
                    notifications.map((notif) => (
                      <tr key={notif.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold">{notif.customers?.name}</p>
                            <p className="text-xs text-muted-foreground">{notif.customers?.phone}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            {notif.notification_type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate">{notif.message}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                            notif.sent
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {notif.sent ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                Terkirim
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3 h-3" />
                                Belum Terkirim
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {!notif.sent ? (
                            <Button
                              onClick={() => setSelectedNotif(notif)}
                              size="sm"
                              variant="outline"
                              className="gap-1"
                            >
                              <MessageCircle className="w-3 h-3" />
                              Kirim
                            </Button>
                          ) : (
                            <Button size="sm" variant="ghost" disabled>
                              Terkirim
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
