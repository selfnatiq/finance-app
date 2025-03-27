import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { BudgetProvider } from "@/components/budget-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Personal Finance Tracker",
  description: "Track your income, expenses, and savings",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <BudgetProvider>{children}</BudgetProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'