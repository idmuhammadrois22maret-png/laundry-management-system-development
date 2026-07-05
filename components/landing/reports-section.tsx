'use client'

import { motion } from 'framer-motion'

const data = {
  revenue: [42, 58, 45, 78, 52, 95, 68, 88, 62, 105, 72, 98],
  customers: [24, 32, 28, 45, 38, 52, 48, 62, 55, 70, 65, 78],
}

export function ReportsSection() {
  return (
    <section className="border-y border-border px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-3 text-sm font-medium text-[#2563EB]"
          >
            Analitik
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-[#111827] md:text-4xl"
          >
            Kenali angka bisnis Anda
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-[#6B7280]"
          >
            Pantau pendapatan, pesanan, dan pertumbuhan pelanggan dengan grafik yang indah.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid gap-5 md:grid-cols-2"
        >
          {/* Revenue chart */}
          <div className="rounded-xl border border-border p-6">
            <div className="mb-6">
              <p className="text-sm font-medium text-[#111827]">Pendapatan</p>
              <p className="text-2xl font-bold tracking-tight text-[#111827]">Rp 798,5RB</p>
              <span className="text-xs text-green-600">+18,2% vs bulan lalu</span>
            </div>
            <div className="flex items-end gap-1.5" style={{ height: 140 }}>
              {data.revenue.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${v}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.03, ease: [0.25, 0.1, 0, 1] }}
                  className="flex-1 rounded-t-sm bg-[#2563EB]"
                  style={{ height: `${v}%` }}
                />
              ))}
            </div>
          </div>

          {/* Customer growth */}
          <div className="rounded-xl border border-border p-6">
            <div className="mb-6">
              <p className="text-sm font-medium text-[#111827]">Pelanggan</p>
              <p className="text-2xl font-bold tracking-tight text-[#111827]">653</p>
              <span className="text-xs text-green-600">+12,4% vs bulan lalu</span>
            </div>
            <div className="flex items-end gap-1.5" style={{ height: 140 }}>
              {data.customers.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${v}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.03, ease: [0.25, 0.1, 0, 1] }}
                  className="flex-1 rounded-t-sm bg-[#10B981]"
                  style={{ height: `${v}%` }}
                />
              ))}
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Pesanan', value: '2.847', change: '+15,3%', color: 'text-[#2563EB]' },
              { label: 'Rata-rata Pesanan', value: 'Rp 32,5RB', change: '+5,7%', color: 'text-[#10B981]' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border p-5">
                <p className="text-xs text-[#6B7280]">{s.label}</p>
                <p className="mt-2 text-xl font-bold text-[#111827]">{s.value}</p>
                <span className={`text-xs ${s.color}`}>{s.change}</span>
              </div>
            ))}
            {[
              { label: 'Tingkat Selesai', value: '96,8%', change: '+2,1%', color: 'text-[#2563EB]' },
              { label: 'Pelanggan Setia', value: '78,4%', change: '+4,3%', color: 'text-[#10B981]' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border p-5">
                <p className="text-xs text-[#6B7280]">{s.label}</p>
                <p className="mt-2 text-xl font-bold text-[#111827]">{s.value}</p>
                <span className={`text-xs ${s.color}`}>{s.change}</span>
              </div>
            ))}
          </div>

          {/* Payment stats */}
          <div className="rounded-xl border border-border p-6">
            <p className="mb-4 text-sm font-medium text-[#111827]">Metode Pembayaran</p>
            <div className="space-y-4">
              {[
                { label: 'Tunai', pct: 45, color: 'bg-[#2563EB]' },
                { label: 'Transfer', pct: 35, color: 'bg-[#10B981]' },
                { label: 'QRIS', pct: 15, color: 'bg-[#F59E0B]' },
                { label: 'Lainnya', pct: 5, color: 'bg-[#6B7280]' },
              ].map((m) => (
                <div key={m.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-[#111827]">{m.label}</span>
                    <span className="text-[#6B7280]">{m.pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${m.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0, 1] }}
                      className={`h-full rounded-full ${m.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
