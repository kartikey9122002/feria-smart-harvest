
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Get all government schemes
export const getGovernmentSchemes = async () => {
  try {
    const { data, error } = await supabase
      .from("government_schemes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching government schemes:", error);
    toast({
      title: "Error",
      description: "Failed to load government schemes",
      variant: "destructive",
    });
    return [];
  }
};

// Create a new government scheme (admin only)
export const createGovernmentScheme = async (scheme: {
  title: string;
  description: string;
  eligibility?: string;
  last_date?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("government_schemes")
      .insert([scheme])
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: "Success",
      description: "Government scheme created successfully",
    });
    
    return data;
  } catch (error) {
    console.error("Error creating government scheme:", error);
    toast({
      title: "Error",
      description: "Failed to create government scheme",
      variant: "destructive",
    });
    return null;
  }
};

// Update an existing government scheme (admin only)
export const updateGovernmentScheme = async (
  id: string,
  updates: {
    title?: string;
    description?: string;
    eligibility?: string;
    last_date?: string;
  }
) => {
  try {
    const { data, error } = await supabase
      .from("government_schemes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: "Success",
      description: "Government scheme updated successfully",
    });
    
    return data;
  } catch (error) {
    console.error("Error updating government scheme:", error);
    toast({
      title: "Error",
      description: "Failed to update government scheme",
      variant: "destructive",
    });
    return null;
  }
};

// Delete a government scheme (admin only)
export const deleteGovernmentScheme = async (id: string) => {
  try {
    const { error } = await supabase
      .from("government_schemes")
      .delete()
      .eq("id", id);

    if (error) throw error;
    
    toast({
      title: "Success",
      description: "Government scheme deleted successfully",
    });
    
    return true;
  } catch (error) {
    console.error("Error deleting government scheme:", error);
    toast({
      title: "Error",
      description: "Failed to delete government scheme",
      variant: "destructive",
    });
    return false;
  }
};
