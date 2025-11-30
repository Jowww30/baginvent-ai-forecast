import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { TopSellingChart } from "@/components/dashboard/TopSellingChart";
import { AIForecastCard } from "@/components/dashboard/AIForecastCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Package, AlertTriangle, Clock, DollarSign } from "lucide-react";

const Index = () => {
  return (
    <MainLayout title="Dashboard" subtitle="Welcome back! Here's your inventory overview.">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Products"
          value="1,248"
          change="+12% from last month"
          changeType="positive"
          icon={Package}
        />
        <StatCard
          title="Low Stock Items"
          value="23"
          change="5 critical"
          changeType="negative"
          icon={AlertTriangle}
        />
        <StatCard
          title="Expiring Soon"
          value="18"
          change="Within 7 days"
          changeType="negative"
          icon={Clock}
        />
        <StatCard
          title="Today's Sales"
          value="$4,829"
          change="+8% from yesterday"
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
                  <div className="h-full w-[78%] bg-success rounded-full" />
                </div>
                <span className="text-sm font-medium text-foreground">78%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Low Stock</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-[15%] bg-warning rounded-full" />
                </div>
                <span className="text-sm font-medium text-foreground">15%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Out of Stock</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-[7%] bg-destructive rounded-full" />
                </div>
                <span className="text-sm font-medium text-foreground">7%</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">975</p>
                <p className="text-xs text-muted-foreground">In Stock</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">187</p>
                <p className="text-xs text-muted-foreground">Low Stock</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">86</p>
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
