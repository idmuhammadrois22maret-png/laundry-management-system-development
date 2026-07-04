'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save } from 'lucide-react'
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
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tambah Pelanggan Baru</h1>
          <p className="text-muted-foreground mt-1">Masukkan informasi pelanggan baru</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informasi Pelanggan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Budi Santoso"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Nomor WhatsApp *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="081234567890"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="budi@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Kota</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Jakarta"
                />
              </div>

              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Jl. Sudirman No. 123"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal_code">Kode Pos</Label>
                <Input
                  id="postal_code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  placeholder="12190"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-border">
              <Button type="submit" disabled={isLoading} className="gap-2 flex-1">
                <Save className="w-4 h-4" />
                {isLoading ? 'Menyimpan...' : 'Simpan Pelanggan'}
              </Button>
              <Button type="button" onClick={onBack} variant="outline" className="flex-1">
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
