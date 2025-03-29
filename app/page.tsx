// Remove client directive if Dashboard is a Server Component, keep if it needs client-side interactivity
// 'use client' // Keep or remove based on Dashboard component's needs

// Remove unused imports
// import { useState, useEffect } from 'react'
import Dashboard from '@/components/dashboard'
// Remove layout/nav related component imports
// import SavingsCalculator from '@/components/savings-calculator'
// import InvestmentCalculator from '@/components/investment-calculator'
// import YearlyAnalysis from '@/components/yearly-analysis'
// import BudgetHistory from '@/components/budget-history'
// import Plans from '@/components/plans'
// import FipaLogo from '@/components/fipa-logo'
// import { ThemeToggle } from '@/components/theme-toggle'
// Remove icon imports
// import {
// 	LayoutGrid,
// 	PiggyBank,
// 	TrendingUp,
// 	BarChart3,
// 	History,
// 	Target,
// 	Menu,
// 	X,
// } from 'lucide-react'
// Remove Button import
// import { Button } from '@/components/ui/button'
// Remove cn import
// import { cn } from '@/lib/utils'

// Remove navItems array
// const navItems = [
// 	{ id: 'dashboard', label: 'Overview', icon: LayoutGrid },
// 	{ id: 'savings', label: 'Savings', icon: PiggyBank },
// 	{ id: 'investments', label: 'Invest', icon: TrendingUp },
// 	{ id: 'yearly', label: 'Analysis', icon: BarChart3 },
// 	{ id: 'plans', label: 'Plans', icon: Target },
// 	{ id: 'history', label: 'History', icon: History },
// ]

export default function Home() {
	// Remove state variables
	// const [activeView, setActiveView] = useState('dashboard')
	// const [isSidebarOpen, setIsSidebarOpen] = useState(false)
	// const [isMobile, setIsMobile] = useState(false)

	// Remove all useEffect hooks

	// Remove handleNavClick function

	// Remove renderContent function

	// Return only the Dashboard component
	// The outer div structure is now handled by AppShell in layout.tsx
	return <Dashboard />
}
