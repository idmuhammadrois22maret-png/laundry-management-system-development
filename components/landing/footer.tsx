'use client'

import { Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-gray-50/50 px-6">
      <div className="mx-auto max-w-7xl py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111827]">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight">LaundryFlow</span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-[#6B7280]">
              Platform manajemen laundry modern untuk bisnis segala ukuran.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#111827]">Produk</h4>
            <ul className="space-y-3">
              {['Fitur', 'Harga', 'Pelanggan', 'Pembaruan'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-[#6B7280] transition-colors hover:text-[#111827]">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#111827]">Perusahaan</h4>
            <ul className="space-y-3">
              {['Tentang', 'Blog', 'Karir', 'Kontak'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-[#6B7280] transition-colors hover:text-[#111827]">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#111827]">Hukum</h4>
            <ul className="space-y-3">
              {['Privasi', 'Syarat', 'Keamanan', 'Cookies'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-[#6B7280] transition-colors hover:text-[#111827]">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-[#6B7280]">
            &copy; {new Date().getFullYear()} LaundryFlow. Hak cipta dilindungi.
          </p>
          <div className="flex gap-6">
            {['Twitter', 'Instagram', 'TikTok'].map((s) => (
              <a
                key={s}
                href="#"
                className="text-xs text-[#6B7280] transition-colors hover:text-[#111827]"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
