import { Sidebar } from "./Sidebar";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="pl-12 lg:pl-0">
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center relative">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search..." 
                  className="pl-10 w-64 bg-secondary border-0"
                />
              </div>
              
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center">
                  3
                </span>
              </Button>
              
              {/* User */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
