'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Edit2, Trash2, X } from 'lucide-react'

interface Order {
  id: string
  order_number: string
  customer_id: string
  status: string
  total_amount: number
  paid: boolean
  payment_method: string
  notes: string
  created_at: string
  customers?: { name: string; phone: string }
}

interface Customer {
  id: string
  name: string
}

interface Service {
  id: string
  name: string
  price: number
}

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    customer_id: '',
    total_amount: 0,
    status: 'pending',
    payment_method: 'cash',
    notes: '',
  })

  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, customers(name, phone)')
        .order('created_at', { ascending: false })

      // Load customers for dropdown
      const { data: customersData } = await supabase
        .from('customers')
        .select('id, name')

      // Load services
      const { data: servicesData } = await supabase
        .from('services')
        .select('id, name, price')

      setOrders(ordersData || [])
      setCustomers(customersData || [])
      setServices(servicesData || [])
    } catch (error) {
      console.error('[v0] Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateOrderNumber = () => {
    return 'ORD-' + Date.now().toString().slice(-8)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        // Update order
        const { error } = await supabase
          .from('orders')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
      } else {
        // Create order
        const { error } = await supabase
          .from('orders')
          .insert([
            {
              ...formData,
              order_number: generateOrderNumber(),
            },
          ])

        if (error) throw error
      }

      setFormData({ customer_id: '', total_amount: 0, status: 'pending', payment_method: 'cash', notes: '' })
      setShowForm(false)
      setEditingId(null)
      loadData()
    } catch (error) {
      console.error('[v0] Error saving order:', error)
    }
  }

  const handleEdit = (order: Order) => {
    setFormData({
      customer_id: order.customer_id,
      total_amount: order.total_amount,
      status: order.status,
      payment_method: order.payment_method || 'cash',
      notes: order.notes || '',
    })
    setEditingId(order.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadData()
    } catch (error) {
      console.error('[v0] Error deleting order:', error)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ customer_id: '', total_amount: 0, status: 'pending', payment_method: 'cash', notes: '' })
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Order
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{editingId ? 'Edit Order' : 'Create New Order'}</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer">Customer *</Label>
                <select
                  id="customer"
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="amount">Total Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.total_amount}
                  onChange={(e) => setFormData({ ...formData, total_amount: parseFloat(e.target.value) })}
                  required
                  placeholder="Order amount"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="ready">Ready</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <Label htmlFor="payment">Payment Method</Label>
                <select
                  id="payment"
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="cash">Cash</option>
                  <option value="transfer">Bank Transfer</option>
                  <option value="card">Card</option>
                  <option value="wallet">E-Wallet</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Order notes or special requests"
                />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button type="submit">{editingId ? 'Update' : 'Create'} Order</Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Orders Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Order #</th>
                  <th className="text-left py-3 px-4 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Payment</th>
                  <th className="text-left py-3 px-4 font-semibold">Method</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono text-xs">{order.order_number}</td>
                      <td className="py-3 px-4">{order.customers?.name || 'N/A'}</td>
                      <td className="py-3 px-4">Rp {(order.total_amount / 1000).toFixed(0)}K</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'ready' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.paid ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs">{order.payment_method || 'N/A'}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(order)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(order.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
