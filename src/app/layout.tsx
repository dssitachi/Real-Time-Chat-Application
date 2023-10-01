import { Toaster } from '@/components/ui/toaster'
import './globals.css'
import { Inter } from 'next/font/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main className="lg:max-w-7xl lg:mx-auto">{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
