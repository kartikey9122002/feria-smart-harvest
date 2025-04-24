
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AddProduct from "./pages/AddProduct";
import ProductDetail from "./pages/ProductDetail";
import AdminDashboard from "./pages/AdminDashboard";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import GovernmentSchemes from "./pages/GovernmentSchemes";

// Properly implemented as React component
const ProtectedAdminRoute = () => {
  const { profile } = useAuth();
  return profile && profile.role === "admin" ? <AdminDashboard /> : <Navigate to="/dashboard" />;
};

// Add a Supabase test component to verify connection
const SupabaseTest = () => {
  console.log("Testing Supabase connection from component...");
  const { user, profile } = useAuth();
  
  useEffect(() => {
    // This will show in the console if Supabase connection is working
    console.log("Supabase auth state:", { user, profile });
    
    const testDatabase = async () => {
      try {
        const { data, error } = await supabase.from("profiles").select("*").limit(1);
        if (error) {
          console.error("Supabase DB test failed:", error);
        } else {
          console.log("Supabase DB test success:", data);
        }
      } catch (err) {
        console.error("Supabase test error:", err);
      }
    };
    
    testDatabase();
  }, [user]);
  
  return null; // This component doesn't render anything
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <SupabaseTest />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/admin" element={<ProtectedAdminRoute />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/government-schemes" element={<GovernmentSchemes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
