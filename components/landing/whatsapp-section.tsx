'use client'

import { motion } from 'framer-motion'
import { CheckCircle, BellRing } from 'lucide-react'

const messages = [
  {
    from: 'Anda',
    text: 'Halo Ayu! Laundry Anda (Cuci Lipat - 3kg) sudah siap diambil. Total: Rp45.000.',
    time: '10:32',
    sent: true,
  },
  {
    from: 'Pelanggan',
    text: 'Terima kasih! Saya akan ambil sore ini.',
    time: '10:35',
    sent: false,
  },
  {
    from: 'Anda',
    text: 'Baik, sampai ketemu! 🙏',
    time: '10:36',
    sent: true,
  },
]

export function WhatsAppSection() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left text */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-3 text-sm font-medium text-[#2563EB]"
            >
              Integrasi WhatsApp
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl font-bold tracking-tight text-[#111827] md:text-4xl"
            >
              Notifikasi pelanggan via{' '}
              <span className="text-[#25D366]">WhatsApp</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-lg leading-relaxed text-[#6B7280]"
            >
              Kirim otomatis konfirmasi pesanan, pemberitahuan siap ambil, dan pengingat pembayaran
              langsung ke WhatsApp pelanggan. Tanpa aplikasi tambahan.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 space-y-3"
            >
              {[
                'Konfirmasi pesanan otomatis',
                'Notifikasi siap diambil',
                'Pengingat pembayaran & kwitansi',
                'Template pesan kustom',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-[#6B7280]">
                  <CheckCircle className="h-4 w-4 text-[#25D366]" />
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Right — WhatsApp mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0, 1] }}
            className="mx-auto w-full max-w-sm"
          >
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-lg shadow-gray-200/40">
              {/* Header */}
              <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3 text-white">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-xs font-bold">
                  A
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Ayu Lestari</p>
                  <p className="text-[10px] opacity-80">online</p>
                </div>
                <BellRing className="h-4 w-4 opacity-80" />
              </div>

              {/* Messages */}
              <div className="space-y-2.5 bg-[#ECE5DD] p-4">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.7 + i * 0.15 }}
                    className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                        msg.sent
                          ? 'rounded-tr-sm bg-[#DCF8C6] text-[#111827]'
                          : 'rounded-tl-sm bg-white text-[#111827]'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className="mt-1 text-right text-[10px] text-[#6B7280]">{msg.time}</p>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="flex justify-start"
                >
                  <div className="rounded-lg rounded-tl-sm bg-white px-4 py-2.5 shadow-sm">
                    <div className="flex gap-1">
                      <motion.span
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                        className="h-2 w-2 rounded-full bg-gray-400"
                      />
                      <motion.span
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }}
                        className="h-2 w-2 rounded-full bg-gray-400"
                      />
                      <motion.span
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
                        className="h-2 w-2 rounded-full bg-gray-400"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
