
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import SellerDashboard from "@/components/SellerDashboard";
import BuyerDashboard from "@/components/BuyerDashboard";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !profile) {
      navigate("/login");
    }
  }, [profile, isLoading, navigate]);

  if (isLoading || !profile) {
    return null; // Will redirect or still loading
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {profile.role === "seller" && <SellerDashboard />}
        {profile.role === "buyer" && <BuyerDashboard />}
        {profile.role === "admin" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
              <Button 
                onClick={() => navigate("/admin")}
                className="bg-farm-green hover:bg-farm-green-dark flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Go to Admin Panel
              </Button>
            </div>
            <p className="text-muted-foreground">
              Welcome to the admin dashboard. Use the button above or the navigation link to access the full admin panel.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
