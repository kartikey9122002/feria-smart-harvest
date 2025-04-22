import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductsBySeller, updateProductStatus, deleteProduct } from "@/services/product";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Package, TrendingUp, Clock, AlertTriangle, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import GovernmentSchemes from "./seller/GovernmentSchemes";

const SellerDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const sellerId = "1"; // In a real app, this would come from the authenticated user

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProductsBySeller(sellerId);
        setProducts(fetchedProducts);
      } catch (error) {
        toast({
          title: "Error fetching products",
          description: "Could not load your products. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [sellerId, toast]);

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected' | 'unavailable') => {
    try {
      const updatedProduct = await updateProductStatus(id, status);
      setProducts(products.map(product => 
        product.id === id ? updatedProduct : product
      ));
      toast({
        title: "Product updated",
        description: `Product status changed to ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Error updating product",
        description: "Could not update product status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter(product => product.id !== id));
      toast({
        title: "Product deleted",
        description: "Product has been removed from your inventory.",
      });
    } catch (error) {
      toast({
        title: "Error deleting product",
        description: "Could not delete product. Please try again.",
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
        <Link to="/add-product">
          <Button className="bg-farm-green hover:bg-farm-green-dark">
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </Link>
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
