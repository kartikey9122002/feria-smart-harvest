
import { Product } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  
  return data || [];
};

// Get products by sellerId
export const getProductsBySeller = async (sellerId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching seller products:", error);
    return [];
  }
  
  return data || [];
};

// Get products for admin (all products regardless of status)
export const getProductsForAdmin = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching admin products:", error);
    return [];
  }
  
  return data || [];
};

// Get products for buyers (only approved products)
export const getApprovedProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching approved products:", error);
    return [];
  }
  
  return data || [];
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | undefined> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching product by ID:", error);
    return undefined;
  }
  
  return data || undefined;
};

// Create new product
export const createProduct = async (productData: Omit<Product, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  const newProduct = {
    ...productData,
    status: 'pending',
  };
  
  const { data, error } = await supabase
    .from("products")
    .insert(newProduct)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating product:", error);
    throw new Error('Failed to create product');
  }
  
  return data;
};

// Update product status
export const updateProductStatus = async (id: string, status: 'approved' | 'rejected' | 'unavailable'): Promise<Product> => {
  const { data, error } = await supabase
    .from("products")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating product status:", error);
    throw new Error('Failed to update product status');
  }
  
  return data;
};

// Update inventory count
export const updateInventoryCount = async (id: string, count: number): Promise<Product> => {
  const { data, error } = await supabase
    .from("products")
    .update({ inventory_count: count, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating inventory count:", error);
    throw new Error('Failed to update inventory count');
  }
  
  return data;
};

// Delete product
export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error("Error deleting product:", error);
    throw new Error('Failed to delete product');
  }
};

// Subscribe to product changes
export const subscribeToProducts = (sellerId: string, callback: (payload: any) => void) => {
  const channel = supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'products',
        filter: `seller_id=eq.${sellerId}`
      },
      callback
    )
    .subscribe();
  
  return channel;
};
