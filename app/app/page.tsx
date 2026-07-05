'use client'

import { useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { Dashboard } from '@/components/dashboard'
import { CustomersPage } from '@/components/customers-page'
import { OrdersPage } from '@/components/orders-page'
import { ReportsPage } from '@/components/reports-page'
import { PaymentsPageFull } from '@/components/payments-page-full'
import { NotificationsPageFull } from '@/components/notifications-page-full'

export default function AppPage() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'customers':
        return <CustomersPage />
      case 'orders':
        return <OrdersPage />
      case 'payments':
        return <PaymentsPageFull />
      case 'notifications':
        return <NotificationsPageFull />
      case 'reports':
        return <ReportsPage />
      case 'dashboard':
      default:
        return <Dashboard />
    }
  }

  return (
    <AppSidebar currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </AppSidebar>
  )
}
