'use client'

import { useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { Dashboard } from '@/components/dashboard'
import { CustomersPage } from '@/components/customers-page'
import { OrdersPage } from '@/components/orders-page'
import { ReportsPage } from '@/components/reports-page'

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'customers':
        return <CustomersPage />
      case 'orders':
        return <OrdersPage />
      case 'reports':
        return <ReportsPage />
      case 'dashboard':
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1">
        {renderPage()}
      </div>
    </div>
  )
}
