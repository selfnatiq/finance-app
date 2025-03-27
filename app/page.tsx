import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Dashboard from '@/components/dashboard'
import SavingsCalculator from '@/components/savings-calculator'
import InvestmentCalculator from '@/components/investment-calculator'
import YearlyAnalysis from '@/components/yearly-analysis'
import BudgetHistory from '@/components/budget-history'

export default function Home() {
	return (
		<main className="container mx-auto py-4 px-3 md:px-4 lg:px-6 min-h-screen">
			<div className="mb-6 text-center">
				<h1 className="text-3xl font-bold tracking-tight mb-1 gradient-text">Finance App</h1>
				<p className="text-muted-foreground max-w-2xl mx-auto text-sm">
					Track your income, expenses, and savings
				</p>
			</div>

			<Tabs defaultValue="dashboard" className="w-full">
				<TabsList className="grid w-full grid-cols-5 mb-4">
					<TabsTrigger value="dashboard" className="text-xs md:text-sm">
						Dashboard
					</TabsTrigger>
					<TabsTrigger value="savings" className="text-xs md:text-sm">
						Savings
					</TabsTrigger>
					<TabsTrigger value="investments" className="text-xs md:text-sm">
						Investments
					</TabsTrigger>
					<TabsTrigger value="yearly" className="text-xs md:text-sm">
						Yearly Analysis
					</TabsTrigger>
					<TabsTrigger value="history" className="text-xs md:text-sm">
						Budget History
					</TabsTrigger>
				</TabsList>

				<TabsContent value="dashboard" className="mt-4 animate-in">
					<Dashboard />
				</TabsContent>

				<TabsContent value="savings" className="mt-4 animate-in">
					<SavingsCalculator />
				</TabsContent>

				<TabsContent value="investments" className="mt-4 animate-in">
					<InvestmentCalculator />
				</TabsContent>

				<TabsContent value="yearly" className="mt-4 animate-in">
					<YearlyAnalysis />
				</TabsContent>

				<TabsContent value="history" className="mt-4 animate-in">
					<BudgetHistory />
				</TabsContent>
			</Tabs>
		</main>
	)
}
