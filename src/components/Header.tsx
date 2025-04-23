
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Home, ShoppingCart, Package, User, LogOut, Shield } from "lucide-react";

const Header = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const getNavigationItems = (role: string) => {
    switch (role) {
      case "seller":
        return [
          { path: "/dashboard", label: "Dashboard", icon: <Home className="mr-2 h-4 w-4" /> },
          { path: "/products", label: "My Products", icon: <Package className="mr-2 h-4 w-4" /> },
          { path: "/profile", label: "Profile", icon: <User className="mr-2 h-4 w-4" /> }
        ];
      case "buyer":
        return [
          { path: "/dashboard", label: "Home", icon: <Home className="mr-2 h-4 w-4" /> },
          { path: "/products", label: "Shop", icon: <ShoppingCart className="mr-2 h-4 w-4" /> },
          { path: "/profile", label: "Profile", icon: <User className="mr-2 h-4 w-4" /> }
        ];
      case "admin":
        return [
          { path: "/admin", label: "Admin Panel", icon: <Shield className="mr-2 h-4 w-4" />, highlight: true },
          { path: "/dashboard", label: "Dashboard", icon: <Home className="mr-2 h-4 w-4" /> },
          { path: "/profile", label: "Profile", icon: <User className="mr-2 h-4 w-4" /> }
        ];
      default:
        return [];
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-xl items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-farm-green">FarmFeria</span>
          </Link>
        </div>

        {profile ? (
          <>
            <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
              {getNavigationItems(profile.role).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                    item.highlight ? 'text-farm-green font-bold' : ''
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center space-x-4">
              <div className="flex items-center">
                {profile.role === "admin" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate("/admin")}
                    className="mr-2 flex items-center bg-farm-green text-white hover:bg-farm-green-dark"
                  >
                    <Shield className="mr-1 h-4 w-4" /> Admin Panel
                  </Button>
                )}
                <span className="text-sm mr-2">{profile.name}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={signOut}
                  className="flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="ml-auto flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-farm-green hover:bg-farm-green-dark" size="sm">Register</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
