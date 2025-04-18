
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCurrentUser } from "@/services/auth";
import { Product } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ShoppingCart, User, Map, Download, Phone, Mail, TrendingUp, LineChart, FileText } from "lucide-react";
import { getProductById } from "@/services/product";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = getCurrentUser();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const fetchedProduct = await getProductById(id);
        setProduct(fetchedProduct);
      } catch (error) {
        toast({
          title: "Error loading product",
          description: "Could not load product details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, toast]);

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${product?.name} has been added to your cart.`,
    });
  };

  const handleDownloadReceipt = () => {
    toast({
      title: "Downloading receipt",
      description: "Your receipt is being generated and downloaded.",
    });
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Product Not Found</h2>
            <p className="text-muted-foreground">The product you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`aspect-square bg-muted rounded-md overflow-hidden cursor-pointer border-2 ${
                    selectedImageIndex === index ? "border-farm-green" : "border-transparent"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-farm-green">{product.category}</Badge>
                <Badge variant="outline" className="text-farm-orange">
                  Free Delivery on orders over ₹200
                </Badge>
              </div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center mt-1 text-lg">
                <span className="font-bold text-2xl text-farm-green">₹{product.price}</span>
                <span className="text-muted-foreground ml-2">per kg</span>
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <p>{product.description}</p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">In Stock</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {user?.role === "buyer" && (
                <Button 
                  className="bg-farm-orange hover:bg-farm-orange-dark flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              )}
              
              {user?.role === "seller" && product.sellerId === user.id && (
                <Button 
                  className="bg-farm-green hover:bg-farm-green-dark flex-1"
                  onClick={handleDownloadReceipt}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Receipt
                </Button>
              )}
              
              {!user && (
                <Button 
                  className="bg-farm-green hover:bg-farm-green-dark flex-1"
                  onClick={() => navigate("/login")}
                >
                  Login to Purchase
                </Button>
              )}
            </div>

            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="seller">Seller Info</TabsTrigger>
                <TabsTrigger value="price">Price Prediction</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-medium">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{product.status}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Listed On</p>
                    <p className="font-medium">{new Date(product.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{new Date(product.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Delivery Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 text-farm-green">
                      <Map className="h-4 w-4" />
                      <span className="text-sm">Free delivery available for this product</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Estimated delivery: 1-2 business days
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Government Schemes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 text-farm-green">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Eligible for PM-KISAN subsidy</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Farmers growing this crop can apply for additional benefits
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="seller" className="pt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle>{product.sellerName}</CardTitle>
                        <CardDescription>Verified Seller</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="text-sm">Contact via platform messaging</p>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="text-sm">Contact number available after purchase</p>
                    </div>
                    <div className="mt-4">
                      <Button className="w-full bg-farm-green hover:bg-farm-green-dark">
                        Contact Seller
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="price" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Price Prediction</CardTitle>
                    <CardDescription>
                      Historical and predicted prices for this product
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-48 bg-muted rounded-md flex items-center justify-center">
                      <LineChart className="h-12 w-12 text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Price prediction chart (Demo)</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <p className="text-sm font-medium">
                        Prices expected to rise by 5% in the next month
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="bg-muted p-2 rounded-md text-center">
                        <p className="text-muted-foreground">Current</p>
                        <p className="font-medium">₹{product.price}</p>
                      </div>
                      <div className="bg-muted p-2 rounded-md text-center">
                        <p className="text-muted-foreground">30 Days</p>
                        <p className="font-medium">₹{Math.round(product.price * 1.05)}</p>
                      </div>
                      <div className="bg-muted p-2 rounded-md text-center">
                        <p className="text-muted-foreground">90 Days</p>
                        <p className="font-medium">₹{Math.round(product.price * 1.08)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
