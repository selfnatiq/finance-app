"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, MinusCircle, TrendingUp, ArrowUpRight, ArrowDownRight, BarChart3, Save } from "lucide-react"
import { ChfIcon } from "@/components/ui/chf-icon"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

// Replace the formatNumber function with Swiss formatting (add this function)
const formatNumber = (num: number) => {
  return num.toLocaleString("de-CH", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })
}

export default function YearlyAnalysis() {
  const { toast } = useToast()
  const [income, setIncome] = useState(() => {
    if (typeof window !== "undefined") {
      const savedIncome = localStorage.getItem("currentIncome")
      return savedIncome ? Number(savedIncome) : 0
    }
    return 0
  })

  const [expenses, setExpenses] = useState<{ id: string; category: string; amount: number }[]>(() => {
    if (typeof window !== "undefined") {
      const savedExpenses = localStorage.getItem("currentExpenses")
      if (savedExpenses) {
        // Convert from dashboard format to yearly analysis format if needed
        const parsedExpenses = JSON.parse(savedExpenses)
        return parsedExpenses.map((exp: any) => ({
          id: exp.id,
          category: exp.name || exp.category,
          amount: exp.amount,
        }))
      }
    }
    return [
      { id: "1", category: "Rent", amount: 0 },
      { id: "2", category: "Food", amount: 0 },
      { id: "3", category: "Health Insurance", amount: 0 },
      { id: "4", category: "Transportation", amount: 0 },
      { id: "5", category: "Entertainment", amount: 0 },
      { id: "6", category: "Utilities", amount: 0 },
    ]
  })
  const [newExpenseName, setNewExpenseName] = useState("")
  const [newExpenseAmount, setNewExpenseAmount] = useState(0)
  const [monthlySavings, setMonthlySavings] = useState(0)
  const [yearlySavings, setYearlySavings] = useState(0)
  const [fiveYearSavings, setFiveYearSavings] = useState(0)
  const [tenYearSavings, setTenYearSavings] = useState(0)

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
      // Convert to a format that works for both components
      const formattedExpenses = expenses.map((exp) => ({
        id: exp.id,
        name: exp.category,
        category: exp.category,
        amount: exp.amount,
      }))
      localStorage.setItem("currentExpenses", JSON.stringify(formattedExpenses))
    }
  }, [expenses])

  // Add an effect to listen for changes from other components
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
            category: exp.name || exp.category,
            amount: exp.amount,
          })),
        )
      }
    }

    // Listen for storage events (when another tab changes localStorage)
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const calculateSavings = () => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const savings = income - totalExpenses

    setMonthlySavings(savings)
    setYearlySavings(savings * 12)
    setFiveYearSavings(savings * 12 * 5)
    setTenYearSavings(savings * 12 * 10)
  }

  const updateExpenseAmount = (id: string, amount: number) => {
    const updatedExpenses = expenses.map((expense) => (expense.id === id ? { ...expense, amount } : expense))

    setExpenses(updatedExpenses)

    // Update localStorage directly
    if (typeof window !== "undefined") {
      localStorage.setItem("currentExpenses", JSON.stringify(updatedExpenses))
    }
  }

  const addExpense = () => {
    if (!newExpenseName) {
      return
    }

    const newExpense = {
      id: Date.now().toString(),
      category: newExpenseName,
      name: newExpenseName, // Add name for compatibility with dashboard
      amount: newExpenseAmount,
    }

    const updatedExpenses = [...expenses, newExpense]
    setExpenses(updatedExpenses)

    // Update localStorage directly to ensure immediate sync
    if (typeof window !== "undefined") {
      localStorage.setItem("currentExpenses", JSON.stringify(updatedExpenses))
    }

    setNewExpenseName("")
    setNewExpenseAmount(0)
  }

  const removeExpense = (id: string) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id)
    setExpenses(updatedExpenses)

    // Update localStorage directly
    if (typeof window !== "undefined") {
      localStorage.setItem("currentExpenses", JSON.stringify(updatedExpenses))
    }
  }

  const saveBudget = () => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

    // This would normally dispatch to a global state or context
    // For demo purposes, we'll use the window object to communicate between components
    if (typeof window !== "undefined") {
      const event = new CustomEvent("saveBudget", {
        detail: { income, expenses: totalExpenses, savings: monthlySavings },
      })
      window.dispatchEvent(event)
    }

    toast({
      title: "Budget Saved",
      description: "Your current budget has been saved to history.",
    })
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const savingsRate = income > 0 ? (monthlySavings / income) * 100 : 0

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="compact-card border-l-4 border-l-navy">
          <CardHeader className="card-header">
            <CardTitle className="flex items-center gap-2 text-base">
              <ChfIcon className="h-4 w-4 text-navy" />
              Income & Expenses
            </CardTitle>
            <CardDescription className="text-xs">Enter your monthly finances</CardDescription>
          </CardHeader>
          <CardContent className="card-content">
            <div className="space-y-3">
              <div className="compact-form-group">
                <Label htmlFor="yearly-income" className="compact-label">
                  Monthly Income
                </Label>
                <Input
                  id="yearly-income"
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
                  className="compact-input"
                />
              </div>

              <div className="compact-form-group">
                <div className="flex items-center justify-between">
                  <Label className="compact-label">Monthly Expenses</Label>
                  <span className="text-xs text-muted-foreground">Total: CHF {formatNumber(totalExpenses)}</span>
                </div>
                <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="flex items-center gap-1.5">
                      <Input
                        placeholder="Expense name"
                        value={expense.category}
                        onChange={(e) => {
                          setExpenses(
                            expenses.map((exp) => (exp.id === expense.id ? { ...exp, category: e.target.value } : exp)),
                          )
                        }}
                        className="flex-1 compact-input"
                      />
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={expense.amount || ""}
                        onChange={(e) => updateExpenseAmount(expense.id, Number(e.target.value))}
                        className="w-20 compact-input"
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeExpense(expense.id)} className="h-7 w-7">
                        <MinusCircle className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 mt-2">
                  <Input
                    placeholder="New expense name"
                    value={newExpenseName}
                    onChange={(e) => setNewExpenseName(e.target.value)}
                    className="flex-1 compact-input"
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={newExpenseAmount || ""}
                    onChange={(e) => setNewExpenseAmount(Number(e.target.value))}
                    className="w-20 compact-input"
                  />
                  <Button variant="outline" size="icon" onClick={addExpense} className="h-7 w-7">
                    <PlusCircle className="h-3.5 w-3.5 text-navy" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="compact-card border-l-4 border-l-navy">
          <CardHeader className="card-header">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-navy" />
              Yearly Analysis
            </CardTitle>
            <CardDescription className="text-xs">Your financial projections</CardDescription>
          </CardHeader>
          <CardContent className="card-content">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Card className="bg-secondary/30 border-none">
                  <CardContent className="p-2.5">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">Monthly Income</div>
                      <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
                    </div>
                    <div className="text-sm font-bold">CHF {formatNumber(income)}</div>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/30 border-none">
                  <CardContent className="p-2.5">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">Monthly Expenses</div>
                      <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                    </div>
                    <div className="text-sm font-bold">CHF {formatNumber(totalExpenses)}</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-secondary/30 border-none">
                <CardContent className="p-2.5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">Monthly Savings</div>
                    <div className="text-xs font-medium rounded-full bg-primary/10 text-primary px-1.5 py-0.5">
                      {savingsRate.toFixed(1)}% of income
                    </div>
                  </div>
                  <div className="text-base font-bold text-green-500">CHF {formatNumber(monthlySavings)}</div>
                </CardContent>
              </Card>

              <Tabs defaultValue="yearly">
                <TabsList className="grid w-full grid-cols-3 h-8">
                  <TabsTrigger value="yearly" className="text-xs">
                    1 Year
                  </TabsTrigger>
                  <TabsTrigger value="five-year" className="text-xs">
                    5 Years
                  </TabsTrigger>
                  <TabsTrigger value="ten-year" className="text-xs">
                    10 Years
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="yearly" className="pt-3">
                  <Card className="bg-secondary/30 border-none">
                    <CardContent className="p-2.5">
                      <div className="text-xs text-muted-foreground">Total Savings (1 Year)</div>
                      <div className="text-base font-bold">CHF {formatNumber(yearlySavings)}</div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="five-year" className="pt-3">
                  <Card className="bg-secondary/30 border-none">
                    <CardContent className="p-2.5">
                      <div className="text-xs text-muted-foreground">Total Savings (5 Years)</div>
                      <div className="text-base font-bold">CHF {formatNumber(fiveYearSavings)}</div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="ten-year" className="pt-3">
                  <Card className="bg-secondary/30 border-none">
                    <CardContent className="p-2.5">
                      <div className="text-xs text-muted-foreground">Total Savings (10 Years)</div>
                      <div className="text-base font-bold">CHF {formatNumber(tenYearSavings)}</div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Button variant="default" className="w-full h-8 text-xs" onClick={saveBudget}>
                <Save className="mr-1.5 h-3.5 w-3.5" />
                Save Current Budget
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="compact-card border-t-4 border-t-navy">
        <CardHeader className="card-header">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4 text-navy" />
            Long-Term Financial Projections
          </CardTitle>
          <CardDescription className="text-xs">Your financial future based on current savings</CardDescription>
        </CardHeader>
        <CardContent className="card-content">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-xs font-medium">Savings Projections</h3>
              <div className="space-y-1.5 bg-secondary/20 rounded-lg p-2.5">
                {[1, 2, 5, 10, 20, 30].map((year) => (
                  <div key={year} className="flex items-center justify-between">
                    <span className="text-xs">
                      {year} {year === 1 ? "year" : "years"}
                    </span>
                    <span className="text-xs font-medium">CHF {formatNumber(monthlySavings * 12 * year)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-medium">Investment Potential</h3>
              <div className="space-y-1.5 bg-secondary/20 rounded-lg p-2.5">
                {[5, 10, 20, 30].map((year) => {
                  const amount = monthlySavings * 12 * year
                  const investedAmount = calculateInvestmentGrowth(monthlySavings, year, 7)
                  return (
                    <div key={year} className="flex items-center justify-between">
                      <span className="text-xs">{year} years (7% return)</span>
                      <span className="text-xs font-medium text-navy">CHF {formatNumber(investedAmount)}</span>
                    </div>
                  )
                })}
              </div>
              <div className="text-xs text-muted-foreground pt-1">
                * Assumes monthly contributions of CHF {formatNumber(monthlySavings)} with a 7% annual return
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  function calculateInvestmentGrowth(monthlySavings: number, years: number, annualReturn: number) {
    const monthlyRate = annualReturn / 100 / 12
    const totalMonths = years * 12

    let balance = 0

    for (let month = 1; month <= totalMonths; month++) {
      balance = balance * (1 + monthlyRate) + monthlySavings
    }

    return Math.round(balance)
  }
}

