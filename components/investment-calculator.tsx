'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { TrendingUp, BarChart3, Info } from 'lucide-react'
import { ChfIcon } from '@/components/ui/chf-icon'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ChfNumberInput } from '@/components/ui/chf-number-input'

export default function InvestmentCalculator() {
	const [initialInvestment, setInitialInvestment] = useState(() => {
		if (typeof window !== 'undefined') {
			// Try to get the savings value from localStorage (set by Dashboard)
			const dashboardSavings = localStorage.getItem('currentSavings')
			if (dashboardSavings && !isNaN(Number(dashboardSavings))) {
				return Number(dashboardSavings) * 2 // Use twice the monthly savings as initial investment
			}
		}
		return 1000
	})
	const [monthlyContribution, setMonthlyContribution] = useState(() => {
		if (typeof window !== 'undefined') {
			// Try to get the savings value from localStorage (set by Dashboard)
			const dashboardSavings = localStorage.getItem('currentSavings')
			if (dashboardSavings && !isNaN(Number(dashboardSavings))) {
				return Number(dashboardSavings)
			}
		}
		return 500
	})
	const [annualReturn, setAnnualReturn] = useState(7)
	const [years, setYears] = useState(20)
	const [finalAmount, setFinalAmount] = useState(0)
	const [totalContributions, setTotalContributions] = useState(0)
	const [totalInterest, setTotalInterest] = useState(0)
	const [yearlyData, setYearlyData] = useState<{ year: number; amount: number }[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		// Simulate loading state for better UX
		const timer = setTimeout(() => {
			setIsLoading(false)
		}, 500)
		return () => clearTimeout(timer)
	}, [])

	useEffect(() => {
		calculateInvestment()
	}, [initialInvestment, monthlyContribution, annualReturn, years])

	// Listen for changes to the Dashboard's savings value
	useEffect(() => {
		const handleStorageChange = () => {
			if (typeof window !== 'undefined') {
				const dashboardSavings = localStorage.getItem('currentSavings')
				if (dashboardSavings && !isNaN(Number(dashboardSavings))) {
					setMonthlyContribution(Number(dashboardSavings))
				}
			}
		}

		window.addEventListener('storage', handleStorageChange)

		return () => {
			window.removeEventListener('storage', handleStorageChange)
		}
	}, [])

	const calculateInvestment = () => {
		const monthlyRate = annualReturn / 100 / 12
		const totalMonths = years * 12

		let balance = initialInvestment
		const yearlyResults: { year: number; amount: number }[] = []

		for (let month = 1; month <= totalMonths; month++) {
			balance = balance * (1 + monthlyRate) + monthlyContribution

			if (month % 12 === 0) {
				yearlyResults.push({
					year: month / 12,
					amount: balance,
				})
			}
		}

		setFinalAmount(balance)
		setTotalContributions(initialInvestment + monthlyContribution * totalMonths)
		setTotalInterest(balance - (initialInvestment + monthlyContribution * totalMonths))
		setYearlyData(yearlyResults)
	}

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
						<ChfIcon className="h-4 w-4 text-navy" />
						Investment Calculator
					</CardTitle>
					<CardDescription className="text-xs">
						Calculate your investment growth over time
					</CardDescription>
				</CardHeader>
				<CardContent className="card-content">
					{isLoading ? (
						<div className="space-y-3 animate-pulse">
							<div className="h-8 bg-muted rounded-md"></div>
							<div className="h-8 bg-muted rounded-md"></div>
							<div className="h-8 bg-muted rounded-md"></div>
							<div className="h-8 bg-muted rounded-md"></div>
						</div>
					) : (
						<div className="space-y-3">
							<div className="compact-form-group">
								<Label
									htmlFor="initial-investment"
									className="compact-label flex items-center gap-1"
								>
									Initial Investment
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Info className="h-3 w-3 text-muted-foreground cursor-help" />
											</TooltipTrigger>
											<TooltipContent>
												<p>One-time investment amount to start with in CHF</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</Label>
								<div className="relative">
									<ChfNumberInput
										id="initial-investment"
										value={initialInvestment}
										onChange={(value) => setInitialInvestment(value)}
										className="compact-input"
										placeholder="Initial investment in CHF"
									/>
								</div>
							</div>

							<div className="compact-form-group">
								<Label
									htmlFor="monthly-contribution"
									className="compact-label flex items-center gap-1"
								>
									Monthly Contribution
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Info className="h-3 w-3 text-muted-foreground cursor-help" />
											</TooltipTrigger>
											<TooltipContent>
												<p>Amount you'll add to your investment each month in CHF</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</Label>
								<div className="relative">
									<ChfNumberInput
										id="monthly-contribution"
										value={monthlyContribution}
										onChange={(value) => setMonthlyContribution(value)}
										className="compact-input"
										placeholder="Monthly contribution in CHF"
									/>
								</div>
							</div>

							<div className="compact-form-group">
								<div className="flex items-center justify-between">
									<Label htmlFor="annual-return" className="compact-label flex items-center gap-1">
										Annual Return (%)
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Info className="h-3 w-3 text-muted-foreground cursor-help" />
												</TooltipTrigger>
												<TooltipContent>
													<p>Expected annual return on your investment</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</Label>
									<span className="text-xs font-medium bg-secondary px-1.5 py-0.5 rounded-md">
										{annualReturn}%
									</span>
								</div>
								<Slider
									id="annual-return"
									min={1}
									max={15}
									step={0.1}
									value={[annualReturn]}
									onValueChange={(value) => setAnnualReturn(value[0])}
									className="py-3"
								/>
								<div className="flex justify-between text-xs text-muted-foreground">
									<span>1%</span>
									<span>7%</span>
									<span>15%</span>
								</div>
							</div>

							<div className="compact-form-group">
								<div className="flex items-center justify-between">
									<Label htmlFor="years" className="compact-label flex items-center gap-1">
										Investment Period
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Info className="h-3 w-3 text-muted-foreground cursor-help" />
												</TooltipTrigger>
												<TooltipContent>
													<p>Number of years you'll be investing</p>
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
									max={40}
									step={1}
									value={[years]}
									onValueChange={(value) => setYears(value[0])}
									className="py-3"
								/>
								<div className="flex justify-between text-xs text-muted-foreground">
									<span>1 year</span>
									<span>20 years</span>
									<span>40 years</span>
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
						Investment Projection
					</CardTitle>
					<CardDescription className="text-xs">Your projected investment growth</CardDescription>
				</CardHeader>
				<CardContent className="card-content">
					{isLoading ? (
						<div className="space-y-4 animate-pulse">
							<div className="h-16 bg-muted rounded-md"></div>
							<div className="grid grid-cols-2 gap-3">
								<div className="h-12 bg-muted rounded-md"></div>
								<div className="h-12 bg-muted rounded-md"></div>
							</div>
							<div className="h-32 bg-muted rounded-md"></div>
						</div>
					) : (
						<div className="space-y-4">
							<div className="grid grid-cols-1 gap-3">
								<Card className="bg-secondary/30 border-none">
									<CardContent className="p-2.5">
										<div className="text-xs text-muted-foreground">Final Amount</div>
										<div className="text-base font-bold text-positive">
											CHF {formatNumber(finalAmount)}
										</div>
									</CardContent>
								</Card>

								<div className="grid grid-cols-2 gap-3">
									<Card className="bg-secondary/30 border-none">
										<CardContent className="p-2.5">
											<div className="text-xs text-muted-foreground">Total Contributions</div>
											<div className="text-sm font-bold">
												CHF {formatNumber(totalContributions)}
											</div>
										</CardContent>
									</Card>
									<Card className="bg-secondary/30 border-none">
										<CardContent className="p-2.5">
											<div className="text-xs text-muted-foreground">Total Interest</div>
											<div className="text-sm font-bold text-primary">
												CHF {formatNumber(totalInterest)}
											</div>
										</CardContent>
									</Card>
								</div>
							</div>

							<div className="space-y-1.5">
								<h3 className="text-xs font-medium flex items-center gap-1.5">
									<BarChart3 className="h-3.5 w-3.5 text-navy" />
									Growth Milestones
								</h3>
								<div className="space-y-1 max-h-[160px] overflow-y-auto pr-1.5 bg-secondary/20 rounded-lg p-2.5">
									{yearlyData
										.filter((_, index) => index % 5 === 0 || index === yearlyData.length - 1)
										.map((data) => (
											<div
												key={data.year}
												className="flex items-center justify-between hover:bg-secondary/30 p-1.5 rounded-md transition-colors"
											>
												<span className="text-xs">Year {data.year}</span>
												<span className="text-xs font-medium">CHF {formatNumber(data.amount)}</span>
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
