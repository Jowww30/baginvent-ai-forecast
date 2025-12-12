import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2,
  Receipt,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProducts, DbProduct } from "@/hooks/useProducts";
import { useTransactions } from "@/hooks/useTransactions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CartItem {
  product: DbProduct;
  quantity: number;
  selectedBatches: { productId: string; quantity: number; expiry: string }[];
}

const Sales = () => {
  const { products, updateProduct } = useProducts();
  const { addTransaction } = useTransactions();
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter available products (not expired and in stock)
  const today = new Date().toISOString().split('T')[0];
  const availableProducts = products.filter(p => {
    const isNotExpired = p.expiry >= today;
    const isInStock = p.quantity > 0;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return isNotExpired && isInStock && matchesSearch;
  });

  // Sort by expiry date (FEFO - First Expired First Out)
  const sortedProducts = [...availableProducts].sort((a, b) => 
    new Date(a.expiry).getTime() - new Date(b.expiry).getTime()
  );

  // Group products by name for FEFO selection
  const getProductsByName = (name: string) => {
    return products
      .filter(p => p.name === name && p.expiry >= today && p.quantity > 0)
      .sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());
  };

  const addToCart = (product: DbProduct) => {
    const existingItem = cart.find(item => item.product.name === product.name);
    
    // Get all batches of this product sorted by expiry (FEFO)
    const allBatches = getProductsByName(product.name);
    const totalAvailable = allBatches.reduce((sum, p) => sum + p.quantity, 0);
    
    if (existingItem) {
      if (existingItem.quantity >= totalAvailable) {
        toast.error("Maximum quantity reached");
        return;
      }
      
      setCart(cart.map(item => 
        item.product.name === product.name 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { 
        product, 
        quantity: 1, 
        selectedBatches: [] 
      }]);
    }
  };

  const updateCartQuantity = (productName: string, delta: number) => {
    const allBatches = getProductsByName(productName);
    const totalAvailable = allBatches.reduce((sum, p) => sum + p.quantity, 0);

    setCart(cart.map(item => {
      if (item.product.name === productName) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return item;
        if (newQty > totalAvailable) {
          toast.error("Exceeds available stock");
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productName: string) => {
    setCart(cart.filter(item => item.product.name !== productName));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      for (const item of cart) {
        let remainingQty = item.quantity;
        const batches = getProductsByName(item.product.name);

        // FEFO: Deduct from earliest expiring batches first
        for (const batch of batches) {
          if (remainingQty <= 0) break;

          const deductQty = Math.min(remainingQty, batch.quantity);
          
          // Update product quantity
          await updateProduct(batch.id, { 
            quantity: batch.quantity - deductQty 
          });

          remainingQty -= deductQty;
        }

        // Record transaction
        await addTransaction({
          type: "sale",
          product_name: item.product.name,
          quantity: item.quantity,
          amount: item.product.price * item.quantity,
          customer: customerName || "Walk-in Customer",
          supplier: null,
        });
      }

      toast.success("Sale completed successfully!");
      setCart([]);
      setCustomerName("");
      setCheckoutOpen(false);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to process sale");
    } finally {
      setIsProcessing(false);
    }
  };

  const getDaysUntilExpiry = (expiry: string) => {
    const expiryDate = new Date(expiry);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    return Math.ceil((expiryDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <MainLayout title="Point of Sale" subtitle="FEFO-based sales with automatic stock deduction">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {sortedProducts.map((product) => {
              const daysUntilExpiry = getDaysUntilExpiry(product.expiry);
              const isExpiringSoon = daysUntilExpiry <= 7;
              
              return (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className={cn(
                    "chart-card p-4 text-left hover:border-primary/50 transition-all",
                    isExpiringSoon && "border-warning/50 bg-warning/5"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground truncate">
                      {product.category}
                    </span>
                    {isExpiringSoon && (
                      <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0" />
                    )}
                  </div>
                  <h3 className="font-medium text-foreground text-sm mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-primary">
                    ₱{product.price.toFixed(2)}
                  </p>
                  <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                    <span>Stock: {product.quantity}</span>
                    <span className={cn(
                      isExpiringSoon && "text-warning font-medium"
                    )}>
                      {daysUntilExpiry === 0 ? "Today" : `${daysUntilExpiry}d`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No available products found</p>
            </div>
          )}
        </div>

        {/* Cart Section */}
        <div className="lg:col-span-1">
          <div className="chart-card p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Cart</h2>
              <span className="ml-auto text-sm text-muted-foreground">
                {cart.length} items
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6">
                  {cart.map((item) => (
                    <div key={item.product.name} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          ₱{item.product.price.toFixed(2)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateCartQuantity(item.product.name, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateCartQuantity(item.product.name, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeFromCart(item.product.name)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ₱{cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <Button
                    variant="gradient"
                    className="w-full"
                    onClick={() => setCheckoutOpen(true)}
                  >
                    <Receipt className="h-4 w-4 mr-2" />
                    Checkout
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Sale</DialogTitle>
            <DialogDescription>
              Review the order and complete the transaction.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-3 mb-4 max-h-[200px] overflow-y-auto">
              {cart.map((item) => (
                <div key={item.product.name} className="flex justify-between text-sm">
                  <span className="text-foreground">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-foreground">
                    ₱{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border pt-4 mb-4">
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-primary">
                  ₱{cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer">Customer Name (Optional)</Label>
              <Input
                id="customer"
                placeholder="Walk-in Customer"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckoutOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="gradient" 
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Complete Sale"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Sales;
