"use client"

import * as React from "react"
import { IconPlus } from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CATEGORIES,
  type Expense,
  type ExpenseCategory,
} from "@/lib/expenses"

export function AddExpenseDialog({
  onAdd,
}: {
  onAdd: (expense: Omit<Expense, "id">) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [description, setDescription] = React.useState("")
  const [amount, setAmount] = React.useState("")
  const [category, setCategory] = React.useState<ExpenseCategory>("Food")
  const [date, setDate] = React.useState(() =>
    new Date().toISOString().slice(0, 10)
  )

  function reset() {
    setDescription("")
    setAmount("")
    setCategory("Food")
    setDate(new Date().toISOString().slice(0, 10))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = Number.parseFloat(amount)
    if (!description.trim()) {
      toast.error("Please enter a description.")
      return
    }
    if (!Number.isFinite(value) || value <= 0) {
      toast.error("Please enter a valid amount.")
      return
    }
    onAdd({
      description: description.trim(),
      amount: Math.round(value * 100) / 100,
      category,
      date,
    })
    toast.success("Expense added.")
    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <IconPlus />
          <span className="hidden sm:inline">Add expense</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Add expense</DialogTitle>
            <DialogDescription>
              Record a new expense to keep your totals up to date.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Grocery run"
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as ExpenseCategory)}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.name} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit">Add expense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
