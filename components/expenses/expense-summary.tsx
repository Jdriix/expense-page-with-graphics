"use client"

import * as React from "react"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type Expense,
  formatCurrency,
  monthKey,
} from "@/lib/expenses"

export function ExpenseSummary({ expenses }: { expenses: Expense[] }) {
  const stats = React.useMemo(() => {
    const now = new Date()
    const thisKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
    const lastDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastKey = `${lastDate.getFullYear()}-${String(lastDate.getMonth() + 1).padStart(2, "0")}`

    const thisMonth = expenses.filter((e) => monthKey(e.date) === thisKey)
    const lastMonth = expenses.filter((e) => monthKey(e.date) === lastKey)

    const thisTotal = thisMonth.reduce((s, e) => s + e.amount, 0)
    const lastTotal = lastMonth.reduce((s, e) => s + e.amount, 0)
    const change =
      lastTotal === 0 ? 0 : ((thisTotal - lastTotal) / lastTotal) * 100

    const byCategory = new Map<string, number>()
    for (const e of thisMonth) {
      byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amount)
    }
    let topCategory = "—"
    let topAmount = 0
    for (const [cat, amt] of byCategory) {
      if (amt > topAmount) {
        topAmount = amt
        topCategory = cat
      }
    }

    const dayOfMonth = now.getDate()
    const dailyAvg = dayOfMonth > 0 ? thisTotal / dayOfMonth : 0

    return {
      thisTotal,
      change,
      topCategory,
      topAmount,
      dailyAvg,
      count: thisMonth.length,
    }
  }, [expenses])

  const spendingUp = stats.change > 0

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Spent this month</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(stats.thisTotal)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {spendingUp ? <IconTrendingUp /> : <IconTrendingDown />}
              {stats.change >= 0 ? "+" : ""}
              {stats.change.toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {spendingUp ? "Spending up vs last month" : "Spending down vs last month"}{" "}
            {spendingUp ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">Compared to the prior month</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Top category</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.topCategory}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">{formatCurrency(stats.topAmount)}</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Largest spending area
          </div>
          <div className="text-muted-foreground">Where most money went</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Daily average</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(stats.dailyAvg)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">per day</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Pace of spending
          </div>
          <div className="text-muted-foreground">Based on days elapsed</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Transactions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.count}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">this month</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Number of expenses
          </div>
          <div className="text-muted-foreground">Logged this month</div>
        </CardFooter>
      </Card>
    </div>
  )
}
