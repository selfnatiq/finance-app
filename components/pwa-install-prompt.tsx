'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from '@/components/ui/sheet'
import Image from 'next/image'

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		const handler = (e: Event) => {
			e.preventDefault()
			setDeferredPrompt(e as BeforeInstallPromptEvent)
			setIsOpen(true)
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
			setIsOpen(false)
		}
	}

	if (!deferredPrompt) return null

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetContent side="bottom" className="h-[40vh]">
				<SheetHeader className="flex flex-col items-center space-y-4">
					<div className="relative h-24 w-24 animate-bounce">
						<Image src="/logo.png" alt="App Logo" fill className="object-contain" />
					</div>
					<SheetTitle className="text-center text-2xl">Install Finance App</SheetTitle>
					<SheetDescription className="text-center text-base">
						Install our app for a better experience with quick access, offline support, and faster
						performance.
					</SheetDescription>
					<Button
						onClick={handleInstallClick}
						className="mt-4 flex items-center gap-2 bg-primary hover:bg-primary/90"
					>
						<Download className="h-4 w-4" />
						Install Now
					</Button>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	)
}
