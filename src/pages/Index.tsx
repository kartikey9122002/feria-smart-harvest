
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { getCurrentUser } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Users, Sprout } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link to="/" className="flex items-center justify-center">
          <span className="text-2xl font-bold text-farm-green">FarmFeria</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link to="/login" className="text-sm font-medium hover:underline underline-offset-4">
            Login
          </Link>
          <Link to="/register" className="text-sm font-medium hover:underline underline-offset-4">
            Register
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    From Farm to Table
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Connect directly with local farmers and access fresh produce at fair prices.
                    Support sustainable agriculture and enjoy the freshest ingredients.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link to="/register">
                    <Button className="bg-farm-green hover:bg-farm-green-dark">Get Started</Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  alt="Farm Produce"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                  src="/placeholder.svg"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform connects farmers and consumers directly, eliminating middlemen and ensuring fair prices for everyone.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-farm-green">
                  <Sprout className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold">For Farmers</h3>
                <p className="text-muted-foreground">
                  List your products, set your prices, and sell directly to consumers without intermediaries.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-farm-orange">
                  <ShoppingCart className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold">For Consumers</h3>
                <p className="text-muted-foreground">
                  Browse fresh, local produce at fair prices and support farmers in your community.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-farm-brown">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold">For Communities</h3>
                <p className="text-muted-foreground">
                  Strengthen local agriculture, reduce food miles, and build resilient food systems.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t items-center px-4 md:px-6">
        <p className="text-xs text-muted-foreground">© 2025 FarmFeria. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link to="#" className="text-xs hover:underline underline-offset-4">Terms of Service</Link>
          <Link to="#" className="text-xs hover:underline underline-offset-4">Privacy</Link>
        </nav>
      </footer>
    </div>
  );
};

export default Index;
