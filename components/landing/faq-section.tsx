'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'Bagaimana cara kerja LaundryFlow?',
    answer:
      'LaundryFlow adalah sistem manajemen laundry berbasis web. Cukup buat akun, tambahkan pelanggan, buat pesanan laundry, dan kelola semuanya dari satu dashboard. Anda bisa kirim notifikasi WhatsApp, lacak pembayaran, dan buat laporan — tanpa perlu instal software.',
  },
  {
    question: 'Apakah integrasi WhatsApp sudah termasuk?',
    answer:
      'Ya! Notifikasi WhatsApp sudah termasuk di semua paket. Pelanggan Anda akan menerima konfirmasi pesanan otomatis, pemberitahuan siap ambil, dan pengingat pembayaran. Tanpa setup tambahan atau API key — langsung bisa digunakan.',
  },
  {
    question: 'Bisa cetak invoice?',
    answer:
      'Tentu. LaundryFlow membuat invoice PDF profesional dengan nama dan logo bisnis Anda. Bisa dicetak langsung atau dibagikan secara digital ke pelanggan via WhatsApp atau email.',
  },
  {
    question: 'Apakah ada trial gratis?',
    answer:
      'Ya, kami menawarkan trial gratis 14 hari dengan akses penuh ke semua fitur. Tanpa perlu kartu kredit. Anda bisa menjelajahi semua fitur, tambah hingga 10 pelanggan, dan buat pesanan tak terbatas selama masa trial.',
  },
  {
    question: 'Bisa ekspor data?',
    answer:
      'Ya. Anda bisa mengekspor semua data — pelanggan, pesanan, pembayaran, dan laporan — ke CSV atau PDF kapan saja. Tanpa lock-in atau biaya tersembunyi.',
  },
  {
    question: 'Apakah ada dukungan telepon?',
    answer:
      'Semua paket termasuk dukungan email. Paket Business dan Enterprise termasuk dukungan prioritas dengan respons lebih cepat. Pelanggan Enterprise juga mendapat account manager dedicated.',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-3 text-sm font-medium text-[#2563EB]"
          >
            FAQ
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-[#111827] md:text-4xl"
          >
            Pertanyaan umum
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-[#6B7280]"
          >
            Semua yang perlu Anda ketahui tentang LaundryFlow.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 space-y-2"
        >
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-border transition-colors hover:border-[#111827]/20"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-sm font-medium text-[#111827]">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-[#6B7280] transition-transform duration-200',
                    openIndex === i && 'rotate-180',
                  )}
                />
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-200',
                  openIndex === i ? 'max-h-96 pb-5' : 'max-h-0',
                )}
              >
                <p className="px-6 text-sm leading-relaxed text-[#6B7280]">{faq.answer}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
