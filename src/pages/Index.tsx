import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { TopSellingChart } from "@/components/dashboard/TopSellingChart";
import { AIForecastCard } from "@/components/dashboard/AIForecastCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Package, AlertTriangle, Clock, DollarSign } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useTransactions } from "@/hooks/useTransactions";

const Index = () => {
  const { products } = useProducts();
  const { getTodaysSales } = useTransactions();

  const stats = {
    totalProducts: products.length,
    lowStock: products.filter(p => p.status === "low").length,
    expiringSoon: products.filter(p => {
      const expiry = new Date(p.expiry);
      const today = new Date();
      const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays > 0;
    }).length,
    todaysSales: getTodaysSales(),
  };

  const inStock = products.filter(p => p.status === "normal").length;
  const lowStockCount = products.filter(p => p.status === "low").length;
  const outOfStock = products.filter(p => p.status === "out").length;
  const total = products.length || 1;

  return (
    <MainLayout title="Dashboard" subtitle="Welcome back! Here's your inventory overview.">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toString()}
          change={`${products.length > 0 ? '+' : ''}${products.length} items`}
          changeType="positive"
          icon={Package}
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStock.toString()}
          change={`${stats.lowStock > 0 ? stats.lowStock + ' need attention' : 'All stocked'}`}
          changeType={stats.lowStock > 0 ? "negative" : "positive"}
          icon={AlertTriangle}
        />
        <StatCard
          title="Expiring Soon"
          value={stats.expiringSoon.toString()}
          change="Within 7 days"
          changeType={stats.expiringSoon > 0 ? "negative" : "positive"}
          icon={Clock}
        />
        <StatCard
          title="Today's Sales"
          value={`₱${stats.todaysSales.toLocaleString()}`}
          change="Live tracking"
          changeType="positive"
          icon={DollarSign}
          variant="gradient"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TopSellingChart />
        <AIForecastCard />
      </div>

      {/* Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        
        {/* Quick Stats */}
        <div className="chart-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Inventory Health</h3>
              <p className="text-sm text-muted-foreground">Stock status overview</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">In Stock</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full" style={{ width: `${(inStock / total) * 100}%` }} />
                </div>
                <span className="text-sm font-medium text-foreground">{Math.round((inStock / total) * 100)}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Low Stock</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-warning rounded-full" style={{ width: `${(lowStockCount / total) * 100}%` }} />
                </div>
                <span className="text-sm font-medium text-foreground">{Math.round((lowStockCount / total) * 100)}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Out of Stock</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-destructive rounded-full" style={{ width: `${(outOfStock / total) * 100}%` }} />
                </div>
                <span className="text-sm font-medium text-foreground">{Math.round((outOfStock / total) * 100)}%</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">{inStock}</p>
                <p className="text-xs text-muted-foreground">In Stock</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{lowStockCount}</p>
                <p className="text-xs text-muted-foreground">Low Stock</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{outOfStock}</p>
                <p className="text-xs text-muted-foreground">Out of Stock</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
