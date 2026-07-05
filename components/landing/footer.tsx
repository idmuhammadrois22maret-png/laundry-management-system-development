'use client'

import { Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-gray-50/50 px-6">
      <div className="mx-auto max-w-7xl py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#" className="flex items-center gap-2.5">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="#111827"/>
                <path d="M10 20V12L16 8L22 12V20L16 24L10 20Z" fill="white" opacity="0.9"/>
                <path d="M13 16L15 18L19 14" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 8V24" stroke="#111827" strokeWidth="0.5" opacity="0.2"/>
              </svg>
              <span className="text-lg font-semibold tracking-tight">Laundrio</span>
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
            &copy; {new Date().getFullYear()} Laundrio. Hak cipta dilindungi.
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
