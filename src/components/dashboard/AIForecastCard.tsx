import { Brain, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function AIForecastCard() {
  const navigate = useNavigate();

  return (
    <div className="chart-card relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -right-5 -bottom-5 w-32 h-32 rounded-full bg-accent/5 blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center animate-pulse-glow">
            <Brain className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI Demand Forecast</h3>
            <p className="text-sm text-muted-foreground">Powered by machine learning</p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-6">
          Get intelligent predictions for your inventory needs. Our AI analyzes historical data 
          to forecast demand and optimize stock levels.
        </p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-foreground">30-day demand prediction</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-foreground">Smart restock recommendations</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-foreground">Waste prevention alerts</span>
          </div>
        </div>
        
        <Button 
          variant="gradient" 
          className="w-full"
          onClick={() => navigate('/forecast')}
        >
          Generate Forecast
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
