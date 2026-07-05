'use client'

import { motion } from 'framer-motion'
import {
  Users, ShoppingBag, CreditCard, MessageSquare, BarChart3, FileText,
} from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Manajemen Pelanggan',
    description: 'Simpan data pelanggan, preferensi laundry, dan riwayat transaksi di satu tempat.',
  },
  {
    icon: ShoppingBag,
    title: 'Pesanan Laundry',
    description: 'Buat dan lacak pesanan dengan berat, jenis layanan, dan status terkini.',
  },
  {
    icon: CreditCard,
    title: 'Pembayaran',
    description: 'Catat pembayaran, pantau saldo tertunda, dan buat kwitansi instan.',
  },
  {
    icon: MessageSquare,
    title: 'Notifikasi WhatsApp',
    description: 'Kirim otomatis konfirmasi pesanan dan pengingat pengambilan via WhatsApp.',
  },
  {
    icon: BarChart3,
    title: 'Laporan & Analitik',
    description: 'Visualisasikan pendapatan, pertumbuhan pelanggan, dan kinerja bisnis.',
  },
  {
    icon: FileText,
    title: 'Invoice PDF',
    description: 'Buat invoice PDF profesional dengan merek bisnis Anda.',
  },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0, 1] },
  },
}

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
            className="mb-3 text-sm font-medium text-[#2563EB]"
          >
            Semua yang Anda butuhkan
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0, 1] }}
            className="text-3xl font-bold tracking-tight text-[#111827] md:text-4xl"
          >
            Manajemen laundry all-in-one
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0, 1] }}
            className="mt-4 text-lg text-[#6B7280]"
          >
            Dari pembuatan pesanan hingga laporan — semua yang Anda butuhkan untuk menjalankan bisnis laundry dengan lancar.
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={item}
                className="bg-white p-8 transition-colors hover:bg-gray-50/50"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white">
                  <Icon className="h-5 w-5 text-[#111827]" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-[#111827]">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-[#6B7280]">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
