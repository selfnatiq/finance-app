'use client'

import { useState, useEffect } from 'react'
import Dashboard from '@/components/dashboard'
import SavingsCalculator from '@/components/savings-calculator'
import InvestmentCalculator from '@/components/investment-calculator'
import YearlyAnalysis from '@/components/yearly-analysis'
import BudgetHistory from '@/components/budget-history'
import Plans from '@/components/plans'
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
	{ id: 'dashboard', label: 'Overview', icon: LayoutGrid },
	{ id: 'savings', label: 'Savings', icon: PiggyBank },
	{ id: 'investments', label: 'Invest', icon: TrendingUp },
	{ id: 'yearly', label: 'Analysis', icon: BarChart3 },
	{ id: 'history', label: 'History', icon: History },
	{ id: 'plans', label: 'Plans', icon: Target },
]

export default function Home() {
	const [activeView, setActiveView] = useState('dashboard')
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)
	const [isMobile, setIsMobile] = useState(false)

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

	// Close sidebar when changing view on mobile
	useEffect(() => {
		if (isMobile) {
			setIsSidebarOpen(false)
		}
	}, [activeView, isMobile])

	// Listen for view changes from child components
	useEffect(() => {
		const handleViewChange = (e: CustomEvent) => {
			setActiveView(e.detail.view)
		}

		window.addEventListener('setActiveView', handleViewChange as EventListener)
		return () => {
			window.removeEventListener('setActiveView', handleViewChange as EventListener)
		}
	}, [])

	const renderContent = () => {
		switch (activeView) {
			case 'dashboard':
				return <Dashboard />
			case 'savings':
				return <SavingsCalculator />
			case 'investments':
				return <InvestmentCalculator />
			case 'yearly':
				return <YearlyAnalysis />
			case 'history':
				return <BudgetHistory />
			case 'plans':
				return <Plans />
			default:
				return <Dashboard />
		}
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
						<FipaLogo />
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
								return (
									<li key={item.id}>
										<button
											onClick={() => setActiveView(item.id)}
											className={cn(
												'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
												activeView === item.id
													? 'bg-primary text-primary-foreground shadow-sm'
													: 'hover:bg-secondary/80'
											)}
										>
											<Icon className="h-5 w-5" />
											<span>{item.label}</span>

											{/* Active indicator */}
											{activeView === item.id && (
												<span className="ml-auto h-2 w-2 rounded-full bg-primary-foreground animate-pulse" />
											)}
										</button>
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
					<div className="max-w-6xl mx-auto w-full animate-in">{renderContent()}</div>
				</div>

				{/* Bottom navigation (mobile only) */}
				<nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border lg:hidden z-30">
					<div className="flex justify-around items-center h-16">
						{navItems.map((item) => {
							const Icon = item.icon
							return (
								<button
									key={item.id}
									onClick={() => setActiveView(item.id)}
									className={cn(
										'flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-200',
										activeView === item.id && 'text-primary'
									)}
								>
									<div
										className={cn(
											'relative flex items-center justify-center',
											activeView === item.id && 'nav-icon-active'
										)}
									>
										<Icon className="h-5 w-5" />
									</div>
									<span className="text-[10px] font-medium">{item.label}</span>
								</button>
							)
						})}
					</div>
				</nav>
			</main>
		</div>
	)
}
