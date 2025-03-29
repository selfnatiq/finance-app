'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { Calendar, ArrowUpRight, ArrowDownRight, MinusCircle } from 'lucide-react'
import { format } from 'date-fns'
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
} from 'recharts'

type BudgetEntry = {
	id: string
	date: Date
	income: number
	expenses: number
	savings: number
	savingsRate: number
}

// Replace the formatNumber function with Swiss formatting (add this function)
const formatNumber = (num: number) => {
	return num.toLocaleString('de-CH', {
		maximumFractionDigits: 2,
		minimumFractionDigits: 2,
	})
}

export default function BudgetHistory() {
	const { toast } = useToast()
	const [budgetHistory, setBudgetHistory] = useState<BudgetEntry[]>(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('budgetHistory')
			if (saved) {
				// Parse the dates properly from localStorage
				const parsed = JSON.parse(saved)

				return parsed.map((entry: any) => ({
					id: entry.id,
					date: new Date(entry.date),
					income: entry.income,
					expenses: entry.expenses,
					savings: entry.savings,
					savingsRate: entry.income > 0 ? (entry.savings / entry.income) * 100 : 0,
				}))
			}
		}
		return []
	})

	const deleteHistoryEntry = (id: string) => {
		if (window.confirm('Are you sure you want to delete this budget entry?')) {
			const updatedHistory = budgetHistory.filter((entry) => entry.id !== id)
			setBudgetHistory(updatedHistory)

			// Update localStorage
			if (typeof window !== 'undefined') {
				localStorage.setItem('budgetHistory', JSON.stringify(updatedHistory))

				toast({
					title: 'Entry Deleted',
					description: 'The budget entry has been removed from history.',
				})
			}
		}
	}

	// Calculate trends
	const calculateTrend = (current: number, previous: number) => {
		if (!previous) return 0
		return ((current - previous) / previous) * 100
	}

	return (
		<div className="space-y-4">
			<Card className="compact-card border-l-4 border-l-navy">
				<CardHeader className="card-header">
					<CardTitle className="flex items-center gap-2 text-base">
						<Calendar className="h-4 w-4 text-navy" />
						Budget History
					</CardTitle>
					<CardDescription className="text-xs">
						Track your monthly budget and savings over time
					</CardDescription>
				</CardHeader>
				<CardContent className="card-content">
					{budgetHistory.length === 0 ? (
						<div className="text-center py-6">
							<p className="text-xs text-muted-foreground">
								No budget history yet. Save your first budget to start tracking.
							</p>
						</div>
					) : (
						<div className="space-y-4">
							<div className="rounded-md border bg-card">
								<Table>
									<TableHeader>
										<TableRow className="hover:bg-transparent">
											<TableHead className="text-xs font-medium text-muted-foreground">
												Month
											</TableHead>
											<TableHead className="text-xs font-medium text-muted-foreground text-right">
												Income
											</TableHead>
											<TableHead className="text-xs font-medium text-muted-foreground text-right">
												Expenses
											</TableHead>
											<TableHead className="text-xs font-medium text-muted-foreground text-right">
												Savings
											</TableHead>
											<TableHead className="text-xs font-medium text-muted-foreground text-right">
												Savings Rate
											</TableHead>
											<TableHead className="text-xs font-medium text-muted-foreground text-right">
												Actions
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{budgetHistory.map((entry, index) => {
											const prevEntry = index > 0 ? budgetHistory[index - 1] : null
											const savingsTrend = prevEntry
												? calculateTrend(entry.savings, prevEntry.savings)
												: 0

											return (
												<TableRow key={entry.id} className="hover:bg-muted/50 transition-colors">
													<TableCell className="text-xs font-medium py-3">
														{format(entry.date, 'MMM yyyy')}
													</TableCell>
													<TableCell className="text-xs text-right py-3">
														<span className="font-medium">CHF {formatNumber(entry.income)}</span>
													</TableCell>
													<TableCell className="text-xs text-right py-3">
														<span className="font-medium">CHF {formatNumber(entry.expenses)}</span>
													</TableCell>
													<TableCell className="text-xs text-right py-3">
														<div className="flex items-center justify-end gap-1">
															<span className="font-medium">CHF {formatNumber(entry.savings)}</span>
															{savingsTrend !== 0 && (
																<span
																	className={savingsTrend > 0 ? 'text-green-500' : 'text-red-500'}
																>
																	{savingsTrend > 0 ? (
																		<ArrowUpRight className="h-3 w-3" />
																	) : (
																		<ArrowDownRight className="h-3 w-3" />
																	)}
																</span>
															)}
														</div>
													</TableCell>
													<TableCell className="text-xs text-right py-3">
														<span className="font-medium">{entry.savingsRate.toFixed(1)}%</span>
													</TableCell>
													<TableCell className="text-xs text-right py-3">
														<Button
															variant="ghost"
															size="sm"
															onClick={() => deleteHistoryEntry(entry.id)}
															className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
														>
															<MinusCircle className="h-3 w-3" />
														</Button>
													</TableCell>
												</TableRow>
											)
										})}
									</TableBody>
								</Table>
							</div>

							{budgetHistory.length >= 2 && (
								<Card className="bg-secondary/30 border-none">
									<CardHeader className="py-2 px-3">
										<CardTitle className="text-xs font-medium">Savings Trend</CardTitle>
									</CardHeader>
									<CardContent className="p-3">
										<div className="h-[150px]">
											<ResponsiveContainer width="100%" height="100%">
												<AreaChart
													data={[...budgetHistory].map((entry) => ({
														date: format(entry.date, 'MMM yyyy'),
														savings: entry.savings,
													}))}
													margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
												>
													<defs>
														<linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
															<stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
															<stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
														</linearGradient>
													</defs>
													<CartesianGrid
														strokeDasharray="3 3"
														vertical={false}
														stroke="hsl(var(--border))"
													/>
													<XAxis
														dataKey="date"
														axisLine={false}
														tickLine={false}
														tick={{ fontSize: 10 }}
													/>
													<YAxis hide axisLine={false} tickLine={false} />
													<Tooltip
														formatter={(value: number) => [`CHF ${formatNumber(value)}`, 'Savings']}
														contentStyle={{
															backgroundColor: 'hsl(var(--background))',
															border: '1px solid hsl(var(--border))',
															borderRadius: '0.5rem',
															fontSize: '0.75rem',
														}}
													/>
													<Area
														type="monotone"
														dataKey="savings"
														stroke="hsl(var(--primary))"
														strokeWidth={1.5}
														fillOpacity={1}
														fill="url(#colorSavings)"
													/>
												</AreaChart>
											</ResponsiveContainer>
										</div>
									</CardContent>
								</Card>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
