import { useState } from "react";
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
import { transactions as initialTransactions } from "@/data/products";
import { toast } from "sonner";

const Transactions = () => {
  const [transactions] = useState(initialTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "All" || 
      (filterType === "Sales" && transaction.type === "sale") ||
      (filterType === "Purchases" && transaction.type === "purchase");
    return matchesSearch && matchesType;
  });

  const totalSales = transactions.filter(t => t.type === "sale").reduce((sum, t) => sum + t.amount, 0);
  const totalPurchases = transactions.filter(t => t.type === "purchase").reduce((sum, t) => sum + t.amount, 0);

  const exportToCSV = () => {
    const headers = ["ID", "Type", "Product", "Quantity", "Amount (PHP)", "Date", "Customer/Supplier"];
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map(t => [
        t.id,
        t.type,
        `"${t.product}"`,
        t.quantity,
        t.amount,
        t.date,
        `"${t.customer || t.supplier || ''}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions-export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Exported to CSV successfully!");
  };

  const exportToPDF = () => {
    // Create a simple HTML table for printing
    const printContent = `
      <html>
        <head>
          <title>Transactions Report - BAG-INVENT</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #6366f1; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .sale { color: #22c55e; }
            .purchase { color: #6366f1; }
          </style>
        </head>
        <body>
          <h1>Transactions Report</h1>
          <p>Generated: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Customer/Supplier</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTransactions.map(t => `
                <tr>
                  <td class="${t.type}">${t.type === "sale" ? "Sale" : "Purchase"}</td>
                  <td>${t.product}</td>
                  <td>${t.quantity}</td>
                  <td>₱${t.amount.toFixed(2)}</td>
                  <td>${t.date}</td>
                  <td>${t.customer || t.supplier || '-'}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
    toast.success("PDF export ready for printing!");
  };

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
              <p className="text-xl font-bold text-foreground">₱{totalSales.toLocaleString()}</p>
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
              <p className="text-xl font-bold text-foreground">₱{totalPurchases.toLocaleString()}</p>
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
              <p className="text-xl font-bold text-foreground">{transactions.length}</p>
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline" onClick={exportToPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Transaction Type Pills */}
      <div className="flex gap-2 mb-6">
        {["All", "Sales", "Purchases"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={cn(
              "pill-filter",
              filterType === type ? "pill-filter-active" : "pill-filter-inactive"
            )}
          >
            {type}
          </button>
        ))}
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
              {filteredTransactions.map((transaction) => (
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
                      ₱{transaction.amount.toLocaleString()}
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
