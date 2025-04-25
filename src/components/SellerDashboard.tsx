
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductsBySeller, updateProductStatus, deleteProduct, subscribeToProducts } from "@/services/product";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Package, TrendingUp, Clock, AlertTriangle, Plus, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import GovernmentSchemes from "./seller/GovernmentSchemes";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getCurrentUser } from "@/services/auth";
import { getChatUsers } from "@/services/chat";
import ChatList from "./chat/ChatList";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PricePrediction from "./seller/PricePrediction";
import { supabase } from "@/integrations/supabase/client";

const SellerDashboard = () => {
  const { toast } = useToast();
  const user = getCurrentUser();
  const sellerId = user?.id || "";
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ['sellerProducts', sellerId],
    queryFn: () => getProductsBySeller(sellerId)
  });

  const { data: chatUsers = [] } = useQuery({
    queryKey: ['chatUsers', sellerId],
    queryFn: () => getChatUsers(sellerId),
    enabled: !!sellerId
  });

  // Subscribe to real-time product updates
  useEffect(() => {
    if (!sellerId) return;
    
    const channel = subscribeToProducts(sellerId, (payload) => {
      console.log("Real-time product change:", payload);
      queryClient.invalidateQueries({ queryKey: ['sellerProducts', sellerId] });
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sellerId, queryClient]);

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected' | 'unavailable') => {
    try {
      await updateProductStatus(id, status);
      toast({
        title: "Success",
        description: `Product status changed to ${status}.`,
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update product status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast({
        title: "Success",
        description: "Product deleted successfully.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not delete product.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading your products...</div>;
  }

  const approvedProducts = products.filter(p => p.status === 'approved');
  const pendingProducts = products.filter(p => p.status === 'pending');
  const unavailableProducts = products.filter(p => p.status === 'unavailable');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Seller Dashboard</h2>
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Chat with Buyers ({chatUsers.length})
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Chat with Buyers</SheetTitle>
              </SheetHeader>
              <ChatList users={chatUsers} />
            </SheetContent>
          </Sheet>
          <Link to="/add-product">
            <Button className="bg-farm-green hover:bg-farm-green-dark">
              <Plus className="mr-2 h-4 w-4" /> Add New Product
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Products</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedProducts.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingProducts.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unavailable</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unavailableProducts.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <GovernmentSchemes />
      
      <PricePrediction products={products} />
      
      <div className="space-y-4">
        {pendingProducts.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Pending Approval</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pendingProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  showChatButton={false}
                />
              ))}
            </div>
          </div>
        )}
        
        {approvedProducts.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Available Products</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {approvedProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  showChatButton={true}
                />
              ))}
            </div>
          </div>
        )}
        
        {unavailableProducts.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Unavailable Products</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {unavailableProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}
        
        {products.length === 0 && (
          <Card className="p-8 text-center">
            <CardHeader>
              <CardTitle>No Products Found</CardTitle>
              <CardDescription>You haven't added any products yet.</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Link to="/add-product">
                <Button className="bg-farm-green hover:bg-farm-green-dark">
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Product
                </Button>
              </Link>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
