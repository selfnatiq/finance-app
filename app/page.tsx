import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Dashboard from '@/components/dashboard'
import SavingsCalculator from '@/components/savings-calculator'
import InvestmentCalculator from '@/components/investment-calculator'
import YearlyAnalysis from '@/components/yearly-analysis'
import BudgetHistory from '@/components/budget-history'

export default function Home() {
	return (
		<main className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 min-h-screen">
			<div className="mb-6 text-center">
				<h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 gradient-text">
					Finance App
				</h1>
				<p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
					Track your income, expenses, and savings
				</p>
			</div>

			<Tabs defaultValue="dashboard" className="w-full">
				<TabsList className="grid w-full grid-cols-5 mb-4 h-auto sm:h-10">
					<TabsTrigger value="dashboard" className="text-sm sm:text-base py-2 sm:py-1.5">
						Dashboard
					</TabsTrigger>
					<TabsTrigger value="savings" className="text-sm sm:text-base py-2 sm:py-1.5">
						Savings
					</TabsTrigger>
					<TabsTrigger value="investments" className="text-sm sm:text-base py-2 sm:py-1.5">
						Investments
					</TabsTrigger>
					<TabsTrigger value="yearly" className="text-sm sm:text-base py-2 sm:py-1.5">
						Yearly
					</TabsTrigger>
					<TabsTrigger value="history" className="text-sm sm:text-base py-2 sm:py-1.5">
						History
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
