
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getCurrentUser, logout } from "@/services/auth";
import { UserRole } from "@/types";
import { Home, ShoppingCart, Package, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getNavigationItems = (role: UserRole) => {
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
          { path: "/dashboard", label: "Dashboard", icon: <Home className="mr-2 h-4 w-4" /> },
          { path: "/products", label: "Products", icon: <Package className="mr-2 h-4 w-4" /> },
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

        {user ? (
          <>
            <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
              {getNavigationItems(user.role).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-sm mr-2">{user.name}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
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
