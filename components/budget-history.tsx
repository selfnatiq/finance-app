"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { format } from "date-fns"

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
  return num.toLocaleString("de-CH", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })
}

export default function BudgetHistory() {
  const { toast } = useToast()
  const [budgetHistory, setBudgetHistory] = useState<BudgetEntry[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("budgetHistory")
      if (saved) {
        // Parse the dates properly from localStorage
        const parsed = JSON.parse(saved)
        return parsed.map((entry: any) => ({
          id: entry.id || Date.now().toString(),
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

  // This function would be called from other components to save the current budget
  const saveBudgetSnapshot = (income: number, expenses: number) => {
    const savings = income - expenses
    const savingsRate = income > 0 ? (savings / income) * 100 : 0

    const newEntry: BudgetEntry = {
      id: Date.now().toString(),
      date: new Date(),
      income,
      expenses,
      savings,
      savingsRate,
    }

    setBudgetHistory((prev) => [...prev, newEntry])

    toast({
      title: "Budget Saved",
      description: `Your budget for ${format(new Date(), "MMMM yyyy")} has been saved.`,
    })
  }

  const deleteHistoryEntry = (id: string) => {
    const updatedHistory = budgetHistory.filter((entry) => entry.id !== id)
    setBudgetHistory(updatedHistory)

    // Update localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("budgetHistory", JSON.stringify(updatedHistory))

      toast({
        title: "Entry Deleted",
        description: "The budget entry has been removed from history.",
      })
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
          <CardDescription className="text-xs">Track your monthly budget and savings over time</CardDescription>
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
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Month</TableHead>
                      <TableHead className="text-xs text-right">Income</TableHead>
                      <TableHead className="text-xs text-right">Expenses</TableHead>
                      <TableHead className="text-xs text-right">Savings</TableHead>
                      <TableHead className="text-xs text-right">Savings Rate</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budgetHistory.map((entry, index) => {
                      const prevEntry = index > 0 ? budgetHistory[index - 1] : null
                      const savingsTrend = prevEntry ? calculateTrend(entry.savings, prevEntry.savings) : 0

                      return (
                        <TableRow key={entry.id}>
                          <TableCell className="text-xs font-medium">{format(entry.date, "MMM yyyy")}</TableCell>
                          <TableCell className="text-xs text-right">CHF {formatNumber(entry.income)}</TableCell>
                          <TableCell className="text-xs text-right">CHF {formatNumber(entry.expenses)}</TableCell>
                          <TableCell className="text-xs text-right">
                            <div className="flex items-center justify-end gap-1">
                              CHF {formatNumber(entry.savings)}
                              {savingsTrend !== 0 && (
                                <span className={savingsTrend > 0 ? "text-green-500" : "text-red-500"}>
                                  {savingsTrend > 0 ? (
                                    <ArrowUpRight className="h-3 w-3" />
                                  ) : (
                                    <ArrowDownRight className="h-3 w-3" />
                                  )}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-right">{entry.savingsRate.toFixed(1)}%</TableCell>
                          <TableCell className="text-xs text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteHistoryEntry(entry.id)}
                              className="h-6 text-xs"
                            >
                              Delete
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
                    <div className="h-[150px] flex items-end gap-1.5">
                      {budgetHistory.map((entry, index) => {
                        // Calculate the height percentage based on the maximum savings
                        const maxSavings = Math.max(...budgetHistory.map((e) => e.savings))
                        const heightPercentage = maxSavings > 0 ? (entry.savings / maxSavings) * 100 : 0

                        return (
                          <div key={entry.id} className="flex flex-col items-center flex-1">
                            <div
                              className="w-full bg-navy rounded-t-sm"
                              style={{ height: `${Math.max(heightPercentage, 5)}%` }}
                            />
                            <div className="text-[10px] mt-1 text-muted-foreground">{format(entry.date, "MMM")}</div>
                          </div>
                        )
                      })}
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

