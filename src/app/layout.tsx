import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { ReactQueryProvider } from '@/providers/ReactQueryProvider'
import { AuthProvider } from '@/context/AuthContext'
import { hmsNavigation } from '@/config/navigation'

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
        <AuthProvider>
          <ReactQueryProvider>
            <div className="flex flex-col min-h-screen">
              {/* Full-width Header */}
              <Header />
              
              {/* Sidebar and Content below Header */}
              <div className="flex flex-1">
                <Sidebar navigation={hmsNavigation} />
                <main className="flex-1 p-6 overflow-auto relative flex flex-col">
                  {children}
                </main>
              </div>
            </div>
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}