
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/services/auth";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import BuyerDashboard from "@/components/BuyerDashboard";
import SellerDashboard from "@/components/SellerDashboard";

const Products = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect in useEffect
  }

  // For this demo, we'll reuse components from Dashboard
  // In a real app, you might have more specialized components for this page
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {user.role === "seller" && <SellerDashboard />}
        {user.role === "buyer" && <BuyerDashboard />}
        {user.role === "admin" && (
          <div className="text-center py-10">
            <h2 className="text-3xl font-bold tracking-tight">Product Management</h2>
            <p className="text-muted-foreground mt-2">
              Admin product management features not implemented in this version.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
