"use client"

import * as React from "react"
import { IconSearch, IconTrash } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CATEGORIES,
  type Expense,
  formatCurrencyPrecise,
} from "@/lib/expenses"

export function ExpenseTable({
  expenses,
  onDelete,
}: {
  expenses: Expense[]
  onDelete: (id: string) => void
}) {
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState<string>("all")

  const filtered = React.useMemo(() => {
    return expenses
      .filter((e) => (category === "all" ? true : e.category === category))
      .filter((e) =>
        query.trim()
          ? e.description.toLowerCase().includes(query.trim().toLowerCase())
          : true
      )
      .slice(0, 50)
  }, [expenses, query, category])

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent expenses</CardTitle>
          <CardDescription>
            Your latest transactions. Showing up to 50 entries.
          </CardDescription>
          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <IconSearch className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search description..."
                className="pl-8"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.name} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No expenses found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">
                        {e.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{e.category}</Badge>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell">
                        {new Date(e.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {formatCurrencyPrecise(e.amount)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-destructive"
                          onClick={() => onDelete(e.id)}
                        >
                          <IconTrash className="size-4" />
                          <span className="sr-only">Delete expense</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
