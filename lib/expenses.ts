export type ExpenseCategory =
  | "Housing"
  | "Food"
  | "Transport"
  | "Utilities"
  | "Entertainment"
  | "Health"
  | "Shopping"
  | "Other"

export type Expense = {
  id: string
  date: string // ISO yyyy-mm-dd
  description: string
  category: ExpenseCategory
  amount: number
}

export const CATEGORIES: { name: ExpenseCategory; color: string }[] = [
  { name: "Housing", color: "var(--chart-1)" },
  { name: "Food", color: "var(--chart-2)" },
  { name: "Transport", color: "var(--chart-3)" },
  { name: "Utilities", color: "var(--chart-4)" },
  { name: "Entertainment", color: "var(--chart-5)" },
  { name: "Health", color: "var(--primary)" },
  { name: "Shopping", color: "var(--muted-foreground)" },
  { name: "Other", color: "var(--border)" },
]

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name)

export function categoryColor(name: ExpenseCategory): string {
  return CATEGORIES.find((c) => c.name === name)?.color ?? "var(--muted-foreground)"
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCurrencyPrecise(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value)
}

// Generate ~6 months of seed expenses ending recently.
function seed(): Expense[] {
  const items: Omit<Expense, "id" | "date">[] = [
    { description: "Monthly rent", category: "Housing", amount: 1450 },
    { description: "Groceries", category: "Food", amount: 86 },
    { description: "Electric bill", category: "Utilities", amount: 72 },
    { description: "Gas station", category: "Transport", amount: 54 },
    { description: "Streaming subscription", category: "Entertainment", amount: 16 },
    { description: "Pharmacy", category: "Health", amount: 28 },
    { description: "New sneakers", category: "Shopping", amount: 119 },
    { description: "Dinner out", category: "Food", amount: 63 },
    { description: "Internet bill", category: "Utilities", amount: 60 },
    { description: "Ride share", category: "Transport", amount: 22 },
    { description: "Concert tickets", category: "Entertainment", amount: 95 },
    { description: "Gym membership", category: "Health", amount: 45 },
    { description: "Coffee", category: "Food", amount: 12 },
    { description: "Office supplies", category: "Other", amount: 34 },
  ]

  const out: Expense[] = []
  const today = new Date()
  let counter = 0

  for (let monthBack = 5; monthBack >= 0; monthBack--) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - monthBack, 1)
    // Rent every month
    out.push({
      id: `seed-${counter++}`,
      date: toISO(new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)),
      description: "Monthly rent",
      category: "Housing",
      amount: 1450,
    })
    // A spread of other expenses through the month
    const count = 8 + ((monthBack * 3) % 5)
    for (let i = 0; i < count; i++) {
      const base = items[(i + monthBack) % items.length]
      if (base.category === "Housing") continue
      const day = 2 + ((i * 7 + monthBack * 3) % 26)
      const jitter = 1 + (((i * 13 + monthBack) % 40) - 20) / 100
      out.push({
        id: `seed-${counter++}`,
        date: toISO(new Date(monthDate.getFullYear(), monthDate.getMonth(), day)),
        description: base.description,
        category: base.category,
        amount: Math.round(base.amount * jitter),
      })
    }
  }

  return out.sort((a, b) => (a.date < b.date ? 1 : -1))
}

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export const seedExpenses: Expense[] = seed()

export function monthKey(iso: string): string {
  return iso.slice(0, 7) // yyyy-mm
}

export function monthLabel(iso: string): string {
  return new Date(iso + "-01").toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  })
}
