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

const categories = ["All", "Dairy", "Bakery", "Produce", "Meat", "Dry Goods", "Beverages"];

const products = [
  { id: 1, name: "Whole Milk 1L", category: "Dairy", quantity: 145, expiry: "2024-02-15", status: "normal" },
  { id: 2, name: "White Bread", category: "Bakery", quantity: 23, expiry: "2024-02-08", status: "low" },
  { id: 3, name: "Free Range Eggs (12)", category: "Dairy", quantity: 8, expiry: "2024-02-20", status: "low" },
  { id: 4, name: "Cheddar Cheese 500g", category: "Dairy", quantity: 67, expiry: "2024-03-01", status: "normal" },
  { id: 5, name: "Greek Yogurt", category: "Dairy", quantity: 0, expiry: "2024-02-10", status: "out" },
  { id: 6, name: "Organic Bananas", category: "Produce", quantity: 89, expiry: "2024-02-09", status: "normal" },
  { id: 7, name: "Chicken Breast 1kg", category: "Meat", quantity: 34, expiry: "2024-02-11", status: "normal" },
  { id: 8, name: "Olive Oil 500ml", category: "Dry Goods", quantity: 156, expiry: "2025-06-15", status: "normal" },
  { id: 9, name: "Orange Juice 1L", category: "Beverages", quantity: 12, expiry: "2024-02-18", status: "low" },
  { id: 10, name: "Butter 250g", category: "Dairy", quantity: 45, expiry: "2024-02-28", status: "normal" },
];

const Inventory = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return <span className="badge-success">In Stock</span>;
      case "low":
        return <span className="badge-warning">Low Stock</span>;
      case "out":
        return <span className="badge-danger">Out of Stock</span>;
      default:
        return null;
    }
  };

  return (
    <MainLayout title="Inventory" subtitle="Manage your product inventory">
      {/* Actions Bar */}
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
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="gradient">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Category Pills */}
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

      {/* Products Table */}
      <div className="chart-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Product</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Category</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Quantity</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Expiry Date</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
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
                      product.quantity < 25 ? "text-warning" : "text-foreground"
                    )}>
                      {product.quantity}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-muted-foreground">{product.expiry}</span>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Inventory;
