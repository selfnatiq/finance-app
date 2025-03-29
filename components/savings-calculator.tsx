'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { PiggyBank, TrendingUp, Calendar, Info } from 'lucide-react'
import { ChfIcon } from '@/components/ui/chf-icon'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ChfNumberInput } from '@/components/ui/chf-number-input'

export default function SavingsCalculator() {
	const [monthlySavings, setMonthlySavings] = useState(() => {
		if (typeof window !== 'undefined') {
			// Try to get the savings value from localStorage (set by Dashboard)
			const dashboardSavings = localStorage.getItem('currentSavings')
			if (dashboardSavings && !isNaN(Number(dashboardSavings))) {
				return Number(dashboardSavings)
			}
		}
		return 500 // Default to 500 if no value is found
	})
	const [years, setYears] = useState(5)
	const [totalSavings, setTotalSavings] = useState(0)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		// Simulate loading state for better UX
		const timer = setTimeout(() => {
			setIsLoading(false)
		}, 500)
		return () => clearTimeout(timer)
	}, [])

	useEffect(() => {
		calculateTotalSavings()
	}, [monthlySavings, years])

	const calculateTotalSavings = () => {
		const total = monthlySavings * 12 * years
		setTotalSavings(total)
	}

	// Listen for changes to the Dashboard's savings value
	useEffect(() => {
		const handleStorageChange = () => {
			if (typeof window !== 'undefined') {
				const dashboardSavings = localStorage.getItem('currentSavings')
				if (dashboardSavings && !isNaN(Number(dashboardSavings))) {
					setMonthlySavings(Number(dashboardSavings))
				}
			}
		}

		// Listen for storage events
		window.addEventListener('storage', handleStorageChange)

		return () => {
			window.removeEventListener('storage', handleStorageChange)
		}
	}, [])

	// Format numbers with Swiss formatting
	const formatNumber = (num: number) => {
		return num.toLocaleString('de-CH', {
			maximumFractionDigits: 2,
			minimumFractionDigits: 2,
		})
	}

	return (
		<div className="grid gap-4 md:grid-cols-2">
			<Card className="card-hover border-l-4 border-l-navy compact-card">
				<CardHeader className="card-header">
					<CardTitle className="flex items-center gap-2 text-base">
						<PiggyBank className="h-4 w-4 text-navy" />
						Savings Calculator
					</CardTitle>
					<CardDescription className="text-xs">Calculate your future savings</CardDescription>
				</CardHeader>
				<CardContent className="card-content">
					{isLoading ? (
						<div className="space-y-4 animate-pulse">
							<div className="h-16 bg-muted rounded-md"></div>
							<div className="h-16 bg-muted rounded-md"></div>
						</div>
					) : (
						<div className="space-y-4">
							<div className="compact-form-group">
								<div className="flex items-center justify-between">
									<Label
										htmlFor="monthly-savings"
										className="compact-label flex items-center gap-1"
									>
										Monthly Savings
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Info className="h-3 w-3 text-muted-foreground cursor-help" />
												</TooltipTrigger>
												<TooltipContent>
													<p>Amount you can save each month in CHF</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</Label>
									<span className="text-xs font-medium bg-secondary px-1.5 py-0.5 rounded-md">
										CHF {formatNumber(monthlySavings)}
									</span>
								</div>
								<div className="relative">
									<ChfNumberInput
										id="monthly-savings"
										value={monthlySavings}
										onChange={(value) => {
											setMonthlySavings(value)
										}}
										className="compact-input"
										placeholder="Monthly savings in CHF"
									/>
								</div>
							</div>

							<div className="compact-form-group">
								<div className="flex items-center justify-between">
									<Label htmlFor="years" className="compact-label flex items-center gap-1">
										Time Period
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Info className="h-3 w-3 text-muted-foreground cursor-help" />
												</TooltipTrigger>
												<TooltipContent>
													<p>Number of years to calculate savings</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</Label>
									<span className="text-xs font-medium bg-secondary px-1.5 py-0.5 rounded-md">
										{years} {years === 1 ? 'year' : 'years'}
									</span>
								</div>
								<Slider
									id="years"
									min={1}
									max={30}
									step={1}
									value={[years]}
									onValueChange={(value) => setYears(value[0])}
									className="py-3"
								/>
								<div className="flex justify-between text-xs text-muted-foreground">
									<span>1 year</span>
									<span>15 years</span>
									<span>30 years</span>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			<Card className="card-hover border-l-4 border-l-navy compact-card">
				<CardHeader className="card-header">
					<CardTitle className="flex items-center gap-2 text-base">
						<TrendingUp className="h-4 w-4 text-navy" />
						Savings Projection
					</CardTitle>
					<CardDescription className="text-xs">Your projected savings over time</CardDescription>
				</CardHeader>
				<CardContent className="card-content">
					{isLoading ? (
						<div className="space-y-4 animate-pulse">
							<div className="grid grid-cols-2 gap-3">
								<div className="h-16 bg-muted rounded-md"></div>
								<div className="h-16 bg-muted rounded-md"></div>
							</div>
							<div className="h-32 bg-muted rounded-md"></div>
						</div>
					) : (
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-3">
								<Card className="bg-secondary/30 border-none">
									<CardContent className="p-2.5">
										<div className="text-xs text-muted-foreground">Total Savings</div>
										<div className="text-base font-bold">CHF {formatNumber(totalSavings)}</div>
									</CardContent>
								</Card>
								<Card className="bg-secondary/30 border-none">
									<CardContent className="p-2.5">
										<div className="text-xs text-muted-foreground">Annual Savings</div>
										<div className="text-base font-bold">
											CHF {formatNumber(monthlySavings * 12)}
										</div>
									</CardContent>
								</Card>
							</div>

							<div className="space-y-1.5">
								<h3 className="text-xs font-medium flex items-center gap-1">
									Savings Milestones
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Info className="h-3 w-3 text-muted-foreground cursor-help" />
											</TooltipTrigger>
											<TooltipContent>
												<p>Your savings at different time periods</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</h3>
								<div className="space-y-1 bg-secondary/20 rounded-lg p-2.5 max-h-[180px] overflow-y-auto">
									{[1, 2, 3, 5, 10, 15, 20, 25, 30]
										.filter((y) => y <= years)
										.map((milestone) => (
											<div
												key={milestone}
												className="flex items-center justify-between group hover:bg-secondary/30 p-1.5 rounded-md transition-colors"
											>
												<div className="flex items-center gap-1.5">
													<Calendar className="h-3.5 w-3.5 text-navy" />
													<span className="text-xs">
														{milestone} {milestone === 1 ? 'year' : 'years'}
													</span>
												</div>
												<span className="text-xs font-medium">
													CHF {formatNumber(monthlySavings * 12 * milestone)}
												</span>
											</div>
										))}
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
