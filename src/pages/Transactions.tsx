import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

const transactions = [
  { id: 1, type: "sale", product: "Whole Milk 1L", quantity: 5, amount: 14.95, date: "2024-02-07 14:32", customer: "Walk-in" },
  { id: 2, type: "purchase", product: "White Bread", quantity: 50, amount: 87.50, date: "2024-02-07 10:15", supplier: "Baker's Supply" },
  { id: 3, type: "sale", product: "Free Range Eggs (12)", quantity: 3, amount: 17.97, date: "2024-02-07 09:45", customer: "John Smith" },
  { id: 4, type: "sale", product: "Cheddar Cheese 500g", quantity: 2, amount: 15.98, date: "2024-02-06 16:20", customer: "Walk-in" },
  { id: 5, type: "purchase", product: "Organic Bananas", quantity: 100, amount: 45.00, date: "2024-02-06 08:00", supplier: "Fresh Farms" },
  { id: 6, type: "sale", product: "Chicken Breast 1kg", quantity: 4, amount: 47.96, date: "2024-02-05 15:10", customer: "Mary Johnson" },
  { id: 7, type: "purchase", product: "Olive Oil 500ml", quantity: 24, amount: 143.76, date: "2024-02-05 11:30", supplier: "Mediterranean Imports" },
  { id: 8, type: "sale", product: "Orange Juice 1L", quantity: 6, amount: 23.94, date: "2024-02-05 10:05", customer: "Walk-in" },
];

const Transactions = () => {
  return (
    <MainLayout title="Transactions" subtitle="Track all inventory movements">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <ArrowUpRight className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Sales</p>
              <p className="text-xl font-bold text-foreground">$4,829.50</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ArrowDownLeft className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Purchases</p>
              <p className="text-xl font-bold text-foreground">$2,156.26</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transactions Today</p>
              <p className="text-xl font-bold text-foreground">24</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search transactions..." 
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Transaction Type Pills */}
      <div className="flex gap-2 mb-6">
        <button className="pill-filter pill-filter-active">All</button>
        <button className="pill-filter pill-filter-inactive">Sales</button>
        <button className="pill-filter pill-filter-inactive">Purchases</button>
      </div>

      {/* Transactions Table */}
      <div className="chart-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Product</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Quantity</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Date & Time</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Customer/Supplier</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-4 px-4">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
                      transaction.type === "sale" 
                        ? "bg-success/10 text-success" 
                        : "bg-primary/10 text-primary"
                    )}>
                      {transaction.type === "sale" ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownLeft className="h-3 w-3" />
                      )}
                      {transaction.type === "sale" ? "Sale" : "Purchase"}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-foreground">{transaction.product}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-foreground">{transaction.quantity}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={cn(
                      "font-medium",
                      transaction.type === "sale" ? "text-success" : "text-foreground"
                    )}>
                      ${transaction.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-muted-foreground">{transaction.date}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-muted-foreground">
                      {transaction.customer || transaction.supplier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Transactions;
