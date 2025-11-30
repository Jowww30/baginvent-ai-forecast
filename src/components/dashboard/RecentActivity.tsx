import { ShoppingCart, Package, AlertTriangle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    icon: ShoppingCart,
    title: "New sale recorded",
    description: "NFA Rice 5kg × 3 - Walk-in customer",
    time: "2 minutes ago",
    type: "sale",
  },
  {
    icon: Package,
    title: "Stock received",
    description: "Lucky Me Pancit Canton × 100 from Monde Nissin",
    time: "1 hour ago",
    type: "restock",
  },
  {
    icon: AlertTriangle,
    title: "Low stock alert",
    description: "Century Tuna Flakes is running low (18 units)",
    time: "2 hours ago",
    type: "alert",
  },
  {
    icon: TrendingUp,
    title: "Sales milestone",
    description: "Daily target reached: ₱15,000",
    time: "3 hours ago",
    type: "milestone",
  },
  {
    icon: ShoppingCart,
    title: "New sale recorded",
    description: "Bear Brand Milk × 5 - Maria Santos",
    time: "4 hours ago",
    type: "sale",
  },
];

export function RecentActivity() {
  return (
    <div className="chart-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest inventory movements</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/30 transition-colors">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
              activity.type === "sale" && "bg-success/10",
              activity.type === "restock" && "bg-primary/10",
              activity.type === "alert" && "bg-warning/10",
              activity.type === "milestone" && "bg-accent/10"
            )}>
              <activity.icon className={cn(
                "h-5 w-5",
                activity.type === "sale" && "text-success",
                activity.type === "restock" && "text-primary",
                activity.type === "alert" && "text-warning",
                activity.type === "milestone" && "text-accent"
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{activity.title}</p>
              <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
