
import { useEffect, useState } from "react";
import { getApprovedProducts, getProductById } from "@/services/product";
import { Product } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import { Button } from "@/components/ui/button";
import { Mic, Search } from "lucide-react";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PriceChart from "./buyer/PriceChart";
import Map from "./map/Map";
import ChatInterface from "./chat/ChatInterface";
import { getCurrentUser } from "@/services/auth";
import { getGovernmentSchemes } from "@/services/governmentSchemes";
import { Skeleton } from "@/components/ui/skeleton";

const BuyerDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [schemes, setSchemes] = useState<any[]>([]);
  const [isTrackingOrder, setIsTrackingOrder] = useState(false);
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  // Voice search integration
  const { isListening, startListening } = useVoiceSearch({
    onResult: (transcript) => {
      setSearchQuery(transcript);
      toast({
        title: "Voice Search",
        description: `Searching for "${transcript}"`,
      });
    },
    onError: (error) => {
      toast({
        title: "Voice Search Error",
        description: error,
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getApprovedProducts();
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (error) {
        toast({
          title: "Error loading products",
          description: "Could not load products. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSchemes = async () => {
      try {
        const fetchedSchemes = await getGovernmentSchemes();
        setSchemes(fetchedSchemes);
      } catch (error) {
        console.error("Error loading government schemes:", error);
      }
    };

    fetchProducts();
    fetchSchemes();
  }, [toast]);

  useEffect(() => {
    let result = [...products];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Apply price filter
    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return 0;
      }
    });
    
    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, priceRange, sortBy, products]);

  const categories = [...new Set(products.map(product => product.category))];

  // Handler to properly update the price range state
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]] as [number, number]);
  };

  const handleViewProductDetail = async (productId: string) => {
    try {
      const product = await getProductById(productId);
      if (product) {
        setSelectedProduct(product);
        setShowProductDetail(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not load product details.",
        variant: "destructive",
      });
    }
  };

  const isEligibleForFreeDelivery = (price: number) => {
    // First order or order value > ₹200
    return price > 200;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <Skeleton className="h-[500px]" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[300px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Fresh Farm Products</h2>
            <p className="text-muted-foreground">
              Directly from local farmers to your table. Support local agriculture and enjoy the freshest produce.
            </p>
          </div>
          <Button 
            onClick={startListening} 
            className="flex items-center gap-2"
            variant={isListening ? "default" : "outline"}
          >
            {isListening ? <Mic className="h-4 w-4 text-white" /> : <Search className="h-4 w-4" />}
            Voice Search
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <ProductFilters
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onPriceRangeChange={handlePriceRangeChange}
          onSortChange={setSortBy}
          categories={categories}
          priceRange={priceRange}
          currentCategory={selectedCategory}
          currentSort={sortBy}
          searchValue={searchQuery}
        />
        
        <div className="space-y-6">
          {filteredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map(product => (
                <div key={product.id} className="group relative cursor-pointer" onClick={() => handleViewProductDetail(product.id)}>
                  <ProductCard key={product.id} product={product} />
                  {isEligibleForFreeDelivery(product.price) && (
                    <div className="absolute top-2 right-2 bg-farm-orange text-white px-2 py-1 rounded-full text-xs font-bold">
                      Free Delivery
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Dialog open={showProductDetail} onOpenChange={setShowProductDetail}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Product Details</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="aspect-video bg-muted rounded-md mb-3 overflow-hidden">
                  <img 
                    src={selectedProduct.images[0]} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold">Price Prediction</h3>
                  <PriceChart productId={selectedProduct.id} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
                <p className="text-muted-foreground mb-4">{selectedProduct.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold">₹{selectedProduct.price}</span>
                  {selectedProduct.inventoryCount !== undefined && (
                    <span className="text-sm text-muted-foreground">
                      {selectedProduct.inventoryCount > 0 
                        ? `${selectedProduct.inventoryCount} in stock` 
                        : "Out of stock"}
                    </span>
                  )}
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Seller Information</h3>
                  <p>{selectedProduct.sellerName}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Government Schemes</h3>
                  {schemes.length > 0 ? (
                    <div className="space-y-2">
                      {schemes.slice(0, 2).map(scheme => (
                        <div key={scheme.id} className="border p-2 rounded-md">
                          <p className="font-medium">{scheme.title}</p>
                          <p className="text-sm text-muted-foreground">{scheme.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No applicable government schemes</p>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button className="bg-farm-orange hover:bg-farm-orange-dark flex-1">
                    Add to Cart
                  </Button>
                  {currentUser && (
                    <ChatInterface 
                      otherUser={{
                        id: selectedProduct.sellerId,
                        name: selectedProduct.sellerName,
                        role: "seller",
                        email: ""
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Order Tracking Sheet */}
      <Sheet open={isTrackingOrder} onOpenChange={setIsTrackingOrder}>
        <SheetContent side="bottom" className="h-[90vh]">
          <SheetHeader>
            <SheetTitle>Track Your Order</SheetTitle>
          </SheetHeader>
          <div className="h-[80vh]">
            <Map initialLocation={{ lat: 28.6139, lng: 77.2090 }} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BuyerDashboard;
