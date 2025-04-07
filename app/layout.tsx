import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import { AuthProvider } from "@/hooks/use-auth"
import { Toaster } from "@/components/toaster"
import { Footer } from "@/app/components/footer"
import { Header } from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "K2602 - Kingdom 2602",
  description: "Công cụ báo cáo dữ liệu KvK của Kingdom 2602",
  icons: {
    icon: "/2602-logo.png",
  },
  generator: 'v0.dev',
  authors: [{ name: 'Kingdom 2602' }],
  creator: 'Kingdom 2602',
  publisher: 'Kingdom 2602',
  keywords: ['Kingdom 2602', 'KvK', 'ROK', 'Rise of Kingdoms'],
  openGraph: {
    title: 'K2602 - Kingdom 2602',
    description: 'Công cụ báo cáo dữ liệu KvK của Kingdom 2602',
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
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/2602-logo.png" sizes="any" />
        <link rel="icon" type="image/png" href="/2602-logo.png" />
        <link rel="apple-touch-icon" href="/2602-logo.png" />
        <meta name="theme-color" content="#0f172a" />
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
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <LanguageProvider>
              <div className="flex min-h-screen flex-col bg-background">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-6">
                  {children}
                </main>
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