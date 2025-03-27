import type React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BudgetProvider } from '@/components/budget-context'
import { Toaster } from '@/components/ui/toaster'
import { PWAInstallPrompt } from '@/components/pwa-install-prompt'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 5,
	minimumScale: 1,
	userScalable: true,
	viewportFit: 'cover',
	themeColor: '#000000',
}

export const metadata: Metadata = {
	title: 'Personal Finance Tracker',
	description: 'Track your income, expenses, and savings',
	icons: {
		icon: '/favicon.ico',
	},
	manifest: '/manifest.json',
	appleWebApp: {
		capable: true,
		statusBarStyle: 'default',
		title: 'Finance App',
	},
	formatDetection: {
		telephone: false,
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
			<head>
				<link rel="manifest" href="/manifest.json" />
				<meta name="theme-color" content="#000000" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content="Finance App" />
				<meta name="format-detection" content="telephone=no" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="application-name" content="Finance App" />
			</head>
			<body className={inter.className}>
				<BudgetProvider>
					{children}
					<Toaster />
					<PWAInstallPrompt />
				</BudgetProvider>
				<script
					dangerouslySetInnerHTML={{
						__html: `
							if ('serviceWorker' in navigator) {
								window.addEventListener('load', function() {
									navigator.serviceWorker.register('/sw.js').then(
										function(registration) {
											console.log('ServiceWorker registration successful');
										},
										function(err) {
											console.log('ServiceWorker registration failed: ', err);
										}
									);
								});
							}
						`,
					}}
				/>
			</body>
		</html>
	)
}

import './globals.css'
