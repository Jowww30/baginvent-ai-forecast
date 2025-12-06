import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DbTransaction {
  id: string;
  type: "sale" | "purchase";
  product_name: string;
  quantity: number;
  amount: number;
  customer: string | null;
  supplier: string | null;
  created_at: string;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<DbTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions");
    } else {
      setTransactions((data || []) as DbTransaction[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async (transaction: Omit<DbTransaction, "id" | "created_at">) => {
    const { data, error } = await supabase
      .from("transactions")
      .insert([transaction])
      .select()
      .single();

    if (error) {
      console.error("Error adding transaction:", error);
      toast.error("Failed to add transaction");
      return null;
    }

    const newTransaction = data as DbTransaction;
    setTransactions([newTransaction, ...transactions]);
    return newTransaction;
  };

  const getTodaysSales = () => {
    const today = new Date().toISOString().split("T")[0];
    return transactions
      .filter(t => t.type === "sale" && t.created_at.startsWith(today))
      .reduce((sum, t) => sum + Number(t.amount), 0);
  };

  return {
    transactions,
    isLoading,
    addTransaction,
    getTodaysSales,
    refetch: fetchTransactions,
  };
}
