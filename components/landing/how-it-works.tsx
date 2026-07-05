'use client'

import { motion } from 'framer-motion'
import { UserPlus, ClipboardList, Send } from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    title: 'Tambah Pelanggan',
    description: 'Simpan data pelanggan — nama, telepon, alamat, dan preferensi laundry.',
  },
  {
    icon: ClipboardList,
    title: 'Buat Pesanan Laundry',
    description: 'Pilih layanan, masukkan berat, tentukan harga, dan jadwalkan pengambilan.',
  },
  {
    icon: Send,
    title: 'Kirim Notifikasi WhatsApp',
    description: 'Beri tahu pelanggan secara otomatis saat laundry siap atau pembayaran jatuh tempo.',
  },
]

export function HowItWorks() {
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
            Cara kerja
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-[#111827] md:text-4xl"
          >
            Tiga langkah mudah
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-[#6B7280]"
          >
            Mulai dalam hitungan menit. Tanpa pengaturan rumit.
          </motion.p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15, ease: [0.25, 0.1, 0, 1] }}
                className="relative text-center"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute top-10 left-[calc(50%+2.5rem)] hidden h-px w-[calc(100%-5rem)] border-t border-dashed border-border md:block" />
                )}

                {/* Step number + icon */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-border bg-white">
                  <Icon className="h-8 w-8 text-[#111827]" />
                </div>
                <span className="mb-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#111827] text-xs font-medium text-white">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-[#111827]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{step.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
