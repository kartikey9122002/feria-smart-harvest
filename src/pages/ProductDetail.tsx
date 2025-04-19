import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { generateProductReceipt } from "@/utils/receiptGenerator";
import Header from "@/components/Header";
import { getCurrentUser } from "@/services/auth";
import ChatInterface from "@/components/chat/ChatInterface";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    // Mock product data for demonstration
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Fresh Apples",
        description: "Delicious, locally grown apples.",
        price: 2.50,
        images: ["/apples.jpg"],
        category: "Fruits",
        sellerId: "1",
        sellerName: "Farmer Singh",
        status: "approved",
        createdAt: "2023-01-01T12:00:00.000Z",
        updatedAt: "2023-01-05T12:00:00.000Z",
      },
      {
        id: "2",
        name: "Organic Carrots",
        description: "Crisp and sweet organic carrots.",
        price: 1.80,
        images: ["/carrots.jpg"],
        category: "Vegetables",
        sellerId: "1",
        sellerName: "Farmer Singh",
        status: "approved",
        createdAt: "2023-01-01T12:00:00.000Z",
        updatedAt: "2023-01-05T12:00:00.000Z",
      },
      {
        id: "3",
        name: "Free-Range Eggs",
        description: "High-quality eggs from happy hens.",
        price: 4.00,
        images: ["/eggs.jpg"],
        category: "Dairy & Eggs",
        sellerId: "1",
        sellerName: "Farmer Singh",
        status: "approved",
        createdAt: "2023-01-01T12:00:00.000Z",
        updatedAt: "2023-01-05T12:00:00.000Z",
      },
      {
        id: "4",
        name: "Natural Honey",
        description: "Pure and sweet honey from local bees.",
        price: 8.00,
        images: ["/honey.jpg"],
        category: "Honey",
        sellerId: "1",
        sellerName: "Farmer Singh",
        status: "approved",
        createdAt: "2023-01-01T12:00:00.000Z",
        updatedAt: "2023-01-05T12:00:00.000Z",
      },
      {
        id: "5",
        name: "Fresh Milk",
        description: "Creamy and fresh milk from our cows.",
        price: 3.00,
        images: ["/milk.jpg"],
        category: "Dairy & Eggs",
        sellerId: "1",
        sellerName: "Farmer Singh",
        status: "approved",
        createdAt: "2023-01-01T12:00:00.000Z",
        updatedAt: "2023-01-05T12:00:00.000Z",
      },
    ];

    const foundProduct = mockProducts.find((p) => p.id === id);
    setProduct(foundProduct || null);
  }, [id]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-1">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full rounded-md shadow-md"
            />
          </div>
          <div className="md:col-span-1 space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-gray-600">Description: {product.description}</p>
            <p className="text-xl font-semibold">Price: ₹{product.price}</p>
            <p>Category: {product.category}</p>
            <div className="flex items-center space-x-2 text-gray-500">
              <Calendar className="h-4 w-4" />
              <p>
                Updated on:{" "}
                {new Date(product.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <Button onClick={() => generateProductReceipt(product)}>
              Download Receipt
            </Button>
          </div>
        </div>
        
        {/* Add Chat Interface */}
        {currentUser && product && currentUser.id !== product.sellerId && (
          <div className="fixed bottom-4 right-4">
            <ChatInterface otherUser={{
              id: product.sellerId,
              name: product.sellerName,
              role: 'seller',
              email: '',
            }} />
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;
