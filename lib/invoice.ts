'use client'

interface OrderInvoice {
  order_number: string
  total_amount: number
  paid: boolean
  status: string
  pickup_date?: string
  created_at: string
  customers?: { name: string; phone: string }
}

function formatDateShort(dateStr: string | undefined): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function openInvoiceWindow(order: OrderInvoice): Window | null {
  const win = window.open('', '_blank')
  if (!win) return null

  const customerName = order.customers?.name || 'N/A'
  const customerPhone = order.customers?.phone || ''
  const date = formatDateShort(order.created_at)
  const pickup = formatDateShort(order.pickup_date)

  win.document.write(`<html><head>
    <title>Invoice ${order.order_number}</title>
    <style>
      body { font-family: 'Courier New', monospace; padding: 40px; max-width: 500px; margin: auto; color: #222; }
      .header { text-align: center; border-bottom: 2px dashed #222; padding-bottom: 16px; margin-bottom: 16px; }
      .header h1 { font-size: 22px; margin: 0; letter-spacing: 4px; }
      .header p { font-size: 11px; color: #555; margin: 4px 0 0; }
      .info { font-size: 12px; margin-bottom: 16px; }
      .info div { display: flex; justify-content: space-between; padding: 2px 0; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; }
      th, td { padding: 6px 8px; text-align: left; }
      th { border-bottom: 1px solid #222; font-size: 11px; text-transform: uppercase; }
      td { border-bottom: 1px solid #ddd; }
      .total-row td { border-bottom: none; font-weight: bold; font-size: 14px; padding-top: 8px; }
      .amount { text-align: right; }
      .footer { text-align: center; font-size: 10px; color: #888; margin-top: 24px; border-top: 1px dashed #ccc; padding-top: 12px; }
      .paid-stamp { text-align: center; margin: 16px 0; }
      .paid-stamp span { border: 2px solid #22c55e; color: #22c55e; padding: 4px 20px; font-weight: bold; font-size: 16px; letter-spacing: 3px; }
      @media print { body { padding: 20px; } }
    </style>
  </head><body>
    <div class="header"><h1>LAUNDRIO</h1><p>Invoice #${order.order_number}</p></div>
    <div class="info">
      <div><span>Pelanggan</span><span>${customerName}</span></div>
      <div><span>Telepon</span><span>${customerPhone}</span></div>
      <div><span>Tanggal</span><span>${date}</span></div>
      <div><span>Estimasi Siap</span><span>${pickup}</span></div>
      <div><span>Status</span><span>${order.status.replace('_', ' ').toUpperCase()}</span></div>
    </div>
    <table><tr><th>Layanan</th><th class="amount">Jumlah</th></tr>
      <tr><td>Laundry Service</td><td class="amount">Rp ${order.total_amount.toLocaleString('id-ID')}</td></tr>
    </table>
    <table><tr class="total-row"><td>TOTAL</td><td class="amount">Rp ${order.total_amount.toLocaleString('id-ID')}</td></tr></table>
    ${order.paid ? '<div class="paid-stamp"><span>LUNAS</span></div>' : ''}
    <div class="footer">Terima kasih telah menggunakan Laundrio<br>www.laundrio.app</div>
    <script>window.onload=function(){setTimeout(function(){window.print()},500)}<\/script>
  </body></html>`)
  win.document.close()
  return win
}

export function getWhatsAppUrl(order: OrderInvoice): string | null {
  const phone = order.customers?.phone || ''
  if (!phone) return null

  const cleanPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone
  const pickupText = order.pickup_date
    ? `\nEstimasi siap: ${new Date(order.pickup_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}`
    : ''
  const statusText = order.status === 'completed' ? '✅ Selesai' : order.status.replace('_', ' ').toUpperCase()

  const message = `🧺 *Laundrio - Invoice*\n\nNo: ${order.order_number}\nPelanggan: ${order.customers?.name || 'N/A'}\nTotal: Rp ${order.total_amount.toLocaleString('id-ID')}\nStatus: ${statusText}\nPembayaran: ${order.paid ? '✅ Lunas' : '⏳ Belum'}${pickupText}\n\nTerima kasih!`

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}
