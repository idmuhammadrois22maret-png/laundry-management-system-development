'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const plans = [
  {
    name: 'Starter',
    price: 'Rp49.000',
    period: '/bulan',
    description: 'Cocok untuk bisnis laundry kecil yang baru memulai.',
    features: [
      'Hingga 100 pelanggan',
      'Pesanan tak terbatas',
      'Laporan dasar',
      'Notifikasi WhatsApp',
      'Dukungan email',
    ],
    cta: 'Coba Gratis',
    popular: false,
  },
  {
    name: 'Business',
    price: 'Rp99.000',
    period: '/bulan',
    description: 'Untuk bisnis yang berkembang dan butuh lebih banyak fitur.',
    features: [
      'Pelanggan tak terbatas',
      'Pesanan tak terbatas',
      'Laporan & analitik lanjutan',
      'Integrasi WhatsApp',
      'Invoice PDF',
      'Dukungan prioritas',
    ],
    cta: 'Coba Gratis',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Kustom',
    period: '',
    description: 'Untuk operasi besar dengan kebutuhan khusus.',
    features: [
      'Semua fitur Business',
      'Fitur kustom',
      'Akses API',
      'Account manager dedicated',
      'Garansi SLA',
      'Integrasi kustom',
    ],
    cta: 'Hubungi Sales',
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-3 text-sm font-medium text-[#2563EB]"
          >
            Harga
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-[#111827] md:text-4xl"
          >
            Harga sederhana & transparan
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-[#6B7280]"
          >
            Tanpa biaya tersembunyi. Mulai gratis, upgrade saat bisnis berkembang.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.25, 0.1, 0, 1] }}
              className={`relative rounded-xl border p-8 transition-colors hover:border-[#111827]/20 ${
                plan.popular ? 'border-[#2563EB]' : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#2563EB] px-4 py-1 text-xs font-medium text-white">
                  Paling populer
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-[#111827]">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-[#111827]">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-[#6B7280]">{plan.period}</span>
                  )}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">{plan.description}</p>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-[#6B7280]">
                    <Check className="h-4 w-4 text-[#2563EB]" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                className={`mt-8 w-full ${
                  plan.popular
                    ? 'bg-[#2563EB] text-white hover:bg-[#2563EB]/90'
                    : 'border-border bg-white text-[#111827] hover:bg-gray-50'
                }`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
