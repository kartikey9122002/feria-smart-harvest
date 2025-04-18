
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrdersByBuyer } from '@/services/order';
import { getCurrentUser } from '@/services/auth';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Order } from '@/types';

const Orders = () => {
  const user = getCurrentUser();
  
  // Fetch orders for the current user
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => getOrdersByBuyer(user?.id || ''),
    enabled: !!user?.id,
  });

  const getStatusBadgeColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'delivered':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        
        {isLoading && (
          <div className="flex justify-center items-center h-40">
            <p>Loading orders...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md">
            <p>Error loading orders. Please try again.</p>
          </div>
        )}

        {orders && orders.length === 0 && (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium mb-2">No orders yet</h3>
            <p className="text-muted-foreground">
              When you place an order, it will appear here.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {orders && orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <CardDescription>
                      {format(new Date(order.createdAt), 'PPP')}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusBadgeColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Product #{item.productId}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center pt-2">
                    <p className="font-semibold">Total</p>
                    <p className="font-semibold">₹{order.totalAmount}</p>
                  </div>
                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Shipping Address:</span> {order.shippingAddress}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Orders;
