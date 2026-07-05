'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save } from 'lucide-react'
import { toast } from 'sonner'

interface CustomerCreatePageProps {
  onBack: () => void
  onSuccess: () => void
}

export function CustomerCreatePage({ onBack, onSuccess }: CustomerCreatePageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.phone) {
      toast.error('Nama dan nomor telepon wajib diisi')
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('customers')
      .insert([formData])

    if (error) {
      toast.error('Gagal menambah pelanggan: ' + error.message)
      setIsLoading(false)
      return
    }

    toast.success('Pelanggan berhasil ditambahkan')
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Lengkap *</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Budi Santoso" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Nomor WhatsApp *</Label>
          <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="081234567890" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="budi@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Kota</Label>
          <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Jakarta" />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="address">Alamat</Label>
          <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Jl. Sudirman No. 123" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postal_code">Kode Pos</Label>
          <Input id="postal_code" name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="12190" />
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-border">
        <Button type="submit" disabled={isLoading} className="flex-1 gap-2">
          <Save className="size-4" />
          {isLoading ? 'Menyimpan...' : 'Simpan'}
        </Button>
        <Button type="button" onClick={onBack} variant="outline">Batal</Button>
      </div>
    </form>
  )
}
