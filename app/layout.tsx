import type React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BudgetProvider } from '@/components/budget-context'
import { Toaster } from '@/components/ui/toaster'
import { PWAInstallPrompt } from '@/components/pwa-install-prompt'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 5,
	minimumScale: 1,
	userScalable: true,
	viewportFit: 'cover',
	themeColor: '#ffffff',
}

export const metadata: Metadata = {
	title: 'Fipa - Personal Finance Tracker',
	description: 'Track your income, expenses, savings, and investments by Natilix',
	icons: {
		icon: '/favicon.ico',
	},
	manifest: '/manifest.json',
	appleWebApp: {
		capable: true,
		statusBarStyle: 'default',
		title: 'Fipa',
	},
	formatDetection: {
		telephone: false,
	},
	openGraph: {
		title: 'Fipa - Personal Finance Tracker',
		description: 'Track your income, expenses, savings, and investments by Natilix',
		url: 'https://fipa.natiflix.com',
		siteName: 'Fipa',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Fipa - Personal Finance Tracker',
		description: 'Track your income, expenses, savings, and investments by Natilix',
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
				<meta name="apple-mobile-web-app-title" content="Fipa" />
				<meta name="format-detection" content="telephone=no" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="application-name" content="Fipa" />
			</head>
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<BudgetProvider>
						{children}
						<Toaster />
						<PWAInstallPrompt />
					</BudgetProvider>
				</ThemeProvider>
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
