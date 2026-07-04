'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface Payment {
  id: string
  order_id: string
  amount: number
  payment_method: string
  payment_status: string
  stripe_payment_id: string
  notes: string
  created_at: string
  orders?: { order_number: string; customers?: { name: string } }
}

interface Order {
  id: string
  order_number: string
  total_amount: number
  paid: boolean
  status: string
  customers?: { name: string; phone: string }
}

export function PaymentsPanel() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [unpaidOrders, setUnpaidOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<string>('')
  const [formData, setFormData] = useState({
    amount: 0,
    payment_method: 'cash',
    notes: '',
  })

  const supabase = createClient()

  useEffect(() => {
    loadPaymentData()
  }, [])

  const loadPaymentData = async () => {
    try {
      // Load payments
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*, orders(order_number, customers(name))')
        .order('created_at', { ascending: false })
        .limit(10)

      // Load unpaid orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, customers(name, phone)')
        .eq('paid', false)
        .order('created_at', { ascending: false })

      setPayments(paymentsData || [])
      setUnpaidOrders(ordersData || [])
    } catch (error) {
      console.error('[v0] Error loading payment data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedOrder) {
      alert('Please select an order')
      return
    }

    try {
      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([
          {
            order_id: selectedOrder,
            amount: formData.amount,
            payment_method: formData.payment_method,
            payment_status: 'completed',
            notes: formData.notes,
          },
        ])

      if (paymentError) throw paymentError

      // Update order as paid
      const { error: orderError } = await supabase
        .from('orders')
        .update({ paid: true })
        .eq('id', selectedOrder)

      if (orderError) throw orderError

      setSelectedOrder('')
      setFormData({ amount: 0, payment_method: 'cash', notes: '' })
      setShowForm(false)
      loadPaymentData()
    } catch (error) {
      console.error('[v0] Error recording payment:', error)
      alert('Error recording payment: ' + (error as any).message)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading payment data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Payment Management</h2>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <CreditCard className="w-4 h-4" />
          Record Payment
        </Button>
      </div>

      {/* Payment Form */}
      {showForm && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Record Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <Label htmlFor="pay-order">Select Order *</Label>
                <select
                  id="pay-order"
                  value={selectedOrder}
                  onChange={(e) => {
                    setSelectedOrder(e.target.value)
                    const order = unpaidOrders.find(o => o.id === e.target.value)
                    if (order) {
                      setFormData({ ...formData, amount: order.total_amount })
                    }
                  }}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Choose an unpaid order</option>
                  {unpaidOrders.map((order) => (
                    <option key={order.id} value={order.id}>
                      {order.order_number} - {order.customers?.name} - Rp {(order.total_amount / 1000).toFixed(0)}K
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="pay-amount">Amount (Rp) *</Label>
                <Input
                  id="pay-amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  required
                  placeholder="Amount"
                />
              </div>

              <div>
                <Label htmlFor="pay-method">Payment Method</Label>
                <select
                  id="pay-method"
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

              <div>
                <Label htmlFor="pay-notes">Notes</Label>
                <Input
                  id="pay-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Payment notes..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Confirm Payment</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Unpaid Orders Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pending Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {unpaidOrders.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-4">
                All orders are paid!
              </p>
            ) : (
              unpaidOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 border border-yellow-200 bg-yellow-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-sm">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.customers?.name} - Rp {(order.total_amount / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedOrder(order.id)
                      setFormData({ ...formData, amount: order.total_amount })
                      setShowForm(true)
                    }}
                  >
                    Pay Now
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {payments.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-4">
                No payments recorded yet
              </p>
            ) : (
              payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    {payment.payment_status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    )}
                    <div>
                      <p className="font-medium text-sm">
                        {payment.orders?.order_number || 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payment.orders?.customers?.name || 'N/A'} • {payment.payment_method}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">Rp {(payment.amount / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payment.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
