"use client"

import * as React from "react"

import { AddExpenseDialog } from "@/components/expenses/add-expense-dialog"
import { ExpenseCharts } from "@/components/expenses/expense-charts"
import { ExpenseSummary } from "@/components/expenses/expense-summary"
import { ExpenseTable } from "@/components/expenses/expense-table"
import { type Expense, seedExpenses } from "@/lib/expenses"

export function ExpensesView() {
  const [expenses, setExpenses] = React.useState<Expense[]>(seedExpenses)

  const addExpense = React.useCallback((expense: Omit<Expense, "id">) => {
    setExpenses((prev) =>
      [{ ...expense, id: crypto.randomUUID() }, ...prev].sort((a, b) =>
        a.date < b.date ? 1 : -1
      )
    )
  }, [])

  const deleteExpense = React.useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }, [])

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div>
          <h2 className="text-lg font-semibold">Expenses overview</h2>
          <p className="text-sm text-muted-foreground">
            Track spending, spot trends, and manage your transactions.
          </p>
        </div>
        <AddExpenseDialog onAdd={addExpense} />
      </div>
      <ExpenseSummary expenses={expenses} />
      <ExpenseCharts expenses={expenses} />
      <ExpenseTable expenses={expenses} onDelete={deleteExpense} />
    </div>
  )
}
