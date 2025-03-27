import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BudgetProvider } from '@/components/budget-context'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Personal Finance Tracker',
	description: 'Track your income, expenses, and savings',
	icons: {
		icon: '/favicon.ico',
	},
	openGraph: {
		title: 'Personal Finance Tracker',
		description: 'Track your income, expenses, and savings',
		url: 'https://fipa.natiflix.com',
		siteName: 'Personal Finance Tracker',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Personal Finance Tracker',
		description: 'Track your income, expenses, and savings',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<BudgetProvider>
					{children}
					<Toaster />
				</BudgetProvider>
			</body>
		</html>
	)
}

import './globals.css'
