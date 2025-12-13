import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts, DbProduct } from "@/hooks/useProducts";
import { useTransactions } from "@/hooks/useTransactions";
import { supabase } from "@/integrations/supabase/client";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  DollarSign, 
  AlertTriangle,
  LogOut,
  ShieldCheck,
  Users,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { categories } from "@/data/products";
import { AddProductDialog } from "@/components/inventory/AddProductDialog";
import { EditProductDialog } from "@/components/inventory/EditProductDialog";
import { DeleteConfirmDialog } from "@/components/inventory/DeleteConfirmDialog";
import { toast } from "sonner";

const Admin = () => {
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const { products, isLoading: productsLoading, addProduct, updateProduct, deleteProduct } = useProducts();
  const { getTodaysSales, transactions } = useTransactions();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<DbProduct | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully!");
    navigate("/auth");
  };

  const handleMigrateProfiles = async () => {
    setIsMigrating(true);
    try {
      const { data, error } = await supabase.functions.invoke('migrate-profiles');
      
      if (error) {
        console.error("Migration error:", error);
        toast.error(`Migration failed: ${error.message}`);
        return;
      }

      if (data.success) {
        toast.success(`Migration complete! Migrated ${data.migrated} profiles.`);
        if (data.errors > 0) {
          toast.warning(`${data.errors} profiles had errors during migration.`);
        }
      } else {
        toast.error(`Migration failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Migration error:", error);
      toast.error("Failed to run migration");
    } finally {
      setIsMigrating(false);
    }
  };

  const handleAddProduct = async (newProduct: { name: string; category: string; quantity: number; price: number; expiry: string }) => {
    await addProduct(newProduct);
    setAddDialogOpen(false);
  };

  const handleEditProduct = async (updatedProduct: { id: number; name: string; category: string; quantity: number; price: number; expiry: string; status: "normal" | "low" | "out" }) => {
    if (selectedProduct) {
      await updateProduct(selectedProduct.id, {
        name: updatedProduct.name,
        category: updatedProduct.category,
        quantity: updatedProduct.quantity,
        price: updatedProduct.price,
        expiry: updatedProduct.expiry,
      });
      setEditDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleDeleteProduct = async () => {
    if (selectedProduct) {
      await deleteProduct(selectedProduct.id);
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalProducts: products.length,
    lowStock: products.filter(p => p.status === "low").length,
    outOfStock: products.filter(p => p.status === "out").length,
    todaysSales: getTodaysSales(),
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal": return <span className="badge-success">In Stock</span>;
      case "low": return <span className="badge-warning">Low Stock</span>;
      case "out": return <span className="badge-danger">Out of Stock</span>;
      default: return null;
    }
  };

  // Convert DbProduct to the format expected by dialogs
  const convertToDialogProduct = (product: DbProduct) => ({
    id: 0, // Not used in the dialog
    name: product.name,
    category: product.category,
    quantity: product.quantity,
    price: product.price,
    expiry: product.expiry,
    status: product.status,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <MainLayout title="Admin Panel" subtitle="Manage your inventory system">
      {/* Admin Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Logged in as</p>
            <p className="font-medium text-foreground">{user?.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Button 
              variant="outline" 
              onClick={handleMigrateProfiles}
              disabled={isMigrating}
            >
              {isMigrating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Users className="h-4 w-4 mr-2" />
              )}
              Migrate Profiles
            </Button>
          )}
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-bold text-foreground">{stats.lowStock}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-bold text-foreground">{stats.outOfStock}</p>
            </div>
          </div>
        </div>
        <div className="stat-card gradient-primary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-background/20 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-primary-foreground/80">Today's Sales</p>
              <p className="text-2xl font-bold text-primary-foreground">₱{stats.todaysSales.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-10" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <Button 
          variant="gradient" 
          onClick={() => setAddDialogOpen(true)}
          disabled={!isAdmin}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {!isAdmin && (
        <div className="mb-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <p className="text-sm text-warning">
            You don't have admin privileges. Contact an administrator to get access.
          </p>
        </div>
      )}

      {/* Products Table */}
      <div className="chart-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Product</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Category</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Quantity</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Price</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Expiry</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productsLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-medium text-foreground">{product.name}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-muted-foreground">{product.category}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={cn(
                        "font-medium",
                        product.quantity === 0 ? "text-destructive" : 
                        product.quantity < 20 ? "text-warning" : "text-foreground"
                      )}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-foreground">₱{Number(product.price).toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-muted-foreground">{product.expiry}</span>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(product.status)}</td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => { setSelectedProduct(product); setEditDialogOpen(true); }}
                          disabled={!isAdmin}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive" 
                          onClick={() => { setSelectedProduct(product); setDeleteDialogOpen(true); }}
                          disabled={!isAdmin}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddProductDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen} 
        onAddProduct={handleAddProduct} 
      />
      <EditProductDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen} 
        product={selectedProduct ? convertToDialogProduct(selectedProduct) : null} 
        onEditProduct={handleEditProduct} 
      />
      <DeleteConfirmDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen} 
        product={selectedProduct ? convertToDialogProduct(selectedProduct) : null} 
        onConfirm={handleDeleteProduct} 
      />
    </MainLayout>
  );
};

export default Admin;
