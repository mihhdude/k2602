import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import { AuthProvider } from "@/hooks/use-auth"
import { Toaster } from "@/components/toaster"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "K2602 - Kingdom 2602",
  description: "Kingdom 2602 KvK data reporting tool",
  icons: {
    icon: "/2602-logo.png",
  },
  generator: 'v0.dev',
  authors: [{ name: 'Kingdom 2602' }],
  creator: 'Kingdom 2602',
  publisher: 'Kingdom 2602',
  keywords: ['Kingdom 2602', 'KvK', 'ROK'],
  openGraph: {
    title: 'K2602 - Kingdom 2602',
    description: 'Kingdom 2602 KvK data reporting tool',
    siteName: 'Kingdom 2602',
    locale: 'vi_VN',
    type: 'website',
    countryName: 'Vietnam',
  },
  other: {
    'copyright': '© 2025 Kingdom 2602. All rights reserved.'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/2602-logo.png" sizes="any" />
        <link rel="icon" type="image/png" href="/2602-logo.png" />
        <link rel="apple-touch-icon" href="/2602-logo.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="copyright" content="© 2025 Kingdom 2602. All rights reserved." />
        <script dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('contextmenu', e => e.preventDefault());
            document.onkeydown = e => {
              if (e.ctrlKey && 
                  (e.keyCode === 67 || 
                   e.keyCode === 86 || 
                   e.keyCode === 85 || 
                   e.keyCode === 117)) {
                return false;
              }
              return true;
            };
          `
        }} />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <LanguageProvider>
              <div className="min-h-screen flex flex-col">
                {children}
                <Footer />
              </div>
              <Toaster />
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}