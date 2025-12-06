import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Filter, 
  Download,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { categories } from "@/data/products";
import { useProducts, DbProduct } from "@/hooks/useProducts";
import { useAuth } from "@/contexts/AuthContext";
import { AddProductDialog } from "@/components/inventory/AddProductDialog";
import { FilterDialog, FilterOptions } from "@/components/inventory/FilterDialog";
import { ExportDialog } from "@/components/inventory/ExportDialog";
import { EditProductDialog } from "@/components/inventory/EditProductDialog";
import { DeleteConfirmDialog } from "@/components/inventory/DeleteConfirmDialog";

const ITEMS_PER_PAGE = 10;

const Inventory = () => {
  const { products, isLoading, addProduct, updateProduct, deleteProduct } = useProducts();
  const { isAdmin } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<DbProduct | null>(null);
  
  const [filters, setFilters] = useState<FilterOptions>({
    stockStatus: [],
    sortBy: "name",
    sortOrder: "asc",
  });

  let filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filters.stockStatus.length === 0 || filters.stockStatus.includes(product.status);
    return matchesCategory && matchesSearch && matchesStatus;
  });

  filteredProducts = [...filteredProducts].sort((a, b) => {
    let comparison = 0;
    switch (filters.sortBy) {
      case "name": comparison = a.name.localeCompare(b.name); break;
      case "quantity": comparison = a.quantity - b.quantity; break;
      case "price": comparison = Number(a.price) - Number(b.price); break;
      case "expiry": comparison = new Date(a.expiry).getTime() - new Date(b.expiry).getTime(); break;
      case "category": comparison = a.category.localeCompare(b.category); break;
    }
    return filters.sortOrder === "desc" ? -comparison : comparison;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal": return <span className="badge-success">In Stock</span>;
      case "low": return <span className="badge-warning">Low Stock</span>;
      case "out": return <span className="badge-danger">Out of Stock</span>;
      default: return null;
    }
  };

  // Convert to format for export dialog
  const exportProducts = filteredProducts.map((p, idx) => ({
    id: idx + 1,
    name: p.name,
    category: p.category,
    quantity: p.quantity,
    price: Number(p.price),
    expiry: p.expiry,
    status: p.status,
  }));

  // Convert DbProduct to dialog format
  const convertToDialogProduct = (product: DbProduct) => ({
    id: 0,
    name: product.name,
    category: product.category,
    quantity: product.quantity,
    price: Number(product.price),
    expiry: product.expiry,
    status: product.status,
  });

  return (
    <MainLayout title="Inventory" subtitle="Manage your product inventory">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-10" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setFilterDialogOpen(true)}><Filter className="h-4 w-4 mr-2" />Filter</Button>
          <Button variant="outline" onClick={() => setExportDialogOpen(true)}><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button variant="gradient" onClick={() => setAddDialogOpen(true)} disabled={!isAdmin}><Plus className="h-4 w-4 mr-2" />Add Product</Button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button key={category} onClick={() => { setSelectedCategory(category); setCurrentPage(1); }} className={cn("pill-filter whitespace-nowrap", selectedCategory === category ? "pill-filter-active" : "pill-filter-inactive")}>{category}</button>
        ))}
      </div>

      <div className="chart-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Product</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Category</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Quantity</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Price</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Expiry Date</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">Loading products...</td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">No products found</td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-4 px-4"><span className="font-medium text-foreground">{product.name}</span></td>
                    <td className="py-4 px-4"><span className="text-sm text-muted-foreground">{product.category}</span></td>
                    <td className="py-4 px-4"><span className={cn("font-medium", product.quantity === 0 ? "text-destructive" : product.quantity < 20 ? "text-warning" : "text-foreground")}>{product.quantity}</span></td>
                    <td className="py-4 px-4"><span className="font-medium text-foreground">₱{Number(product.price).toFixed(2)}</span></td>
                    <td className="py-4 px-4"><span className="text-sm text-muted-foreground">{product.expiry}</span></td>
                    <td className="py-4 px-4">{getStatusBadge(product.status)}</td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedProduct(product); setEditDialogOpen(true); }} disabled={!isAdmin}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { setSelectedProduct(product); setDeleteDialogOpen(true); }} disabled={!isAdmin}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-4 border-t border-border">
          <p className="text-sm text-muted-foreground">Showing {paginatedProducts.length} of {filteredProducts.length} products</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => (
              <Button key={i + 1} variant="outline" size="sm" className={currentPage === i + 1 ? "bg-primary text-primary-foreground" : ""} onClick={() => setCurrentPage(i + 1)}>{i + 1}</Button>
            ))}
            <Button variant="outline" size="sm" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      <AddProductDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onAddProduct={handleAddProduct} />
      <FilterDialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen} filters={filters} onApplyFilters={setFilters} />
      <ExportDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} products={exportProducts} />
      <EditProductDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} product={selectedProduct ? convertToDialogProduct(selectedProduct) : null} onEditProduct={handleEditProduct} />
      <DeleteConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} product={selectedProduct ? convertToDialogProduct(selectedProduct) : null} onConfirm={handleDeleteProduct} />
    </MainLayout>
  );
};

export default Inventory;
