'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

	useEffect(() => {
		const handler = (e: Event) => {
			e.preventDefault()
			setDeferredPrompt(e as BeforeInstallPromptEvent)
		}

		window.addEventListener('beforeinstallprompt', handler)

		return () => {
			window.removeEventListener('beforeinstallprompt', handler)
		}
	}, [])

	const handleInstallClick = async () => {
		if (!deferredPrompt) return

		deferredPrompt.prompt()
		const { outcome } = await deferredPrompt.userChoice
		if (outcome === 'accepted') {
			setDeferredPrompt(null)
		}
	}

	if (!deferredPrompt) return null

	return (
		<Button
			onClick={handleInstallClick}
			className="fixed bottom-4 right-4 z-50 flex items-center gap-2"
		>
			<Download className="h-4 w-4" />
			Install App
		</Button>
	)
}
