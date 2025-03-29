'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import FipaLogo from '@/components/fipa-logo'
import { ThemeToggle } from '@/components/theme-toggle'
import {
	LayoutGrid,
	PiggyBank,
	TrendingUp,
	BarChart3,
	History,
	Target,
	Menu,
	X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
	{ id: 'dashboard', href: '/', label: 'Overview', icon: LayoutGrid },
	{ id: 'savings', href: '/savings', label: 'Savings', icon: PiggyBank },
	{ id: 'investments', href: '/investments', label: 'Invest', icon: TrendingUp },
	{ id: 'yearly', href: '/yearly', label: 'Analysis', icon: BarChart3 },
	{ id: 'plans', href: '/plans', label: 'Plans', icon: Target },
	{ id: 'history', href: '/history', label: 'History', icon: History },
]

export function AppShell({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)
	const [isMobile, setIsMobile] = useState(false)

	// Determine current active view based on pathname
	const activeViewId = navItems.find((item) => item.href === pathname)?.id || 'dashboard'

	// Check if we're on mobile
	useEffect(() => {
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth < 1024)
		}

		checkIfMobile()
		window.addEventListener('resize', checkIfMobile)

		return () => {
			window.removeEventListener('resize', checkIfMobile)
		}
	}, [])

	// Close sidebar when clicking outside on mobile
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const sidebar = document.getElementById('sidebar')
			if (isMobile && isSidebarOpen && sidebar && !sidebar.contains(e.target as Node)) {
				setIsSidebarOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isMobile, isSidebarOpen])

	// Close sidebar when changing view (pathname changes) on mobile
	useEffect(() => {
		if (isMobile) {
			setIsSidebarOpen(false)
		}
	}, [pathname, isMobile])

	// Handle navigation click with smooth scroll to top
	const handleNavClick = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		})
		// Sidebar is closed via useEffect watching pathname
	}

	return (
		<div className="flex h-screen overflow-hidden bg-background">
			{/* Sidebar for desktop / Mobile drawer */}
			<aside
				id="sidebar"
				className={cn(
					'bg-card border-r border-border h-full w-64 flex-shrink-0 transition-all duration-300 ease-in-out transform',
					isMobile ? 'fixed top-0 left-0 z-40 h-full shadow-xl' : 'relative',
					isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'
				)}
			>
				<div className="flex flex-col h-full">
					{/* Logo and close button (mobile only) */}
					<div className="p-4 border-b border-border flex items-center justify-between">
						<FipaLogo noText={true} />
						<div className="flex items-center gap-2">
							<ThemeToggle />
							{isMobile && (
								<Button
									variant="ghost"
									size="icon"
									onClick={() => setIsSidebarOpen(false)}
									className="lg:hidden"
								>
									<X className="h-5 w-5" />
								</Button>
							)}
						</div>
					</div>

					{/* Navigation items */}
					<nav className="flex-1 py-4 overflow-y-auto">
						<ul className="space-y-1 px-2">
							{navItems.map((item) => {
								const Icon = item.icon
								const isActive = activeViewId === item.id
								return (
									<li key={item.id}>
										<Link
											href={item.href}
											onClick={handleNavClick}
											className={cn(
												'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
												isActive
													? 'bg-primary text-primary-foreground shadow-sm'
													: 'hover:bg-secondary/80'
											)}
										>
											<Icon className="h-5 w-5" />
											<span>{item.label}</span>

											{/* Active indicator */}
											{isActive && (
												<span className="ml-auto h-2 w-2 rounded-full bg-primary-foreground animate-pulse" />
											)}
										</Link>
									</li>
								)
							})}
						</ul>
					</nav>

					{/* App info */}
					<div className="p-4 border-t border-border">
						<p className="text-xs text-muted-foreground text-center">
							Fipa - Smart financial planning
						</p>
					</div>
				</div>
			</aside>

			{/* Overlay for mobile sidebar */}
			{isMobile && isSidebarOpen && (
				<div
					className="fixed inset-0 bg-black/30 z-30 backdrop-blur-sm transition-opacity duration-300"
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}

			{/* Main content */}
			<main className="flex-1 flex flex-col h-full overflow-hidden">
				{/* Top header (mobile only) */}
				<header
					className={cn(
						'border-b border-border p-4 flex items-center justify-between lg:hidden',
						isSidebarOpen ? 'opacity-0' : 'opacity-100 transition-opacity'
					)}
				>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsSidebarOpen(true)}
						className="lg:hidden"
					>
						<Menu className="h-5 w-5" />
					</Button>
					<FipaLogo />
					<div className="w-9" /> {/* Empty div for centering logo */}
				</header>

				{/* Content area */}
				<div className="flex-1 overflow-y-auto p-4 pb-20 lg:pb-4 lg:px-6">
					<div className="max-w-6xl mx-auto w-full animate-in">{children}</div>
				</div>

				{/* Bottom navigation (mobile only) */}
				<nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border lg:hidden z-30">
					<div className="flex justify-around items-center h-16">
						{navItems.map((item) => {
							const Icon = item.icon
							const isActive = activeViewId === item.id
							return (
								<Link
									key={item.id}
									href={item.href}
									onClick={handleNavClick}
									className={cn(
										'ios-nav-button flex flex-col items-center justify-center gap-1 w-full h-full',
										isActive ? 'active' : ''
									)}
								>
									<div className="ios-nav-icon relative flex items-center justify-center">
										<div className="ios-nav-ripple" />
										<Icon className="h-5 w-5 relative z-10" />
									</div>
									<span
										className={cn(
											'text-[10px] font-medium transition-all duration-300 ease-in-out',
											isActive ? 'opacity-100' : 'opacity-70'
										)}
									>
										{item.label}
									</span>
								</Link>
							)
						})}
					</div>
				</nav>
			</main>
		</div>
	)
}
