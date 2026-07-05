'use client'

import { motion } from 'framer-motion'

export function DashboardPreview() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-3 text-sm font-medium text-[#2563EB]"
          >
            Dashboard powerful
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-[#111827] md:text-4xl"
          >
            Semua dalam satu layar
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-[#6B7280]"
          >
            Kelola pesanan, pelanggan, dan pembayaran dari satu dashboard terpusat.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0, 1] }}
          className="mt-16 overflow-hidden rounded-2xl border border-border bg-white shadow-xl shadow-gray-200/40"
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-1.5 border-b border-border px-5 py-3.5">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
            <div className="ml-4 flex-1 rounded-md bg-gray-100 px-3 py-1.5 text-xs text-[#6B7280]">
              app.laundryflow.com/dashboard
            </div>
          </div>

          {/* Full dashboard layout */}
          <div className="grid gap-5 p-6 lg:grid-cols-3">
            {/* Sidebar */}
            <div className="hidden space-y-1 lg:block">
              {['Dashboard', 'Pesanan', 'Pelanggan', 'Pembayaran', 'Laporan', 'Pengaturan'].map(
                (item, i) => (
                  <div
                    key={item}
                    className={`rounded-lg px-3 py-2 text-sm ${
                      i === 0
                        ? 'bg-gray-100 font-medium text-[#111827]'
                        : 'text-[#6B7280] hover:bg-gray-50'
                    }`}
                  >
                    {item}
                  </div>
                ),
              )}
            </div>

            {/* Main content */}
            <div className="space-y-5 lg:col-span-2">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total Pendapatan', value: 'Rp 48,2JT', change: '+12.5%' },
                  { label: 'Pesanan Bulan Ini', value: '342', change: '+8.3%' },
                  { label: 'Pelanggan Aktif', value: '128', change: '+21.7%' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border p-4">
                    <p className="text-xs text-[#6B7280]">{s.label}</p>
                    <p className="mt-1.5 text-lg font-semibold text-[#111827]">{s.value}</p>
                    <span className="text-xs text-green-600">{s.change}</span>
                  </div>
                ))}
              </div>

              {/* Chart + Orders */}
              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-xl border border-border p-4">
                  <p className="mb-4 text-sm font-medium text-[#111827]">Pendapatan (7 hari)</p>
                  <div className="flex items-end gap-2" style={{ height: 120 }}>
                    {[35, 55, 42, 78, 50, 95, 68].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: h }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.06, ease: [0.25, 0.1, 0, 1] }}
                        className="flex-1 rounded-t-md bg-[#2563EB]"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border p-4">
                  <p className="mb-4 text-sm font-medium text-[#111827]">Pesanan Terbaru</p>
                  <div className="space-y-3">
                    {[
                      { name: 'Cuci Lipat', customer: 'Ani', status: 'Siap' },
                      { name: 'Dry Clean', customer: 'Bambang', status: 'Diproses' },
                      { name: 'Setrika', customer: 'Sari', status: 'Tertunda' },
                      { name: 'Cuci Lipat', customer: 'Dewi', status: 'Selesai' },
                    ].map((o) => (
                      <div
                        key={o.customer}
                        className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-[#111827]">{o.name}</p>
                          <p className="text-xs text-[#6B7280]">{o.customer}</p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            o.status === 'Siap' || o.status === 'Selesai'
                              ? 'bg-green-50 text-green-700'
                              : o.status === 'Diproses'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-yellow-50 text-yellow-700'
                          }`}
                        >
                          {o.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Customer table */}
              <div className="rounded-xl border border-border">
                <div className="border-b border-border px-4 py-3">
                  <p className="text-sm font-medium text-[#111827]">Daftar Pelanggan</p>
                </div>
                <div className="grid grid-cols-4 gap-2 border-b border-border px-4 py-2 text-xs font-medium text-[#6B7280]">
                  <span>Nama</span>
                  <span>Telepon</span>
                  <span>Pesanan</span>
                  <span className="text-right">Total</span>
                </div>
                {[
                  { name: 'Ayu Lestari', phone: '0812-3456-7890', orders: 12, spent: 'Rp540rb' },
                  { name: 'Budi Santoso', phone: '0856-7890-1234', orders: 8, spent: 'Rp320rb' },
                  { name: 'Citra Dewi', phone: '0878-9012-3456', orders: 15, spent: 'Rp780rb' },
                ].map((c) => (
                  <div
                    key={c.name}
                    className="grid grid-cols-4 gap-2 border-b border-border px-4 py-2.5 text-sm last:border-0"
                  >
                    <span className="font-medium text-[#111827]">{c.name}</span>
                    <span className="text-[#6B7280]">{c.phone}</span>
                    <span className="text-[#6B7280]">{c.orders}</span>
                    <span className="text-right font-medium text-[#111827]">{c.spent}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
