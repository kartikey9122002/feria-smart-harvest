
import { Order, OrderItem, OrderStatus, DeliveryStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { generateOrderReceipt } from "@/utils/receiptGenerator";
import { toast } from "@/hooks/use-toast";

// Get all orders for a buyer
export const getOrdersByBuyer = async (buyerId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(*)
    `)
    .eq("buyer_id", buyerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching buyer orders:", error);
    return [];
  }

  // Transform to match our Order type
  return (data || []).map(order => ({
    id: order.id,
    buyerId: order.buyer_id,
    sellerId: order.seller_id,
    items: order.order_items.map((item: any) => ({
      productId: item.product_id,
      quantity: item.quantity,
      price: item.price
    })),
    totalAmount: order.total_amount,
    status: order.status as OrderStatus,
    shippingAddress: order.shipping_address,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    deliveryStatus: order.delivery_status as DeliveryStatus,
    estimatedDeliveryDate: order.estimated_delivery_date,
    trackingNumber: order.tracking_number,
    deliveryNotes: order.delivery_notes
  }));
};

// Create a new order
export const createOrder = async (
  buyerId: string,
  items: OrderItem[],
  shippingAddress: string
): Promise<Order> => {
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const isFirstOrder = true; // This would need to be checked in a real app
  const orderData = {
    buyer_id: buyerId,
    seller_id: "1", // This would need to be set correctly in a real app
    total_amount: totalAmount,
    shipping_address: shippingAddress,
    is_first_order: isFirstOrder,
    status: 'pending' as OrderStatus,
    delivery_status: 'preparing' as DeliveryStatus,
  };

  // Begin a transaction
  const { data: orderData1, error: orderError } = await supabase
    .from("orders")
    .insert(orderData)
    .select()
    .single();

  if (orderError) {
    console.error("Error creating order:", orderError);
    throw new Error('Failed to create order');
  }

  // Add order items
  const orderItems = items.map(item => ({
    order_id: orderData1.id,
    product_id: item.productId,
    quantity: item.quantity,
    price: item.price
  }));

  const { error: itemError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemError) {
    console.error("Error adding order items:", itemError);
    throw new Error('Failed to add order items');
  }

  // Return the complete order
  const newOrder: Order = {
    id: orderData1.id,
    buyerId: orderData1.buyer_id,
    sellerId: orderData1.seller_id,
    items,
    totalAmount: orderData1.total_amount,
    status: orderData1.status,
    deliveryStatus: orderData1.delivery_status,
    shippingAddress: orderData1.shipping_address,
    createdAt: orderData1.created_at,
    updatedAt: orderData1.updated_at,
    trackingNumber: `TRK${Math.random().toString(36).substring(7).toUpperCase()}`,
    estimatedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  // Generate receipt
  try {
    generateOrderReceipt(newOrder);
    toast({
      title: "Order Receipt Generated",
      description: "Your order receipt has been downloaded.",
    });
  } catch (error) {
    console.error("Error generating receipt:", error);
  }

  return newOrder;
};

// Track order location
export const trackOrder = async (orderId: string): Promise<{ lat: number; lng: number } | null> => {
  const { data, error } = await supabase
    .from("orders")
    .select("tracking_location")
    .eq("id", orderId)
    .single();

  if (error || !data.tracking_location) {
    console.error("Error tracking order:", error);
    return null;
  }

  return {
    lat: data.tracking_location.lat,
    lng: data.tracking_location.lng
  };
};

// Subscribe to order updates
export const subscribeToOrder = (orderId: string, callback: (payload: any) => void) => {
  const channel = supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`
      },
      callback
    )
    .subscribe();

  return channel;
};
