'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, Check, X, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Notification {
  id: string
  order_id: string
  customer_id: string
  message: string
  notification_type: string
  sent: boolean
  sent_at: string
  created_at: string
  customers?: { name: string; phone: string }
}

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    customer_id: '',
    message: '',
    notification_type: 'whatsapp',
  })

  const supabase = createClient()

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      const { data } = await supabase
        .from('notifications')
        .select('*, customers(name, phone)')
        .order('created_at', { ascending: false })
        .limit(10)

      setNotifications(data || [])
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Create notification record
      const { error } = await supabase
        .from('notifications')
        .insert([
          {
            ...formData,
            sent: true,
            sent_at: new Date().toISOString(),
          },
        ])

      if (error) throw error

      // In a real app, this would call Twilio API or another service
      console.log('Notification sent via WhatsApp:', formData)

      setFormData({ customer_id: '', message: '', notification_type: 'whatsapp' })
      setShowForm(false)
      loadNotifications()
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  const handleMarkAsSent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ sent: true, sent_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      loadNotifications()
    } catch (error) {
      console.error('Error marking notification as sent:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">WhatsApp Notifications</h2>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <MessageSquare className="w-4 h-4" />
          Send Message
        </Button>
      </div>

      {showForm && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Send WhatsApp Notification</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div>
                <Label htmlFor="notif-customer">Customer Phone</Label>
                <Input
                  id="notif-customer"
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  placeholder="Enter customer phone or ID"
                  required
                />
              </div>
              <div>
                <Label htmlFor="notif-message">Message</Label>
                <textarea
                  id="notif-message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="WhatsApp message content..."
                  rows={3}
                  required
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="gap-2">
                  <Send className="w-4 h-4" />
                  Send via WhatsApp
                </Button>
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

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-4">
                No notifications sent yet
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start justify-between p-3 border border-border rounded-lg bg-muted/30"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {notification.customers?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      {notification.customers?.phone}
                    </p>
                    <p className="text-sm text-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(notification.created_at).toLocaleDateString('id-ID')} at{' '}
                      {new Date(notification.created_at).toLocaleTimeString('id-ID')}
                    </p>
                  </div>
                  <div className="ml-4 flex gap-2">
                    {notification.sent ? (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded text-xs text-green-800">
                        <Check className="w-3 h-3" />
                        Sent
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsSent(notification.id)}
                        className="gap-1"
                      >
                        <Send className="w-3 h-3" />
                        Send
                      </Button>
                    )}
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
