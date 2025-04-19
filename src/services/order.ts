import { Order, OrderItem, OrderStatus, DeliveryStatus } from "@/types";

const MOCK_ORDERS: Order[] = [];

export const createOrder = async (
  buyerId: string,
  items: OrderItem[],
  shippingAddress: string
): Promise<Order> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const newOrder: Order = {
    id: `${MOCK_ORDERS.length + 1}`,
    buyerId,
    sellerId: "1",
    items,
    totalAmount,
    status: 'pending',
    deliveryStatus: 'preparing',
    shippingAddress,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    trackingNumber: `TRK${Math.random().toString(36).substring(7).toUpperCase()}`,
    estimatedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
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
  status: OrderStatus,
  deliveryStatus?: DeliveryStatus
): Promise<Order> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const orderIndex = MOCK_ORDERS.findIndex(order => order.id === orderId);
  if (orderIndex === -1) throw new Error('Order not found');
  
  MOCK_ORDERS[orderIndex] = {
    ...MOCK_ORDERS[orderIndex],
    status,
    ...(deliveryStatus && { deliveryStatus }),
    updatedAt: new Date().toISOString(),
  };
  
  return MOCK_ORDERS[orderIndex];
};
