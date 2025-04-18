
import { Order, OrderItem } from "@/types";

// Mock orders data
const MOCK_ORDERS: Order[] = [];

export const createOrder = async (
  buyerId: string,
  items: OrderItem[],
  shippingAddress: string
): Promise<Order> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const newOrder: Order = {
    id: `${MOCK_ORDERS.length + 1}`,
    buyerId,
    sellerId: "1", // For demo, using fixed seller ID
    items,
    totalAmount,
    status: 'pending',
    shippingAddress,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  MOCK_ORDERS.push(newOrder);
  return newOrder;
};

export const getOrdersByBuyer = async (buyerId: string): Promise<Order[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return MOCK_ORDERS.filter(order => order.buyerId === buyerId);
};

export const getOrdersBySeller = async (sellerId: string): Promise<Order[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return MOCK_ORDERS.filter(order => order.sellerId === sellerId);
};

export const updateOrderStatus = async (
  orderId: string, 
  status: Order['status']
): Promise<Order> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const orderIndex = MOCK_ORDERS.findIndex(order => order.id === orderId);
  if (orderIndex === -1) throw new Error('Order not found');
  
  MOCK_ORDERS[orderIndex] = {
    ...MOCK_ORDERS[orderIndex],
    status,
    updatedAt: new Date().toISOString(),
  };
  
  return MOCK_ORDERS[orderIndex];
};
