
import { useEffect, useState } from "react";
import { getApprovedProducts } from "@/services/product";
import { Product } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";

const BuyerDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

    fetchProducts();
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

  if (isLoading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-4">Fresh Farm Products</h2>
        <p className="text-muted-foreground">
          Directly from local farmers to your table. Support local agriculture and enjoy the freshest produce.
        </p>
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
        />
        
        <div className="space-y-6">
          {filteredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
