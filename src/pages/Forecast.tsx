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
import { forecastData, wasteAlerts, insights, recommendations } from "@/data/products";
import { toast } from "sonner";

const categories = ["All Categories", "Rice & Grains", "Canned Goods", "Beverages", "Snacks", "Frozen"];

const wastePrevention = [
  { icon: Clock, title: "First-Expired-First-Out", description: "I-rotate ang stock araw-araw. Ilagay sa harap ang mga malapit na mag-expire." },
  { icon: Zap, title: "Flash Discounts", description: "Mag-apply ng 20-30% discount sa items na mag-e-expire within 3 days." },
  { icon: Recycle, title: "Staff Meals Program", description: "Gamitin ang near-expiry items para sa staff meals or donations." },
];

const iconMap = {
  TrendingUp,
  AlertTriangle,
  Clock,
};

const recIconMap = {
  Package,
  TrendingDown,
  ShoppingCart,
};

const Forecast = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isGenerating, setIsGenerating] = useState(false);
  const [forecastGenerated, setForecastGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    toast.loading("Generating AI forecast...", { id: "forecast" });
    
    setTimeout(() => {
      setIsGenerating(false);
      setForecastGenerated(true);
      toast.success("AI forecast generated successfully!", { id: "forecast" });
    }, 2500);
  };

  const getInsightIcon = (type: string) => {
    if (type === "positive") return TrendingUp;
    if (type === "warning") return AlertTriangle;
    return Clock;
  };

  const getRecIcon = (index: number) => {
    const icons = [Package, TrendingDown, ShoppingCart];
    return icons[index] || Package;
  };

  return (
    <MainLayout title="AI Forecast" subtitle="Intelligent demand predictions & insights">
      {/* AI Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {insights.map((insight, index) => {
          const InsightIcon = getInsightIcon(insight.type);
          return (
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
                  <InsightIcon className={cn(
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
          );
        })}
      </div>

      {/* Main Forecast Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Forecast Chart */}
        <div className="lg:col-span-2 chart-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">30-Day Demand Forecast</h3>
              <p className="text-sm text-muted-foreground">AI-predicted vs historical average (in PHP)</p>
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
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`₱${value.toLocaleString()}`, '']}
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
              <p className="text-2xl font-bold text-success">+15.2%</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Peak Hour</p>
              <p className="text-lg font-semibold text-foreground">5:00 PM - 7:00 PM</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Best Selling Day</p>
              <p className="text-lg font-semibold text-foreground">Sunday</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Average Basket Value</p>
              <p className="text-lg font-semibold text-foreground">₱285.50</p>
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
            {recommendations.map((rec, index) => {
              const RecIcon = getRecIcon(index);
              return (
                <div key={index} className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <RecIcon className="h-4 w-4 text-primary" />
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
              );
            })}
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
