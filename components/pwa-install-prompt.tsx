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
import FipaLogo from './fipa-logo'

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
					<FipaLogo className="animate-bounce" noText={true} />
					<SheetTitle className="text-center text-2xl">Get Fipa on Your Device</SheetTitle>
					<SheetDescription className="text-center text-base">
						Take your financial planning to the next level. Add Fipa to your home screen for instant
						access, seamless offline tracking, and a smooth native-like experience.
					</SheetDescription>
					<Button
						onClick={handleInstallClick}
						className="mt-4 flex items-center gap-2 bg-primary hover:bg-primary/90"
					>
						<Download className="h-4 w-4" />
						Install
					</Button>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	)
}
