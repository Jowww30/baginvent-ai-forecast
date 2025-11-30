import { Package, TrendingUp, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    icon: Package,
    title: "New stock arrived",
    description: "50 units of Milk 1L added",
    time: "2 min ago",
    type: "success"
  },
  {
    icon: TrendingUp,
    title: "Sales spike detected",
    description: "Bread sales up 25% today",
    time: "15 min ago",
    type: "info"
  },
  {
    icon: AlertTriangle,
    title: "Low stock alert",
    description: "Eggs running low (12 left)",
    time: "1 hour ago",
    type: "warning"
  },
  {
    icon: Clock,
    title: "Expiry warning",
    description: "Yogurt expires in 3 days",
    time: "2 hours ago",
    type: "danger"
  },
];

export function RecentActivity() {
  return (
    <div className="chart-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest updates and alerts</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={index}
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
              activity.type === "success" && "bg-success/10",
              activity.type === "info" && "bg-primary/10",
              activity.type === "warning" && "bg-warning/10",
              activity.type === "danger" && "bg-destructive/10",
            )}>
              <activity.icon className={cn(
                "h-5 w-5",
                activity.type === "success" && "text-success",
                activity.type === "info" && "text-primary",
                activity.type === "warning" && "text-warning",
                activity.type === "danger" && "text-destructive",
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
