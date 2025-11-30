import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export interface FilterOptions {
  stockStatus: string[];
  sortBy: string;
  sortOrder: string;
}

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
}

export function FilterDialog({ open, onOpenChange, filters, onApplyFilters }: FilterDialogProps) {
  const [stockStatus, setStockStatus] = useState<string[]>(filters.stockStatus);
  const [sortBy, setSortBy] = useState(filters.sortBy);
  const [sortOrder, setSortOrder] = useState(filters.sortOrder);

  const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      setStockStatus([...stockStatus, status]);
    } else {
      setStockStatus(stockStatus.filter(s => s !== status));
    }
  };

  const handleApply = () => {
    onApplyFilters({ stockStatus, sortBy, sortOrder });
    onOpenChange(false);
    toast.success("Filters applied");
  };

  const handleReset = () => {
    setStockStatus([]);
    setSortBy("name");
    setSortOrder("asc");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Filter Products</DialogTitle>
          <DialogDescription>
            Apply filters to narrow down your product list.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Stock Status */}
          <div className="grid gap-3">
            <Label className="text-sm font-medium">Stock Status</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="normal" 
                  checked={stockStatus.includes("normal")}
                  onCheckedChange={(checked) => handleStatusChange("normal", checked as boolean)}
                />
                <label htmlFor="normal" className="text-sm text-foreground">In Stock</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="low" 
                  checked={stockStatus.includes("low")}
                  onCheckedChange={(checked) => handleStatusChange("low", checked as boolean)}
                />
                <label htmlFor="low" className="text-sm text-foreground">Low Stock</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="out" 
                  checked={stockStatus.includes("out")}
                  onCheckedChange={(checked) => handleStatusChange("out", checked as boolean)}
                />
                <label htmlFor="out" className="text-sm text-foreground">Out of Stock</label>
              </div>
            </div>
          </div>

          {/* Sort By */}
          <div className="grid gap-2">
            <Label>Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="quantity">Quantity</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="expiry">Expiry Date</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div className="grid gap-2">
            <Label>Sort Order</Label>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <Button type="button" variant="ghost" onClick={handleReset}>
            Reset
          </Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="gradient" onClick={handleApply}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
