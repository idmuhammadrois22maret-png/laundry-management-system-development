'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QRCodeSVG } from 'qrcode.react'
import { MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react'
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

export function PaymentsPageFull() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        orders (
          order_number,
          customers (name, phone)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to load payments')
      return
    }

    setPayments(data || [])
    setIsLoading(false)
  }

  const handleSendViaWhatsApp = async (payment: Payment) => {
    const message = `Pembayaran untuk order ${payment.orders?.order_number} sebesar Rp ${(payment.amount).toLocaleString('id-ID')} telah dikirim. Silakan lakukan pembayaran.`
    const phone = payment.orders?.customers?.phone.replace(/^0/, '62')
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    toast.success('Membuka WhatsApp...')
  }

  const handleMarkAsPaid = async (paymentId: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('payments')
      .update({ payment_status: 'completed' })
      .eq('id', paymentId)

    if (error) {
      toast.error('Gagal mengupdate pembayaran')
      return
    }

    toast.success('Pembayaran berhasil diperbarui')
    loadPayments()
    setSelectedPayment(null)
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
        <h1 className="text-4xl font-bold text-foreground">Manajemen Pembayaran</h1>
        <p className="text-muted-foreground mt-2">Kelola pembayaran pesanan dan kirim notifikasi</p>
      </div>

      {selectedPayment ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Detail Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">No. Pesanan</p>
                    <p className="text-lg font-semibold">{selectedPayment.orders?.order_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pelanggan</p>
                    <p className="text-lg font-semibold">{selectedPayment.orders?.customers?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Jumlah</p>
                    <p className="text-2xl font-bold text-primary">Rp {selectedPayment.amount.toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Metode Pembayaran</p>
                    <p className="text-lg font-semibold capitalize">{selectedPayment.payment_method}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="mt-2 flex items-center gap-2">
                      {selectedPayment.payment_status === 'completed' ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="text-lg font-semibold text-green-600">Sudah Dibayar</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                          <span className="text-lg font-semibold text-yellow-600">Menunggu Pembayaran</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  {selectedPayment.payment_status !== 'completed' && (
                    <>
                      <Button onClick={() => handleSendViaWhatsApp(selectedPayment)} className="flex-1 gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Kirim via WhatsApp
                      </Button>
                      <Button onClick={() => handleMarkAsPaid(selectedPayment.id)} variant="outline" className="flex-1">
                        Tandai Sebagai Dibayar
                      </Button>
                    </>
                  )}
                  <Button onClick={() => setSelectedPayment(null)} variant="ghost" className="flex-1">
                    Kembali
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Kode QR Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <QRCodeSVG
                  value={`ORDER:${selectedPayment.orders?.order_number}|AMOUNT:${selectedPayment.amount}`}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
                <p className="text-xs text-muted-foreground mt-4 text-center">Bagikan kode QR ini kepada pelanggan</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">No. Pesanan</th>
                    <th className="text-left py-3 px-4 font-semibold">Pelanggan</th>
                    <th className="text-left py-3 px-4 font-semibold">Jumlah</th>
                    <th className="text-left py-3 px-4 font-semibold">Metode</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-muted-foreground">
                        Tidak ada pembayaran
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 font-mono text-xs">{payment.orders?.order_number}</td>
                        <td className="py-3 px-4">{payment.orders?.customers?.name}</td>
                        <td className="py-3 px-4 font-semibold">Rp {payment.amount.toLocaleString('id-ID')}</td>
                        <td className="py-3 px-4 capitalize text-xs">{payment.payment_method}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                            payment.payment_status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.payment_status === 'completed' ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                Dibayar
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3 h-3" />
                                Menunggu
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            onClick={() => setSelectedPayment(payment)}
                            size="sm"
                            variant="outline"
                          >
                            Lihat Detail
                          </Button>
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
