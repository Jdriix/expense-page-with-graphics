"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  XAxis,
} from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
  CATEGORIES,
  categoryColor,
  type Expense,
  formatCurrency,
  monthKey,
  monthLabel,
} from "@/lib/expenses"

const trendConfig = {
  amount: {
    label: "Spending",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ExpenseCharts({ expenses }: { expenses: Expense[] }) {
  const [range, setRange] = React.useState("6m")

  const trendData = React.useMemo(() => {
    const months = range === "3m" ? 3 : 6
    const now = new Date()
    const buckets: { key: string; label: string; amount: number }[] = []
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      buckets.push({ key, label: monthLabel(key), amount: 0 })
    }
    for (const e of expenses) {
      const bucket = buckets.find((b) => b.key === monthKey(e.date))
      if (bucket) bucket.amount += e.amount
    }
    return buckets
  }, [expenses, range])

  const categoryData = React.useMemo(() => {
    const months = range === "3m" ? 3 : 6
    const now = new Date()
    const cutoff = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1)

    const totals = new Map<string, number>()
    for (const e of expenses) {
      if (new Date(e.date) < cutoff) continue
      totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount)
    }
    return CATEGORIES.map((c) => ({
      category: c.name,
      amount: totals.get(c.name) ?? 0,
      fill: c.color,
    })).filter((d) => d.amount > 0)
  }, [expenses, range])

  const totalSpend = React.useMemo(
    () => categoryData.reduce((s, d) => s + d.amount, 0),
    [categoryData]
  )

  const categoryConfig = React.useMemo(() => {
    const cfg: ChartConfig = { amount: { label: "Amount" } }
    for (const c of CATEGORIES) {
      cfg[c.name] = { label: c.name, color: c.color }
    }
    return cfg
  }, [])

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @4xl/main:grid-cols-3">
      <Card className="@container/card @4xl/main:col-span-2">
        <CardHeader>
          <CardTitle>Spending over time</CardTitle>
          <CardDescription>Total expenses per month</CardDescription>
          <CardAction>
            <ToggleGroup
              type="single"
              value={range}
              onValueChange={(v) => v && setRange(v)}
              variant="outline"
              className="*:data-[slot=toggle-group-item]:px-4!"
            >
              <ToggleGroupItem value="6m">6 months</ToggleGroupItem>
              <ToggleGroupItem value="3m">3 months</ToggleGroupItem>
            </ToggleGroup>
          </CardAction>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={trendConfig}
            className="aspect-auto h-[260px] w-full"
          >
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-amount)"
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-amount)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                }
              />
              <Area
                dataKey="amount"
                type="natural"
                fill="url(#fillAmount)"
                stroke="var(--color-amount)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="@container/card flex flex-col">
        <CardHeader>
          <CardTitle>By category</CardTitle>
          <CardDescription>Share of total spending</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center pb-2">
          <ChartContainer
            config={categoryConfig}
            className="mx-auto aspect-square h-[260px] w-full"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name) => (
                      <div className="flex w-full items-center justify-between gap-3">
                        <span className="text-muted-foreground">{name}</span>
                        <span className="font-mono font-medium tabular-nums">
                          {formatCurrency(Number(value))}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Pie
                data={categoryData}
                dataKey="amount"
                nameKey="category"
                innerRadius={60}
                strokeWidth={4}
              >
                {categoryData.map((entry) => (
                  <Cell
                    key={entry.category}
                    fill={categoryColor(entry.category as never)}
                  />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {formatCurrency(totalSpend)}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 22}
                            className="fill-muted-foreground text-xs"
                          >
                            Total
                          </tspan>
                        </text>
                      )
                    }
                    return null
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
