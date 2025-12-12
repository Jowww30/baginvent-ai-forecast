import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ArrowLeftRight, 
  FileBarChart, 
  Brain,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Package, label: "Inventory", path: "/inventory" },
  { icon: ArrowLeftRight, label: "Transactions", path: "/transactions" },
  { icon: FileBarChart, label: "Reports", path: "/reports" },
  { icon: Brain, label: "AI Forecast", path: "/forecast" },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully!");
    navigate("/auth");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-sidebar-background border-r border-sidebar-border z-50 flex flex-col transition-transform duration-300 lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
              <span className="text-xl">🍓</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">Walang's</h1>
              <p className="text-xs text-sidebar-foreground/70">Consumer Goods</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "nav-item",
                  isActive && "nav-item-active"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          
          {/* Admin Link */}
          <NavLink
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "nav-item",
              location.pathname === "/admin" && "nav-item-active"
            )}
          >
            <ShieldCheck className="h-5 w-5" />
            <span>Admin</span>
          </NavLink>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-sidebar-border space-y-1">
          {user && (
            <div className="px-3 py-2 mb-2">
              <p className="text-xs text-sidebar-foreground/70">Signed in as</p>
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.email}</p>
            </div>
          )}
          <button className="nav-item w-full text-sidebar-foreground hover:bg-sidebar-accent">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
          {user ? (
            <button onClick={handleLogout} className="nav-item w-full text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          ) : (
            <NavLink to="/auth" onClick={() => setMobileOpen(false)} className="nav-item w-full text-sidebar-foreground hover:bg-sidebar-accent">
              <LogOut className="h-5 w-5" />
              <span>Login</span>
            </NavLink>
          )}
        </div>
      </aside>
    </>
  );
}
