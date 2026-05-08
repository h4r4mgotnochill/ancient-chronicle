import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'The Ancient Chronicle',
  description: 'An AI-powered historical RPG — explore 250 eras through open-ended adventure.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚜️</text></svg>",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#080604] text-parchment font-fell min-h-screen">
        {children}
      </body>
    </html>
  )
}
