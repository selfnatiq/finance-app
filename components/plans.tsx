'use client'

import { useState, useEffect } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { useToast } from '@/hooks/use-toast'
import {
	Home,
	Car,
	Briefcase,
	PlusCircle,
	Trash2,
	Calendar,
	TrendingUp,
	PiggyBank,
	CheckCircle2,
} from 'lucide-react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog'
import { ChfNumberInput } from '@/components/ui/chf-number-input'

type Plan = {
	id: string
	name: string
	type: 'house' | 'car' | 'education' | 'other'
	targetAmount: number
	currentSavings: number
	monthlySavings: number
	interestRate: number
	downPaymentPercentage: number
	createdAt: Date
}

const PLAN_TYPES = [
	{ id: 'house', label: 'House', icon: Home },
	{ id: 'car', label: 'Car', icon: Car },
	{ id: 'education', label: 'Education', icon: Briefcase },
	{ id: 'other', label: 'Other', icon: PiggyBank },
]

export default function Plans() {
	const { toast } = useToast()
	const [plans, setPlans] = useState<Plan[]>(() => {
		if (typeof window !== 'undefined') {
			const savedPlans = localStorage.getItem('financialPlans')
			return savedPlans
				? JSON.parse(savedPlans).map((plan: any) => ({
						...plan,
						createdAt: new Date(plan.createdAt),
				  }))
				: []
		}
		return []
	})

	const [isLoading, setIsLoading] = useState(true)
	const [showNewPlanDialog, setShowNewPlanDialog] = useState(false)
	const [showPlanDetailsDialog, setShowPlanDetailsDialog] = useState(false)
	const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

	// New plan form state
	const [newPlanName, setNewPlanName] = useState('')
	const [newPlanType, setNewPlanType] = useState<'house' | 'car' | 'education' | 'other'>('house')
	const [newPlanAmount, setNewPlanAmount] = useState(1500000) // Default to 1.5M for house
	const [newPlanCurrentSavings, setNewPlanCurrentSavings] = useState(0)
	const [newPlanMonthlySavings, setNewPlanMonthlySavings] = useState(2000)
	const [newPlanInterestRate, setNewPlanInterestRate] = useState(7)
	const [newPlanDownPayment, setNewPlanDownPayment] = useState(20) // Default 20% for Swiss mortgages

	// Monthly savings from the main app
	const [currentMonthlySavings, setCurrentMonthlySavings] = useState(() => {
		if (typeof window !== 'undefined') {
			const savedSavings = localStorage.getItem('currentSavings')
			return savedSavings ? Number(savedSavings) : 0
		}
		return 0
	})

	useEffect(() => {
		// Simulate loading state for better UX
		const timer = setTimeout(() => {
			setIsLoading(false)
		}, 500)
		return () => clearTimeout(timer)
	}, [])

	useEffect(() => {
		if (typeof window !== 'undefined' && plans.length > 0) {
			localStorage.setItem('financialPlans', JSON.stringify(plans))
		}
	}, [plans])

	// Listen for changes to monthly savings
	useEffect(() => {
		const handleStorageChange = () => {
			if (typeof window !== 'undefined') {
				const savedSavings = localStorage.getItem('currentSavings')
				if (savedSavings) {
					setCurrentMonthlySavings(Number(savedSavings))
				}
			}
		}

		window.addEventListener('storage', handleStorageChange)
		return () => {
			window.removeEventListener('storage', handleStorageChange)
		}
	}, [])

	const createNewPlan = () => {
		if (!newPlanName) {
			toast({
				title: 'Error',
				description: 'Please enter a name for your plan',
				variant: 'destructive',
			})
			return
		}

		const newPlan: Plan = {
			id: Date.now().toString(),
			name: newPlanName,
			type: newPlanType,
			targetAmount: newPlanAmount,
			currentSavings: newPlanCurrentSavings,
			monthlySavings: newPlanMonthlySavings,
			interestRate: newPlanInterestRate,
			downPaymentPercentage: newPlanDownPayment,
			createdAt: new Date(),
		}

		setPlans([...plans, newPlan])
		setShowNewPlanDialog(false)
		resetNewPlanForm()

		toast({
			title: 'Plan Created',
			description: `Your plan "${newPlanName}" has been created.`,
		})
	}

	const deletePlan = (id: string) => {
		const planToDelete = plans.find((plan) => plan.id === id)
		const updatedPlans = plans.filter((plan) => plan.id !== id)
		setPlans(updatedPlans)

		toast({
			title: 'Plan Deleted',
			description: `Your plan "${planToDelete?.name}" has been deleted.`,
		})
	}

	const viewPlanDetails = (plan: Plan) => {
		setSelectedPlan(plan)
		setShowPlanDetailsDialog(true)
	}

	const resetNewPlanForm = () => {
		setNewPlanName('')
		setNewPlanType('house')
		setNewPlanAmount(1500000)
		setNewPlanCurrentSavings(0)
		setNewPlanMonthlySavings(currentMonthlySavings > 0 ? currentMonthlySavings : 2000)
		setNewPlanInterestRate(7)
		setNewPlanDownPayment(20)
	}

	// Calculate how long it will take to reach the target amount
	const calculateTimeToTarget = (plan: Plan, withInvestment = false) => {
		const { targetAmount, currentSavings, monthlySavings, interestRate, downPaymentPercentage } =
			plan

		// For house, we only need to save for the down payment
		const actualTargetAmount =
			plan.type === 'house' ? targetAmount * (downPaymentPercentage / 100) : targetAmount

		const remainingAmount = actualTargetAmount - currentSavings

		if (remainingAmount <= 0) return 0
		if (monthlySavings <= 0) return Number.POSITIVE_INFINITY

		if (!withInvestment) {
			// Simple calculation without investment returns
			return Math.ceil(remainingAmount / monthlySavings)
		} else {
			// Compound interest calculation
			const monthlyRate = interestRate / 100 / 12
			let accumulated = currentSavings
			let months = 0

			while (accumulated < actualTargetAmount && months < 1200) {
				// Cap at 100 years
				accumulated = accumulated * (1 + monthlyRate) + monthlySavings
				months++
			}

			return months
		}
	}

	// Format numbers with Swiss formatting
	const formatNumber = (num: number) => {
		return num.toLocaleString('de-CH', {
			maximumFractionDigits: 2,
			minimumFractionDigits: 2,
		})
	}

	// Format months as years and months
	const formatTimeframe = (months: number) => {
		if (months === Number.POSITIVE_INFINITY) return 'Never (increase savings)'
		if (months === 0) return 'Already achieved!'

		const years = Math.floor(months / 12)
		const remainingMonths = months % 12

		if (years === 0) {
			return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`
		} else if (remainingMonths === 0) {
			return `${years} year${years !== 1 ? 's' : ''}`
		} else {
			return `${years} year${years !== 1 ? 's' : ''} and ${remainingMonths} month${
				remainingMonths !== 1 ? 's' : ''
			}`
		}
	}

	// Get icon for plan type
	const getPlanTypeIcon = (type: string) => {
		const planType = PLAN_TYPES.find((t) => t.id === type)
		if (!planType) return PiggyBank
		return planType.icon
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">Your Financial Plans</h2>
				<Button
					onClick={() => {
						resetNewPlanForm()
						setShowNewPlanDialog(true)
					}}
					className="rounded-xl"
				>
					<PlusCircle className="mr-2 h-4 w-4" />
					Create New Plan
				</Button>
			</div>

			{isLoading ? (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
					{[1, 2, 3].map((i) => (
						<div key={i} className="h-64 bg-muted rounded-xl"></div>
					))}
				</div>
			) : plans.length === 0 ? (
				<Card className="p-8 text-center">
					<div className="flex flex-col items-center gap-3">
						<PiggyBank className="h-12 w-12 text-muted-foreground" />
						<h3 className="text-xl font-medium">No plans yet</h3>
						<p className="text-muted-foreground max-w-md mx-auto">
							Create your first financial plan to track your progress towards your goals, like
							buying a house, a car, or saving for education.
						</p>
						<Button
							onClick={() => {
								resetNewPlanForm()
								setShowNewPlanDialog(true)
							}}
							className="mt-2"
						>
							<PlusCircle className="mr-2 h-4 w-4" />
							Create Your First Plan
						</Button>
					</div>
				</Card>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{plans.map((plan) => {
						const PlanIcon = getPlanTypeIcon(plan.type)
						const timeWithoutInvestment = calculateTimeToTarget(plan, false)
						const timeWithInvestment = calculateTimeToTarget(plan, true)
						const actualTargetAmount =
							plan.type === 'house'
								? plan.targetAmount * (plan.downPaymentPercentage / 100)
								: plan.targetAmount
						const progress = Math.min(100, (plan.currentSavings / actualTargetAmount) * 100)

						return (
							<Card key={plan.id} className="overflow-hidden hover:shadow-md transition-shadow">
								<CardHeader className="pb-2">
									<div className="flex justify-between items-start">
										<div className="flex items-center gap-2">
											<div className="p-1.5 bg-primary/10 rounded-lg">
												<PlanIcon className="h-5 w-5 text-primary" />
											</div>
											<CardTitle className="text-lg">{plan.name}</CardTitle>
										</div>
										<div className="flex gap-1">
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 rounded-full"
												onClick={() => deletePlan(plan.id)}
											>
												<Trash2 className="h-4 w-4 text-muted-foreground" />
											</Button>
										</div>
									</div>
									<CardDescription>
										Target: CHF {formatNumber(plan.targetAmount)}
										{plan.type === 'house' && (
											<>
												{' '}
												(Down payment: CHF{' '}
												{formatNumber((plan.targetAmount * plan.downPaymentPercentage) / 100)})
											</>
										)}
									</CardDescription>
								</CardHeader>
								<CardContent className="pb-2">
									<div className="space-y-3">
										<div className="space-y-1">
											<div className="flex justify-between text-sm">
												<span className="text-muted-foreground">Progress</span>
												<span className="font-medium">{progress.toFixed(1)}%</span>
											</div>
											<Progress value={progress} className="h-2" />
										</div>

										<div className="grid grid-cols-2 gap-2 text-sm">
											<div className="bg-secondary/30 p-2 rounded-lg">
												<div className="text-muted-foreground">Current Savings</div>
												<div className="font-medium">CHF {formatNumber(plan.currentSavings)}</div>
											</div>
											<div className="bg-secondary/30 p-2 rounded-lg">
												<div className="text-muted-foreground">Monthly Contribution</div>
												<div className="font-medium">CHF {formatNumber(plan.monthlySavings)}</div>
											</div>
										</div>

										<div className="grid grid-cols-2 gap-2 text-sm">
											<div className="bg-secondary/30 p-2 rounded-lg">
												<div className="text-muted-foreground flex items-center gap-1">
													<Calendar className="h-3 w-3" />
													<span>Without Investment</span>
												</div>
												<div className="font-medium">{formatTimeframe(timeWithoutInvestment)}</div>
											</div>
											<div className="bg-primary/10 p-2 rounded-lg">
												<div className="text-muted-foreground flex items-center gap-1">
													<TrendingUp className="h-3 w-3" />
													<span>With {plan.interestRate}% Return</span>
												</div>
												<div className="font-medium">{formatTimeframe(timeWithInvestment)}</div>
											</div>
										</div>
									</div>
								</CardContent>
								<CardFooter className="pt-2">
									<Button
										variant="outline"
										className="w-full text-sm h-9 rounded-xl"
										onClick={() => viewPlanDetails(plan)}
									>
										View Details
									</Button>
								</CardFooter>
							</Card>
						)
					})}
				</div>
			)}

			{/* New Plan Dialog */}
			<Dialog open={showNewPlanDialog} onOpenChange={setShowNewPlanDialog}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Create New Financial Plan</DialogTitle>
						<DialogDescription>
							Set up a plan to track your progress towards a financial goal
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-2">
						<div className="space-y-2">
							<Label htmlFor="plan-name">Plan Name</Label>
							<Input
								id="plan-name"
								placeholder="e.g., Dream House, New Car"
								value={newPlanName}
								onChange={(e) => setNewPlanName(e.target.value)}
							/>
						</div>

						<div className="space-y-2">
							<Label>Plan Type</Label>
							<div className="grid grid-cols-4 gap-2">
								{PLAN_TYPES.map((type) => {
									const Icon = type.icon
									return (
										<Button
											key={type.id}
											type="button"
											variant={newPlanType === type.id ? 'default' : 'outline'}
											className="flex flex-col items-center py-2 h-auto"
											onClick={() => {
												setNewPlanType(type.id as any)
												// Set default values based on type
												if (type.id === 'house') {
													setNewPlanAmount(1500000)
													setNewPlanDownPayment(20)
												} else if (type.id === 'car') {
													setNewPlanAmount(50000)
													setNewPlanDownPayment(100)
												} else if (type.id === 'education') {
													setNewPlanAmount(100000)
													setNewPlanDownPayment(100)
												} else {
													setNewPlanAmount(10000)
													setNewPlanDownPayment(100)
												}
											}}
										>
											<Icon className="h-5 w-5 mb-1" />
											<span className="text-xs">{type.label}</span>
										</Button>
									)
								})}
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex justify-between">
								<Label htmlFor="target-amount">Target Amount (CHF)</Label>
								<span className="text-sm font-medium">CHF {formatNumber(newPlanAmount)}</span>
							</div>
							<ChfNumberInput
								id="target-amount"
								value={newPlanAmount}
								onChange={(value) => setNewPlanAmount(value)}
								placeholder="Target amount in CHF"
							/>
						</div>

						{newPlanType === 'house' && (
							<div className="space-y-2">
								<div className="flex justify-between">
									<Label htmlFor="down-payment">Down Payment (%)</Label>
									<span className="text-sm font-medium">
										{newPlanDownPayment}% (CHF{' '}
										{formatNumber((newPlanAmount * newPlanDownPayment) / 100)})
									</span>
								</div>
								<Slider
									id="down-payment"
									min={10}
									max={100}
									step={5}
									value={[newPlanDownPayment]}
									onValueChange={(value) => setNewPlanDownPayment(value[0])}
								/>
								<div className="text-xs text-muted-foreground">
									In Switzerland, typical mortgage requires 20% down payment
								</div>
							</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="current-savings">Current Savings (CHF)</Label>
							<ChfNumberInput
								id="current-savings"
								value={newPlanCurrentSavings}
								onChange={(value) => setNewPlanCurrentSavings(value)}
								placeholder="Current savings in CHF"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="monthly-savings">Monthly Contribution (CHF)</Label>
							<ChfNumberInput
								id="monthly-savings"
								value={newPlanMonthlySavings}
								onChange={(value) => setNewPlanMonthlySavings(value)}
								placeholder="Monthly contribution in CHF"
							/>
							{currentMonthlySavings > 0 && (
								<Button
									variant="outline"
									size="sm"
									className="w-full mt-1 text-xs"
									onClick={() => setNewPlanMonthlySavings(currentMonthlySavings)}
								>
									Use Current Monthly Savings (CHF {formatNumber(currentMonthlySavings)})
								</Button>
							)}
						</div>

						<div className="space-y-2">
							<div className="flex justify-between">
								<Label htmlFor="interest-rate">Expected Annual Return (%)</Label>
								<span className="text-sm font-medium">{newPlanInterestRate}%</span>
							</div>
							<Slider
								id="interest-rate"
								min={0}
								max={15}
								step={0.5}
								value={[newPlanInterestRate]}
								onValueChange={(value) => setNewPlanInterestRate(value[0])}
							/>
							<div className="text-xs text-muted-foreground">
								Historical average for diversified portfolio is around 7%
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setShowNewPlanDialog(false)}>
							Cancel
						</Button>
						<Button onClick={createNewPlan}>Create Plan</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Plan Details Dialog */}
			{selectedPlan && (
				<Dialog open={showPlanDetailsDialog} onOpenChange={setShowPlanDetailsDialog}>
					<DialogContent className="sm:max-w-lg">
						<DialogHeader>
							<DialogTitle className="flex items-center gap-2">
								{(() => {
									const Icon = getPlanTypeIcon(selectedPlan.type)
									return <Icon className="h-5 w-5 text-primary" />
								})()}
								{selectedPlan.name}
							</DialogTitle>
							<DialogDescription>
								Detailed breakdown and projections for your financial plan
							</DialogDescription>
						</DialogHeader>

						<div className="space-y-4 py-2">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1">
									<div className="text-sm text-muted-foreground">Target Amount</div>
									<div className="text-lg font-bold">
										CHF {formatNumber(selectedPlan.targetAmount)}
									</div>
								</div>

								{selectedPlan.type === 'house' && (
									<div className="space-y-1">
										<div className="text-sm text-muted-foreground">
											Down Payment ({selectedPlan.downPaymentPercentage}%)
										</div>
										<div className="text-lg font-bold">
											CHF{' '}
											{formatNumber(
												(selectedPlan.targetAmount * selectedPlan.downPaymentPercentage) / 100
											)}
										</div>
									</div>
								)}

								<div className="space-y-1">
									<div className="text-sm text-muted-foreground">Current Savings</div>
									<div className="text-lg font-bold">
										CHF {formatNumber(selectedPlan.currentSavings)}
									</div>
								</div>

								<div className="space-y-1">
									<div className="text-sm text-muted-foreground">Monthly Contribution</div>
									<div className="text-lg font-bold">
										CHF {formatNumber(selectedPlan.monthlySavings)}
									</div>
								</div>
							</div>

							<div className="space-y-2">
								<h3 className="text-sm font-medium">Progress</h3>
								<div className="space-y-1">
									{(() => {
										const actualTargetAmount =
											selectedPlan.type === 'house'
												? selectedPlan.targetAmount * (selectedPlan.downPaymentPercentage / 100)
												: selectedPlan.targetAmount
										const progress = Math.min(
											100,
											(selectedPlan.currentSavings / actualTargetAmount) * 100
										)
										const remaining = actualTargetAmount - selectedPlan.currentSavings

										return (
											<>
												<div className="flex justify-between text-sm">
													<span>Current progress</span>
													<span className="font-medium">{progress.toFixed(1)}%</span>
												</div>
												<Progress value={progress} className="h-2" />
												<div className="text-sm text-muted-foreground pt-1">
													{remaining > 0
														? `You still need CHF ${formatNumber(remaining)} to reach your goal.`
														: "Congratulations! You've reached your savings goal."}
												</div>
											</>
										)
									})()}
								</div>
							</div>

							<Tabs defaultValue="timeline" className="w-full">
								<TabsList className="grid w-full grid-cols-2">
									<TabsTrigger value="timeline">Timeline</TabsTrigger>
									<TabsTrigger value="comparison">Comparison</TabsTrigger>
								</TabsList>

								<TabsContent value="timeline" className="space-y-4 pt-4">
									<div className="space-y-2">
										<h3 className="text-sm font-medium">Estimated Time to Goal</h3>

										<div className="grid grid-cols-2 gap-4">
											<Card className="bg-secondary/30 border-none">
												<CardContent className="p-3">
													<div className="flex items-center gap-1 text-sm text-muted-foreground">
														<Calendar className="h-4 w-4" />
														<span>Without Investment</span>
													</div>
													<div className="text-lg font-bold">
														{formatTimeframe(calculateTimeToTarget(selectedPlan, false))}
													</div>
												</CardContent>
											</Card>

											<Card className="bg-primary/10 border-none">
												<CardContent className="p-3">
													<div className="flex items-center gap-1 text-sm text-muted-foreground">
														<TrendingUp className="h-4 w-4" />
														<span>With {selectedPlan.interestRate}% Return</span>
													</div>
													<div className="text-lg font-bold">
														{formatTimeframe(calculateTimeToTarget(selectedPlan, true))}
													</div>
												</CardContent>
											</Card>
										</div>

										<div className="text-sm text-muted-foreground pt-1">
											{(() => {
												const timeWithoutInvestment = calculateTimeToTarget(selectedPlan, false)
												const timeWithInvestment = calculateTimeToTarget(selectedPlan, true)
												const difference = timeWithoutInvestment - timeWithInvestment

												if (difference <= 0) return null
												return `Investing your savings can help you reach your goal ${formatTimeframe(
													difference
												)} sooner.`
											})()}
										</div>
									</div>

									<div className="space-y-2">
										<h3 className="text-sm font-medium">Key Milestones</h3>

										<div className="space-y-2">
											{(() => {
												const actualTargetAmount =
													selectedPlan.type === 'house'
														? selectedPlan.targetAmount * (selectedPlan.downPaymentPercentage / 100)
														: selectedPlan.targetAmount
												const milestones = [25, 50, 75, 100]

												return milestones.map((milestone) => {
													const milestoneAmount = actualTargetAmount * (milestone / 100)
													const currentProgress =
														(selectedPlan.currentSavings / actualTargetAmount) * 100
													const isReached = currentProgress >= milestone

													// Calculate months to reach this milestone
													let monthsToMilestone
													if (isReached) {
														monthsToMilestone = 0
													} else {
														const remainingForMilestone =
															milestoneAmount - selectedPlan.currentSavings

														// Without investment
														const monthsWithoutInvestment = Math.ceil(
															remainingForMilestone / selectedPlan.monthlySavings
														)

														// With investment
														const monthlyRate = selectedPlan.interestRate / 100 / 12
														let accumulated = selectedPlan.currentSavings
														let months = 0

														while (accumulated < milestoneAmount && months < 1200) {
															accumulated =
																accumulated * (1 + monthlyRate) + selectedPlan.monthlySavings
															months++
														}

														monthsToMilestone = months
													}

													return (
														<div
															key={milestone}
															className={`flex items-center justify-between p-2 rounded-lg ${
																isReached ? 'bg-positive/10' : 'bg-secondary/30'
															}`}
														>
															<div className="flex items-center gap-2">
																{isReached ? (
																	<CheckCircle2 className="h-4 w-4 text-positive" />
																) : (
																	<div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
																)}
																<div>
																	<div className="text-sm font-medium">{milestone}% Complete</div>
																	<div className="text-xs text-muted-foreground">
																		CHF {formatNumber(milestoneAmount)}
																	</div>
																</div>
															</div>
															<div className="text-sm">
																{isReached ? (
																	<span className="text-positive">Reached</span>
																) : (
																	<span>{formatTimeframe(monthsToMilestone)}</span>
																)}
															</div>
														</div>
													)
												})
											})()}
										</div>
									</div>
								</TabsContent>

								<TabsContent value="comparison" className="space-y-4 pt-4">
									<div className="space-y-2">
										<h3 className="text-sm font-medium">Savings vs. Investment Growth</h3>

										<div className="space-y-3">
											{(() => {
												const actualTargetAmount =
													selectedPlan.type === 'house'
														? selectedPlan.targetAmount * (selectedPlan.downPaymentPercentage / 100)
														: selectedPlan.targetAmount
												const timeframes = [1, 3, 5, 10, 15, 20]

												return timeframes.map((years) => {
													const months = years * 12
													const regularSavings =
														selectedPlan.currentSavings + selectedPlan.monthlySavings * months

													// Calculate compound growth
													const monthlyRate = selectedPlan.interestRate / 100 / 12
													let investmentGrowth = selectedPlan.currentSavings

													for (let i = 0; i < months; i++) {
														investmentGrowth =
															investmentGrowth * (1 + monthlyRate) + selectedPlan.monthlySavings
													}

													const difference = investmentGrowth - regularSavings
													const percentageGain =
														regularSavings > 0
															? ((investmentGrowth - regularSavings) / regularSavings) * 100
															: 0

													return (
														<div key={years} className="grid grid-cols-3 gap-2 text-sm">
															<div className="font-medium">
																{years} {years === 1 ? 'year' : 'years'}
															</div>
															<div>CHF {formatNumber(regularSavings)}</div>
															<div className="text-primary">
																CHF {formatNumber(investmentGrowth)}
																<span className="text-xs ml-1 text-positive">
																	(+{percentageGain.toFixed(1)}%)
																</span>
															</div>
														</div>
													)
												})
											})()}
										</div>

										<div className="pt-2 text-xs text-muted-foreground">
											<div className="grid grid-cols-3 gap-2">
												<div></div>
												<div>Regular Savings</div>
												<div>With {selectedPlan.interestRate}% Return</div>
											</div>
										</div>
									</div>

									<div className="space-y-2">
										<h3 className="text-sm font-medium">Mortgage Details</h3>

										{selectedPlan.type === 'house' ? (
											<div className="space-y-3">
												<div className="grid grid-cols-2 gap-3">
													<div className="bg-secondary/30 p-2 rounded-lg">
														<div className="text-sm text-muted-foreground">Down Payment</div>
														<div className="text-base font-medium">
															CHF{' '}
															{formatNumber(
																(selectedPlan.targetAmount * selectedPlan.downPaymentPercentage) /
																	100
															)}
															<span className="text-xs ml-1">
																({selectedPlan.downPaymentPercentage}%)
															</span>
														</div>
													</div>

													<div className="bg-secondary/30 p-2 rounded-lg">
														<div className="text-sm text-muted-foreground">Mortgage Amount</div>
														<div className="text-base font-medium">
															CHF{' '}
															{formatNumber(
																selectedPlan.targetAmount *
																	(1 - selectedPlan.downPaymentPercentage / 100)
															)}
															<span className="text-xs ml-1">
																({100 - selectedPlan.downPaymentPercentage}%)
															</span>
														</div>
													</div>
												</div>

												<div className="text-sm text-muted-foreground">
													In Switzerland, typical mortgages require a 20% down payment, with the
													remaining 80% financed through the mortgage. Of the 20% down payment, at
													least half (10% of the property value) must come from your own funds and
													cannot be borrowed from pension funds.
												</div>
											</div>
										) : (
											<div className="text-sm text-muted-foreground p-2 bg-secondary/30 rounded-lg">
												Mortgage details are only applicable for house purchase plans.
											</div>
										)}
									</div>
								</TabsContent>
							</Tabs>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</div>
	)
}
