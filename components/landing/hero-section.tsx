'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.1, 0, 1] },
  }),
}

function StatBadge({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0, 1] }}
      className="absolute rounded-xl border border-border bg-white px-4 py-3 shadow-sm"
    >
      <p className="text-xs text-[#6B7280]">{label}</p>
      <p className="text-lg font-semibold tracking-tight text-[#111827]">{value}</p>
    </motion.div>
  )
}

export function HeroSection() {
  const router = useRouter()
  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-gray-50 px-4 py-1.5 text-sm text-[#6B7280]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
              Dipercaya 500+ bisnis laundry
            </motion.div>

            <motion.h1
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-4xl font-bold leading-[1.1] tracking-tight text-[#111827] md:text-5xl lg:text-6xl"
            >
              Kelola Bisnis Laundry{' '}
              <span className="text-[#2563EB]">Lebih Cepat.</span>
            </motion.h1>

            <motion.p
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-5 text-lg leading-relaxed text-[#6B7280]"
            >
              Manajemen pelanggan, pembayaran, notifikasi WhatsApp, dan laporan keuangan — semua dalam satu platform modern.
            </motion.p>

            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Button size="lg" className="h-11 gap-2 bg-[#111827] px-6 text-white hover:bg-[#111827]/90" onClick={() => router.push('/auth/login')}>
                Coba Gratis
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-11 gap-2 border-border px-6 text-[#111827]"
                onClick={() => router.push('/auth/login')}
              >
                <Play className="h-4 w-4" />
                Demo Langsung
              </Button>
            </motion.div>

            {/* Trusted by strip */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-12 flex items-center gap-6 text-sm text-[#9CA3AF]"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-gray-200 to-gray-300"
                  />
                ))}
              </div>
              <span>
                <strong className="text-[#111827]">500+</strong> bisnis sudah bergabung
              </span>
            </motion.div>
          </div>

          {/* Right — Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0, 1] }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-xl shadow-gray-200/50">
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <div className="ml-4 flex-1 rounded-md bg-gray-100 px-3 py-1.5 text-xs text-[#6B7280]">
                  app.laundryflow.com
                </div>
              </div>

              {/* Dashboard content */}
              <div className="space-y-4 p-5">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Pendapatan', value: 'Rp 12.5JT', up: '+12.3%' },
                    { label: 'Pesanan', value: '156', up: '+8.1%' },
                    { label: 'Pelanggan', value: '89', up: '+15.2%' },
                  ].map((stat) => (
                    <div key={stat.label} className=" rounded-lg border border-border bg-white p-3">
                      <p className="text-xs text-[#6B7280]">{stat.label}</p>
                      <p className="mt-1 text-sm font-semibold text-[#111827]">{stat.value}</p>
                      <span className="text-[10px] text-green-600">{stat.up}</span>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="rounded-lg border border-border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-medium text-[#111827]">Grafik Pendapatan</p>
                    <span className="text-[10px] text-[#6B7280]">7 hari terakhir</span>
                  </div>
                  <div className="flex items-end gap-2" style={{ height: 64 }}>
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: h }}
                        transition={{ duration: 0.5, delay: 0.6 + i * 0.08, ease: [0.25, 0.1, 0, 1] }}
                        className="flex-1 rounded-t-md bg-[#2563EB]/80"
                      />
                    ))}
                  </div>
                </div>

                {/* Orders table */}
                <div className="rounded-lg border border-border">
                  <div className="grid grid-cols-4 gap-2 border-b border-border px-3 py-2 text-[10px] font-medium text-[#6B7280]">
                    <span>Pelanggan</span>
                    <span>Layanan</span>
                    <span>Status</span>
                    <span className="text-right">Total</span>
                  </div>
                  {[
                    { name: 'Ayu Lestari', service: 'Cuci Lipat', status: 'Siap', amount: 'Rp45rb' },
                    { name: 'Budi Santoso', service: 'Dry Clean', status: 'Diproses', amount: 'Rp85rb' },
                    { name: 'Citra Dewi', service: 'Setrika', status: 'Tertunda', amount: 'Rp25rb' },
                  ].map((row, i) => (
                    <motion.div
                      key={row.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
                      className="grid grid-cols-4 gap-2 border-b border-border px-3 py-2 text-[11px] last:border-0"
                    >
                      <span className="font-medium text-[#111827]">{row.name}</span>
                      <span className="text-[#6B7280]">{row.service}</span>
                      <span
                        className={`font-medium ${
                          row.status === 'Siap'
                            ? 'text-green-600'
                            : row.status === 'Diproses'
                              ? 'text-blue-600'
                              : 'text-yellow-600'
                        }`}
                      >
                        {row.status}
                      </span>
                      <span className="text-right font-medium text-[#111827]">{row.amount}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -left-12 top-12 hidden lg:block">
              <StatBadge label="Pendapatan Hari Ini" value="Rp 2,4JT" delay={0.9} />
            </div>
            <div className="absolute -bottom-4 -right-8 hidden lg:block">
              <StatBadge label="Tingkat Selesai" value="98.5%" delay={1.1} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
