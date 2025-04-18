import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/services/auth";
import { Product } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle, Users, ShoppingBag, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { getProductsForAdmin, updateProductStatus } from "@/services/product";
import UserManagement from "@/components/admin/UserManagement";
import GovtSchemes from "@/components/admin/GovtSchemes";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = getCurrentUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState<'products' | 'schemes' | 'users'>('products');

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (user.role !== "admin") {
      navigate("/dashboard");
      toast({
        title: "Access Denied",
        description: "Only admin users can access this page.",
        variant: "destructive",
      });
      return;
    }

    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProductsForAdmin();
        setProducts(fetchedProducts);
      } catch (error) {
        toast({
          title: "Error loading products",
          description: "Could not load products for approval. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [user, navigate, toast]);

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const updatedProduct = await updateProductStatus(id, status);
      setProducts(products.map(product => 
        product.id === id ? updatedProduct : product
      ));
      toast({
        title: "Product updated",
        description: `Product has been ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Error updating product",
        description: "Could not update product status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const pendingProducts = products.filter(p => p.status === 'pending');
  const approvedProducts = products.filter(p => p.status === 'approved');
  const rejectedProducts = products.filter(p => p.status === 'rejected');

  if (isLoading) {
    return <div className="text-center py-10">Loading admin dashboard...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
            <div className="flex space-x-2">
              <Button 
                variant={activePage === 'products' ? 'default' : 'outline'} 
                onClick={() => setActivePage('products')}
                className={activePage === 'products' ? 'bg-farm-green hover:bg-farm-green-dark' : ''}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Products
              </Button>
              <Button 
                variant={activePage === 'schemes' ? 'default' : 'outline'} 
                onClick={() => setActivePage('schemes')}
                className={activePage === 'schemes' ? 'bg-farm-green hover:bg-farm-green-dark' : ''}
              >
                <FileText className="mr-2 h-4 w-4" />
                Govt Schemes
              </Button>
              <Button 
                variant={activePage === 'users' ? 'default' : 'outline'} 
                onClick={() => setActivePage('users')}
                className={activePage === 'users' ? 'bg-farm-green hover:bg-farm-green-dark' : ''}
              >
                <Users className="mr-2 h-4 w-4" />
                Users
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingProducts.length}</div>
                <p className="text-xs text-muted-foreground">Products waiting for review</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Products</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvedProducts.length}</div>
                <p className="text-xs text-muted-foreground">Products available on marketplace</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected Products</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{rejectedProducts.length}</div>
                <p className="text-xs text-muted-foreground">Products not meeting standards</p>
              </CardContent>
            </Card>
          </div>
          
          {activePage === 'products' && (
            <div className="space-y-6">
              {pendingProducts.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Products Pending Approval</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {pendingProducts.map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {pendingProducts.length === 0 && (
                <Card className="p-8 text-center">
                  <CardHeader>
                    <CardTitle>No Pending Products</CardTitle>
                    <CardDescription>All products have been reviewed</CardDescription>
                  </CardHeader>
                </Card>
              )}
              
              <div>
                <h3 className="text-xl font-semibold mb-3">All Products</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.slice(0, 10).map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sellerName}</TableCell>
                        <TableCell>₹{product.price}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          {product.status === 'approved' && (
                            <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" /> Approved</Badge>
                          )}
                          {product.status === 'pending' && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                              <AlertTriangle className="mr-1 h-3 w-3" /> Pending
                            </Badge>
                          )}
                          {product.status === 'rejected' && (
                            <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Rejected</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {product.status === 'pending' && (
                              <>
                                <Button 
                                  size="sm" 
                                  className="bg-farm-green hover:bg-farm-green-dark h-8 px-2 py-0"
                                  onClick={() => handleStatusChange(product.id, 'approved')}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  className="h-8 px-2 py-0"
                                  onClick={() => handleStatusChange(product.id, 'rejected')}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {product.status !== 'pending' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8 px-2 py-0"
                              >
                                View
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          
          {activePage === 'schemes' && <GovtSchemes />}
          
          {activePage === 'users' && <UserManagement />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
