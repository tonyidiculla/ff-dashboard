import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Furfield Dashboard',
  description: 'Central hub for all Furfield microservices',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}