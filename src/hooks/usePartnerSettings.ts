import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PartnerSettings {
  id: string;
  partner_name: string;
  primary_color: string;
  secondary_color: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

const defaultSettings: PartnerSettings = {
  id: "",
  partner_name: "Walang's Consumer Goods Trading",
  primary_color: "#DC2626",
  secondary_color: "#FFFFFF",
  logo_url: null,
  created_at: "",
  updated_at: "",
};

export function usePartnerSettings() {
  const [settings, setSettings] = useState<PartnerSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("partner_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching partner settings:", error);
    } else if (data) {
      setSettings(data as PartnerSettings);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (updates: Partial<PartnerSettings>) => {
    if (!settings.id) return null;

    const { data, error } = await supabase
      .from("partner_settings")
      .update(updates)
      .eq("id", settings.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating partner settings:", error);
      return null;
    }

    setSettings(data as PartnerSettings);
    return data;
  };

  return {
    settings,
    isLoading,
    updateSettings,
    refetch: fetchSettings,
  };
}
