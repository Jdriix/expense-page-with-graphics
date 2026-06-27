import { AppSidebar } from "@/components/app-sidebar"
import { ExpensesView } from "@/components/expenses/expenses-view"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function ExpensesPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Expenses" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <ExpensesView />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
