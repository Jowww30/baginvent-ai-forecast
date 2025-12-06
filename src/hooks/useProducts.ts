import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DbProduct {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  expiry: string;
  status: "normal" | "low" | "out";
  created_at: string;
  updated_at: string;
}

export function useProducts() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } else {
      setProducts((data || []) as DbProduct[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: Omit<DbProduct, "id" | "status" | "created_at" | "updated_at">) => {
    const status = product.quantity === 0 ? "out" : product.quantity < 20 ? "low" : "normal";
    
    const { data, error } = await supabase
      .from("products")
      .insert([{ ...product, status }])
      .select()
      .single();

    if (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product. Make sure you're logged in as admin.");
      return null;
    }

    const newProduct = data as DbProduct;
    setProducts([newProduct, ...products]);
    toast.success("Product added successfully!");
    return newProduct;
  };

  const updateProduct = async (id: string, updates: Partial<DbProduct>) => {
    const quantity = updates.quantity ?? products.find(p => p.id === id)?.quantity ?? 0;
    const status = quantity === 0 ? "out" : quantity < 20 ? "low" : "normal";

    const { data, error } = await supabase
      .from("products")
      .update({ ...updates, status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Make sure you're logged in as admin.");
      return null;
    }

    const updatedProduct = data as DbProduct;
    setProducts(products.map(p => (p.id === id ? updatedProduct : p)));
    toast.success("Product updated successfully!");
    return updatedProduct;
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product. Make sure you're logged in as admin.");
      return false;
    }

    setProducts(products.filter(p => p.id !== id));
    toast.success("Product deleted successfully!");
    return true;
  };

  return {
    products,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
}
