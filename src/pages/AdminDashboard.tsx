import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/services/auth";
import { Product } from "@/types";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import { getProductsForAdmin, updateProductStatus } from "@/services/product";
import UserManagement from "@/components/admin/UserManagement";
import GovtSchemes from "@/components/admin/GovtSchemes";
import { AdminStats } from "@/components/admin/AdminStats";
import { AdminNav } from "@/components/admin/AdminNav";
import { ProductApprovalList } from "@/components/admin/ProductApprovalList";

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
            <AdminNav activePage={activePage} onPageChange={setActivePage} />
          </div>

          <AdminStats 
            pendingProducts={pendingProducts}
            approvedProducts={approvedProducts}
            rejectedProducts={rejectedProducts}
          />
          
          {activePage === 'products' && (
            <div className="space-y-6">
              {pendingProducts.length > 0 ? (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Products Pending Approval</h3>
                  <ProductApprovalList 
                    products={pendingProducts}
                    onStatusChange={handleStatusChange}
                  />
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <h3 className="text-xl font-semibold">No Pending Products</h3>
                  <p className="text-muted-foreground">All products have been reviewed</p>
                </Card>
              )}
              
              <div>
                <h3 className="text-xl font-semibold mb-3">All Products</h3>
                <ProductApprovalList 
                  products={products}
                  onStatusChange={handleStatusChange}
                />
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
