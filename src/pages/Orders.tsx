
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrdersByBuyer } from '@/services/order';
import { getCurrentUser } from '@/services/auth';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Order, DeliveryStatus } from '@/types';
import { Package, Truck, MapPin, Clock } from 'lucide-react';

const Orders = () => {
  const user = getCurrentUser();
  
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

  const getDeliveryStatusIcon = (status: DeliveryStatus) => {
    switch (status) {
      case 'preparing':
        return <Package className="h-4 w-4" />;
      case 'in_transit':
        return <Truck className="h-4 w-4" />;
      case 'out_for_delivery':
        return <MapPin className="h-4 w-4" />;
      case 'delivered':
        return <Clock className="h-4 w-4" />;
    }
  };

  const getDeliveryStatusBadgeColor = (status: DeliveryStatus) => {
    switch (status) {
      case 'preparing':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'in_transit':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'delivered':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
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
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusBadgeColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <Badge className={getDeliveryStatusBadgeColor(order.deliveryStatus)}>
                      <span className="flex items-center gap-1">
                        {getDeliveryStatusIcon(order.deliveryStatus)}
                        {order.deliveryStatus.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Order Items */}
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
                  
                  {/* Delivery Information */}
                  <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                    <h4 className="font-semibold">Delivery Information</h4>
                    {order.trackingNumber && (
                      <p className="text-sm">
                        <span className="font-medium">Tracking Number:</span> {order.trackingNumber}
                      </p>
                    )}
                    {order.estimatedDeliveryDate && (
                      <p className="text-sm">
                        <span className="font-medium">Estimated Delivery:</span>{' '}
                        {format(new Date(order.estimatedDeliveryDate), 'PPP')}
                      </p>
                    )}
                    <p className="text-sm">
                      <span className="font-medium">Shipping Address:</span> {order.shippingAddress}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="font-semibold">Total</p>
                    <p className="font-semibold">₹{order.totalAmount}</p>
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
