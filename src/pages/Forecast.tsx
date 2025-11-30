import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Clock,
  Zap,
  RefreshCw,
  Sparkles,
  Package,
  ShoppingCart,
  Recycle,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";

const forecastData = [
  { day: "Day 1", predicted: 420, historical: 380 },
  { day: "Day 5", predicted: 480, historical: 410 },
  { day: "Day 10", predicted: 520, historical: 450 },
  { day: "Day 15", predicted: 580, historical: 490 },
  { day: "Day 20", predicted: 650, historical: 520 },
  { day: "Day 25", predicted: 720, historical: 580 },
  { day: "Day 30", predicted: 800, historical: 620 },
];

const categories = ["All Categories", "Dairy", "Produce", "Dry Goods", "Bakery", "Beverages"];

const insights = [
  { icon: TrendingUp, title: "Demand Increasing", description: "Dairy products expected to rise 15% next week", type: "positive" },
  { icon: AlertTriangle, title: "Overstock Alert", description: "Olive oil inventory 40% above optimal", type: "warning" },
  { icon: Clock, title: "Expiry Risk", description: "24 items expiring within 5 days", type: "danger" },
];

const wasteAlerts = [
  { product: "Greek Yogurt", expiry: "2 days", quantity: 15, severity: "critical" },
  { product: "Fresh Spinach", expiry: "3 days", quantity: 8, severity: "high" },
  { product: "Whole Milk", expiry: "5 days", quantity: 23, severity: "medium" },
  { product: "Sliced Bread", expiry: "4 days", quantity: 12, severity: "high" },
];

const recommendations = [
  { icon: Package, title: "Restock Recommendation", description: "Order 50 units of Eggs (12-pack) by Thursday to meet weekend demand", priority: "high" },
  { icon: TrendingDown, title: "Reduce Overstock", description: "Consider promotions on Olive Oil - 40% excess inventory", priority: "medium" },
  { icon: ShoppingCart, title: "Promote Slow Movers", description: "Bundle Organic Yogurt with fruits - sales declined 20%", priority: "low" },
];

const wastePrevention = [
  { icon: Clock, title: "First-Expired-First-Out", description: "Rotate stock daily. Move older items to front displays." },
  { icon: Zap, title: "Flash Discounts", description: "Apply 30% off to items expiring within 3 days." },
  { icon: Recycle, title: "Staff Meals Program", description: "Use near-expiry items for staff meals to reduce waste." },
];

const Forecast = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <MainLayout title="AI Forecast" subtitle="Intelligent demand predictions & insights">
      {/* AI Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {insights.map((insight, index) => (
          <div key={index} className={cn(
            "stat-card border-l-4",
            insight.type === "positive" && "border-l-success",
            insight.type === "warning" && "border-l-warning",
            insight.type === "danger" && "border-l-destructive"
          )}>
            <div className="flex items-start gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                insight.type === "positive" && "bg-success/10",
                insight.type === "warning" && "bg-warning/10",
                insight.type === "danger" && "bg-destructive/10"
              )}>
                <insight.icon className={cn(
                  "h-5 w-5",
                  insight.type === "positive" && "text-success",
                  insight.type === "warning" && "text-warning",
                  insight.type === "danger" && "text-destructive"
                )} />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{insight.title}</h4>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Forecast Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Forecast Chart */}
        <div className="lg:col-span-2 chart-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">30-Day Demand Forecast</h3>
              <p className="text-sm text-muted-foreground">AI-predicted vs historical average</p>
            </div>
            <Button 
              variant="gradient" 
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Brain className="h-4 w-4 mr-2" />
              )}
              {isGenerating ? "Generating..." : "Generate Forecast"}
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "pill-filter whitespace-nowrap",
                  selectedCategory === category ? "pill-filter-active" : "pill-filter-inactive"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  name="AI Predicted"
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="historical" 
                  name="Historical Average"
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: 'hsl(var(--muted-foreground))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Trends Panel */}
        <div className="chart-card">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Sales Trends</h3>
          </div>

          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-success/5 border border-success/20">
              <p className="text-sm text-muted-foreground">Weekly Growth</p>
              <p className="text-2xl font-bold text-success">+12.5%</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Peak Hour</p>
              <p className="text-lg font-semibold text-foreground">2:00 PM - 4:00 PM</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Best Selling Day</p>
              <p className="text-lg font-semibold text-foreground">Saturday</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Average Basket Value</p>
              <p className="text-lg font-semibold text-foreground">$34.50</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Waste Alerts */}
        <div className="chart-card">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <h3 className="text-lg font-semibold text-foreground">Waste Alerts</h3>
          </div>

          <div className="space-y-3">
            {wasteAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-8 rounded-full",
                    alert.severity === "critical" && "bg-destructive",
                    alert.severity === "high" && "bg-warning",
                    alert.severity === "medium" && "bg-primary"
                  )} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{alert.product}</p>
                    <p className="text-xs text-muted-foreground">{alert.quantity} units</p>
                  </div>
                </div>
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  alert.severity === "critical" && "bg-destructive/10 text-destructive",
                  alert.severity === "high" && "bg-warning/10 text-warning",
                  alert.severity === "medium" && "bg-primary/10 text-primary"
                )}>
                  {alert.expiry}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="chart-card">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">AI Recommendations</h3>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <rec.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-foreground">{rec.title}</h4>
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full uppercase font-medium",
                        rec.priority === "high" && "bg-destructive/10 text-destructive",
                        rec.priority === "medium" && "bg-warning/10 text-warning",
                        rec.priority === "low" && "bg-success/10 text-success"
                      )}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{rec.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Waste Prevention Tips */}
        <div className="chart-card">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="h-5 w-5 text-warning" />
            <h3 className="text-lg font-semibold text-foreground">Waste Prevention Tips</h3>
          </div>

          <div className="space-y-4">
            {wastePrevention.map((tip, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <tip.icon className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{tip.title}</h4>
                  <p className="text-xs text-muted-foreground">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Forecast;
