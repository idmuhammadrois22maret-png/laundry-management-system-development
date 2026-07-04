'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Customer {
  id: string
  name: string
  email?: string
  phone: string
  address?: string
  city?: string
  postal_code?: string
  total_orders?: number
  total_spent?: number
}

interface CustomerEditPageProps {
  customer: Customer
  onBack: () => void
  onSuccess: () => void
}

export function CustomerEditPage({ customer, onBack, onSuccess }: CustomerEditPageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState<Customer>(customer)

  useEffect(() => {
    setFormData(customer)
  }, [customer])

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
      .update({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postal_code,
      })
      .eq('id', customer.id)

    if (error) {
      toast.error('Gagal memperbarui pelanggan: ' + error.message)
      setIsLoading(false)
      return
    }

    toast.success('Pelanggan berhasil diperbarui')
    onSuccess()
  }

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus pelanggan ini? Data pesanan akan tetap tersimpan.')) {
      return
    }

    setIsDeleting(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', customer.id)

    if (error) {
      toast.error('Gagal menghapus pelanggan: ' + error.message)
      setIsDeleting(false)
      return
    }

    toast.success('Pelanggan berhasil dihapus')
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
          <h1 className="text-3xl font-bold text-foreground">Edit Pelanggan</h1>
          <p className="text-muted-foreground mt-1">Perbarui informasi pelanggan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
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
                      value={formData.email || ''}
                      onChange={handleChange}
                      placeholder="budi@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Kota</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city || ''}
                      onChange={handleChange}
                      placeholder="Jakarta"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <Label htmlFor="address">Alamat</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleChange}
                      placeholder="Jl. Sudirman No. 123"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Kode Pos</Label>
                    <Input
                      id="postal_code"
                      name="postal_code"
                      value={formData.postal_code || ''}
                      onChange={handleChange}
                      placeholder="12190"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-border">
                  <Button type="submit" disabled={isLoading} className="gap-2 flex-1">
                    <Save className="w-4 h-4" />
                    {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                  <Button type="button" onClick={onBack} variant="outline" className="flex-1">
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistik Pelanggan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Pesanan</p>
                <p className="text-2xl font-bold">{customer.total_orders || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
                <p className="text-2xl font-bold">Rp {((customer.total_spent || 0) / 1000).toLocaleString('id-ID')}K</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-lg text-red-900">Zona Bahaya</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                variant="destructive"
                className="w-full gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? 'Menghapus...' : 'Hapus Pelanggan'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
