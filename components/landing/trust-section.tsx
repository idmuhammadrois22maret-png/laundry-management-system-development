'use client'

import { motion } from 'framer-motion'

const companies = [
  'CleanLaundry', 'FreshWash', 'IronExpress', 'SudShare',
  'LaundryGo', 'WashDrop', 'PressLab', 'CleanBee',
]

export function TrustSection() {
  return (
    <section className="border-y border-border px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <p className="mb-8 text-center text-sm text-[#6B7280]">
          Dipercaya <span className="font-medium text-[#111827]">500+ bisnis laundry</span>
        </p>
        <div className="flex overflow-hidden">
          <motion.div
            className="flex shrink-0 gap-12"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            {[...companies, ...companies].map((name, i) => (
              <span
                key={i}
                className="select-none text-base font-medium tracking-tight text-gray-300"
              >
                {name}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
