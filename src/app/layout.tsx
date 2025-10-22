import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { ReactQueryProvider } from '@/providers/ReactQueryProvider'

export const metadata: Metadata = {
  title: 'FURFIELD HMS - Hospital Management System & Module Hub',
  description: 'Comprehensive Veterinary Hospital Management System - Entry point to all Furfield modules',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="text-foreground bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <ReactQueryProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col relative">
              <Header />
              <main className="flex-1 p-6 overflow-auto relative">
                {children}
              </main>
            </div>
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  )
}