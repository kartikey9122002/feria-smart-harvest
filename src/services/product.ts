
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
  
  // Transform the Supabase data to match our Product type
  return (data || []).map(product => ({
    id: product.id,
    name: product.name,
    description: product.description || "",
    price: product.price,
    images: product.images,
    category: product.category,
    sellerId: product.seller_id,
    sellerName: product.seller_name,
    status: product.status,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
    inventoryCount: product.inventory_count || 0
  }));
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
  
  // Transform the Supabase data to match our Product type
  return (data || []).map(product => ({
    id: product.id,
    name: product.name,
    description: product.description || "",
    price: product.price,
    images: product.images,
    category: product.category,
    sellerId: product.seller_id,
    sellerName: product.seller_name,
    status: product.status,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
    inventoryCount: product.inventory_count || 0
  }));
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
  
  // Transform the Supabase data to match our Product type
  return (data || []).map(product => ({
    id: product.id,
    name: product.name,
    description: product.description || "",
    price: product.price,
    images: product.images,
    category: product.category,
    sellerId: product.seller_id,
    sellerName: product.seller_name,
    status: product.status,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
    inventoryCount: product.inventory_count || 0
  }));
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
  
  // Transform the Supabase data to match our Product type
  return (data || []).map(product => ({
    id: product.id,
    name: product.name,
    description: product.description || "",
    price: product.price,
    images: product.images,
    category: product.category,
    sellerId: product.seller_id,
    sellerName: product.seller_name,
    status: product.status,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
    inventoryCount: product.inventory_count || 0
  }));
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
  
  if (!data) return undefined;
  
  // Transform to match our Product type
  return {
    id: data.id,
    name: data.name,
    description: data.description || "",
    price: data.price,
    images: data.images,
    category: data.category,
    sellerId: data.seller_id,
    sellerName: data.seller_name,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    inventoryCount: data.inventory_count || 0
  };
};

// Create new product
export const createProduct = async (productData: Omit<Product, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  const newProduct = {
    name: productData.name,
    description: productData.description,
    price: productData.price,
    images: productData.images,
    category: productData.category,
    seller_id: productData.sellerId,
    seller_name: productData.sellerName,
    status: 'pending',
    inventory_count: productData.inventoryCount || 0
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
  
  // Transform to match our Product type
  return {
    id: data.id,
    name: data.name,
    description: data.description || "",
    price: data.price,
    images: data.images,
    category: data.category,
    sellerId: data.seller_id,
    sellerName: data.seller_name,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    inventoryCount: data.inventory_count || 0
  };
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
  
  // Transform to match our Product type
  return {
    id: data.id,
    name: data.name,
    description: data.description || "",
    price: data.price,
    images: data.images,
    category: data.category,
    sellerId: data.seller_id,
    sellerName: data.seller_name,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    inventoryCount: data.inventory_count || 0
  };
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
  
  // Transform to match our Product type
  return {
    id: data.id,
    name: data.name,
    description: data.description || "",
    price: data.price,
    images: data.images,
    category: data.category,
    sellerId: data.seller_id,
    sellerName: data.seller_name,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    inventoryCount: data.inventory_count || 0
  };
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
