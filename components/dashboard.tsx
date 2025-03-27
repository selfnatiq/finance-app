"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PlusCircle, MinusCircle, Wallet, TrendingUp, PiggyBank, Save, Info } from "lucide-react"
import { ChfIcon } from "@/components/ui/chf-icon"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Dashboard() {
  const { toast } = useToast()
  const [income, setIncome] = useState(() => {
    if (typeof window !== "undefined") {
      const savedIncome = localStorage.getItem("currentIncome")
      return savedIncome ? Number(savedIncome) : 0
    }
    return 0
  })

  const [expenses, setExpenses] = useState<{ id: string; name: string; amount: number }[]>(() => {
    if (typeof window !== "undefined") {
      const savedExpenses = localStorage.getItem("currentExpenses")
      return savedExpenses
        ? JSON.parse(savedExpenses)
        : [
            { id: "1", name: "Rent", amount: 0 },
            { id: "2", name: "Food", amount: 0 },
            { id: "3", name: "Health Insurance", amount: 0 },
          ]
    }
    return [
      { id: "1", name: "Rent", amount: 0 },
      { id: "2", name: "Food", amount: 0 },
      { id: "3", name: "Health Insurance", amount: 0 },
    ]
  })
  const [newExpenseName, setNewExpenseName] = useState("")
  const [newExpenseAmount, setNewExpenseAmount] = useState(0)
  const [savings, setSavings] = useState(0)
  const [savingsPercentage, setSavingsPercentage] = useState(0)
  const [budgetHistory, setBudgetHistory] = useState<
    {
      date: Date
      income: number
      expenses: number
      savings: number
    }[]
  >(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("budgetHistory")
      if (saved) {
        // Parse the dates properly from localStorage
        const parsed = JSON.parse(saved)
        return parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
        }))
      }
    }
    return []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading state for better UX
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    calculateSavings()
  }, [income, expenses])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("currentIncome", income.toString())
    }
  }, [income])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("currentExpenses", JSON.stringify(expenses))
    }
  }, [expenses])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("currentSavings", savings.toString())
    }
  }, [savings])

  useEffect(() => {
    const handleStorageChange = () => {
      const savedIncome = localStorage.getItem("currentIncome")
      if (savedIncome) {
        setIncome(Number(savedIncome))
      }

      const savedExpenses = localStorage.getItem("currentExpenses")
      if (savedExpenses) {
        const parsedExpenses = JSON.parse(savedExpenses)
        setExpenses(
          parsedExpenses.map((exp: any) => ({
            id: exp.id,
            name: exp.name || exp.category,
            amount: exp.amount,
          })),
        )
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const calculateSavings = () => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const monthlySavings = income - totalExpenses
    setSavings(monthlySavings)
    setSavingsPercentage(income > 0 ? (monthlySavings / income) * 100 : 0)
  }

  const addExpense = () => {
    if (!newExpenseName) {
      toast({
        title: "Error",
        description: "Please enter an expense name",
        variant: "destructive",
      })
      return
    }

    const newExpense = {
      id: Date.now().toString(),
      name: newExpenseName,
      category: newExpenseName,
      amount: newExpenseAmount,
    }

    const updatedExpenses = [...expenses, newExpense]
    setExpenses(updatedExpenses)

    if (typeof window !== "undefined") {
      localStorage.setItem("currentExpenses", JSON.stringify(updatedExpenses))
    }

    setNewExpenseName("")
    setNewExpenseAmount(0)

    toast({
      title: "Expense Added",
      description: `Added ${newExpenseName} to your expenses.`,
    })
  }

  const updateExpenseAmount = (id: string, amount: number) => {
    const updatedExpenses = expenses.map((expense) => (expense.id === id ? { ...expense, amount } : expense))
    setExpenses(updatedExpenses)

    if (typeof window !== "undefined") {
      localStorage.setItem("currentExpenses", JSON.stringify(updatedExpenses))
    }
  }

  const removeExpense = (id: string) => {
    const expenseName = expenses.find((e) => e.id === id)?.name
    const updatedExpenses = expenses.filter((expense) => expense.id !== id)
    setExpenses(updatedExpenses)

    if (typeof window !== "undefined") {
      localStorage.setItem("currentExpenses", JSON.stringify(updatedExpenses))
    }

    toast({
      title: "Expense Removed",
      description: `Removed ${expenseName} from your expenses.`,
    })
  }

  const saveBudget = () => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

    const newEntry = {
      date: new Date(),
      income,
      expenses: totalExpenses,
      savings,
    }

    const updatedHistory = [...budgetHistory, newEntry]
    setBudgetHistory(updatedHistory)

    if (typeof window !== "undefined") {
      localStorage.setItem("budgetHistory", JSON.stringify(updatedHistory))

      toast({
        title: "Budget Saved",
        description: "Your current budget has been saved to history.",
      })
    }
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  useEffect(() => {
    if (typeof window !== "undefined" && budgetHistory.length > 0) {
      localStorage.setItem("budgetHistory", JSON.stringify(budgetHistory))
    }
  }, [budgetHistory])

  // Format numbers with Swiss formatting
  const formatNumber = (num: number) => {
    return num.toLocaleString("de-CH", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="card-hover border-l-4 border-l-navy compact-card">
          <CardHeader className="py-4 px-5">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wallet className="h-5 w-5 text-navy" />
              Income & Expenses
            </CardTitle>
            <CardDescription className="text-sm">Enter your monthly income and expenses</CardDescription>
          </CardHeader>
          <CardContent className="card-content">
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-8 bg-muted rounded-md"></div>
                <div className="space-y-2">
                  <div className="h-8 bg-muted rounded-md"></div>
                  <div className="h-8 bg-muted rounded-md"></div>
                  <div className="h-8 bg-muted rounded-md"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="compact-form-group">
                  <Label htmlFor="income" className="compact-label flex items-center gap-1">
                    Monthly Income
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter your total monthly income after taxes in CHF</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="relative">
                    <ChfIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" />
                    <Input
                      id="income"
                      type="number"
                      placeholder="Enter your monthly income in CHF"
                      value={income || ""}
                      onChange={(e) => {
                        const newIncome = Number(e.target.value)
                        setIncome(newIncome)
                        if (typeof window !== "undefined") {
                          localStorage.setItem("currentIncome", newIncome.toString())
                        }
                      }}
                      className="pl-7 number-input compact-input"
                    />
                  </div>
                </div>

                <div className="compact-form-group">
                  <div className="flex items-center justify-between">
                    <Label className="compact-label flex items-center gap-1">
                      Monthly Expenses
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add all your recurring monthly expenses in CHF</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <span className="text-sm font-medium bg-secondary px-1.5 py-0.5 rounded-md">
                      Total: CHF {formatNumber(totalExpenses)}
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-[250px] overflow-y-auto pr-1">
                    {expenses.map((expense) => (
                      <div key={expense.id} className="flex items-center gap-1.5 group">
                        <Input
                          placeholder="Expense name"
                          value={expense.name}
                          onChange={(e) => {
                            setExpenses(
                              expenses.map((exp) => (exp.id === expense.id ? { ...exp, name: e.target.value } : exp)),
                            )
                          }}
                          className="flex-1 compact-input"
                        />
                        <div className="relative">
                          <ChfIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" />
                          <Input
                            type="number"
                            placeholder="Amount"
                            value={expense.amount || ""}
                            onChange={(e) => updateExpenseAmount(expense.id, Number(e.target.value))}
                            className="w-24 pl-7 number-input compact-input"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExpense(expense.id)}
                          className="h-7 w-7 opacity-70 hover:opacity-100 hover:bg-destructive/10"
                        >
                          <MinusCircle className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 mt-2 bg-secondary/50 p-1.5 rounded-md">
                    <Input
                      placeholder="New expense name"
                      value={newExpenseName}
                      onChange={(e) => setNewExpenseName(e.target.value)}
                      className="flex-1 compact-input"
                    />
                    <div className="relative">
                      <ChfIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" />
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={newExpenseAmount || ""}
                        onChange={(e) => setNewExpenseAmount(Number(e.target.value))}
                        className="w-24 pl-7 number-input compact-input"
                      />
                    </div>
                    <Button variant="outline" size="icon" onClick={addExpense} className="h-7 w-7 hover:bg-primary/10">
                      <PlusCircle className="h-3.5 w-3.5 text-primary" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-hover border-l-4 border-l-navy compact-card">
          <CardHeader className="card-header">
            <CardTitle className="flex items-center gap-2 text-lg">
              <PiggyBank className="h-5 w-5 text-navy" />
              Monthly Savings
            </CardTitle>
            <CardDescription className="text-sm">Your calculated monthly savings</CardDescription>
          </CardHeader>
          <CardContent className="card-content">
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-16 bg-muted rounded-md"></div>
                <div className="space-y-2">
                  <div className="h-8 bg-muted rounded-md"></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-16 bg-muted rounded-md"></div>
                    <div className="h-16 bg-muted rounded-md"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Monthly Savings</span>
                    <span className={`text-2xl font-bold ${savings >= 0 ? "text-positive" : "text-destructive"}`}>
                      CHF {formatNumber(savings)}
                    </span>
                  </div>
                  <Progress
                    value={Math.max(0, savingsPercentage)}
                    className="h-1.5"
                    indicatorClassName={savings >= 0 ? "bg-positive" : "bg-destructive"}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{savingsPercentage.toFixed(1)}% of income</span>
                    <span
                      className={`text-sm px-1.5 py-0.5 rounded-full ${
                        savings >= 0 ? "bg-positive/10 text-positive" : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {savings >= 0 ? "Positive Savings" : "Negative Savings"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium flex items-center gap-1">
                    Yearly Projection
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Projected savings based on your current monthly rate</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="bg-secondary/30 border-none">
                      <CardContent className="p-2.5">
                        <div className="text-sm text-muted-foreground">Annual Savings</div>
                        <div className="text-lg font-bold">CHF {formatNumber(savings * 12)}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary/30 border-none">
                      <CardContent className="p-2.5">
                        <div className="text-sm text-muted-foreground">5-Year Savings</div>
                        <div className="text-lg font-bold">CHF {formatNumber(savings * 12 * 5)}</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="pt-1 space-y-1.5">
                  <Button
                    variant="outline"
                    className="w-full group transition-all h-9 text-sm"
                    onClick={() => {
                      const yearlyTab = document.querySelector('[value="yearly"]') as HTMLElement
                      if (yearlyTab) {
                        yearlyTab.click()
                      }

                      toast({
                        title: "Detailed Analysis",
                        description: `Viewing detailed analysis for CHF ${formatNumber(savings)} monthly savings`,
                      })
                    }}
                  >
                    <TrendingUp className="mr-2 h-5 w-5 group-hover:text-primary" />
                    View Detailed Analysis
                  </Button>

                  <Button variant="default" className="w-full transition-all h-9 text-sm" onClick={saveBudget}>
                    <Save className="mr-2 h-5 w-5" />
                    Save Current Budget
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {!isLoading && (
        <Card className="border-t-4 border-t-navy animate-in compact-card">
          <CardHeader className="card-header">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-navy" />
              Quick Financial Summary
            </CardTitle>
            <CardDescription className="text-sm">Overview of your current financial situation</CardDescription>
          </CardHeader>
          <CardContent className="card-content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-secondary/30 rounded-lg p-3">
                <div className="text-sm text-muted-foreground mb-1">Income to Expense Ratio</div>
                <div className="text-xl font-bold">
                  {totalExpenses > 0 ? formatNumber(income / totalExpenses) : "∞"}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {income > totalExpenses
                    ? "Your income exceeds expenses"
                    : income === totalExpenses
                      ? "Your income equals expenses"
                      : "Your expenses exceed income"}
                </div>
              </div>

              <div className="bg-secondary/30 rounded-lg p-3">
                <div className="text-sm text-muted-foreground mb-1">Savings Rate</div>
                <div className="text-xl font-bold">{savingsPercentage.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {savingsPercentage >= 20
                    ? "Excellent savings rate!"
                    : savingsPercentage >= 10
                      ? "Good savings rate"
                      : savingsPercentage >= 0
                        ? "Consider increasing your savings"
                        : "You're spending more than you earn"}
                </div>
              </div>

              <div className="bg-secondary/30 rounded-lg p-3">
                <div className="text-sm text-muted-foreground mb-1">Monthly Discretionary</div>
                <div className="text-xl font-bold">CHF {formatNumber(savings)}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Amount available for savings or additional spending
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

