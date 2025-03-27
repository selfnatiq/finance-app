"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type BudgetEntry = {
  id: string
  date: Date
  income: number
  expenses: number
  savings: number
  savingsRate: number
}

type BudgetContextType = {
  budgetHistory: BudgetEntry[]
  saveBudgetSnapshot: (income: number, expenses: number) => void
  deleteHistoryEntry: (id: string) => void
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined)

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [budgetHistory, setBudgetHistory] = useState<BudgetEntry[]>([])

  // Listen for custom events from components
  useEffect(() => {
    const handleSaveBudget = (event: CustomEvent) => {
      const { income, expenses } = event.detail
      saveBudgetSnapshot(income, expenses)
    }

    window.addEventListener("saveBudget", handleSaveBudget as EventListener)

    return () => {
      window.removeEventListener("saveBudget", handleSaveBudget as EventListener)
    }
  }, [])

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
  }

  const deleteHistoryEntry = (id: string) => {
    setBudgetHistory((prev) => prev.filter((entry) => entry.id !== id))
  }

  return (
    <BudgetContext.Provider value={{ budgetHistory, saveBudgetSnapshot, deleteHistoryEntry }}>
      {children}
    </BudgetContext.Provider>
  )
}

export function useBudget() {
  const context = useContext(BudgetContext)
  if (context === undefined) {
    throw new Error("useBudget must be used within a BudgetProvider")
  }
  return context
}

