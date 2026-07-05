'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Sari Dewi',
    business: 'CleanFresh Laundry',
    avatar: 'SD',
    testimonial:
      'LaundryFlow mengubah cara kami mengelola pesanan. Notifikasi WhatsApp saja sudah menghemat berjam-jam telepon setiap hari.',
    rating: 5,
  },
  {
    name: 'Agus Prasetyo',
    business: 'Express Wash',
    avatar: 'AP',
    testimonial:
      'Fitur laporannya luar biasa. Saya bisa lihat persis bagaimana kinerja bisnis saya dalam sekejap. Sangat direkomendasikan!',
    rating: 5,
  },
  {
    name: 'Maya Indah',
    business: 'Fresh & Fold',
    avatar: 'MI',
    testimonial:
      'Kami beralih dari catatan kertas ke digital sepenuhnya. Pelanggan kami suka notifikasi WhatsApp dan kami suka dashboard yang rapi.',
    rating: 5,
  },
  {
    name: 'Budi Hartono',
    business: 'Super Clean Laundry',
    avatar: 'BH',
    testimonial:
      'Pembuatan invoice saja sudah sepadan dengan harganya. Invoice PDF profesional dengan logo — pelanggan kira bisnis kami naik kelas.',
    rating: 4,
  },
  {
    name: 'Rina Wijaya',
    business: 'LaundryKu',
    avatar: 'RW',
    testimonial:
      'Pengaturannya sangat mudah. Dalam 15 menit kami sudah punya pesanan pertama. Antarmukanya bersih dan intuitif.',
    rating: 5,
  },
  {
    name: 'Denny Saputra',
    business: 'Wash & Go',
    avatar: 'DS',
    testimonial:
      'Manajemen pelanggan jadi sangat mudah. Saya bisa lihat riwayat pelanggan dalam hitungan detik. Game changer untuk kualitas layanan kami.',
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="border-y border-border px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-3 text-sm font-medium text-[#2563EB]"
          >
            Testimoni
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-[#111827] md:text-4xl"
          >
            Disukai bisnis laundry
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-[#6B7280]"
          >
            Lihat apa kata pelanggan kami tentang LaundryFlow.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.25, 0.1, 0, 1] }}
              className="rounded-xl border border-border p-6 transition-colors hover:border-[#111827]/20"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star
                    key={si}
                    className={`h-4 w-4 ${
                      si < t.rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm leading-relaxed text-[#6B7280]">&ldquo;{t.testimonial}&rdquo;</p>

              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111827] text-xs font-medium text-white">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#111827]">{t.name}</p>
                  <p className="text-xs text-[#6B7280]">{t.business}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
