import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { Package, ShoppingCart, AlertCircle, CheckCircle, XCircle, ReceiptText } from "lucide-react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "@/services/auth";
import ChatInterface from "./chat/ChatInterface";
import { generateProductReceipt } from "@/utils/receiptGenerator";

interface ProductCardProps {
  product: Product;
  onStatusChange?: (id: string, status: 'approved' | 'rejected' | 'unavailable') => void;
  onDelete?: (id: string) => void;
  showChatButton?: boolean;
}

const ProductCard = ({ product, onStatusChange, onDelete, showChatButton = false }: ProductCardProps) => {
  const user = getCurrentUser();
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" /> Approved</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><AlertCircle className="mr-1 h-3 w-3" /> Pending Approval</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Rejected</Badge>;
      case "unavailable":
        return <Badge variant="secondary"><AlertCircle className="mr-1 h-3 w-3" /> Currently Unavailable</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
          {getStatusBadge(product.status)}
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <div className="aspect-video bg-muted rounded-md mb-3 overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg">₹{product.price}</p>
          <Badge variant="outline" className="bg-muted/50">{product.category}</Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex flex-wrap gap-2">
        {user?.role === "seller" && (
          <>
            {showChatButton && (
              <ChatInterface 
                otherUser={{
                  id: "buyer-1",
                  name: "Buyer",
                  email: "buyer@example.com",
                  role: "buyer"
                }}
              />
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => generateProductReceipt(product)}
            >
              <ReceiptText className="mr-1 h-4 w-4" /> Download Receipt
            </Button>
            {product.status === "approved" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onStatusChange?.(product.id, "unavailable")}
              >
                <Package className="mr-1 h-4 w-4" /> Mark Unavailable
              </Button>
            )}
            {product.status === "unavailable" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onStatusChange?.(product.id, "approved")}
              >
                <Package className="mr-1 h-4 w-4" /> Mark Available
              </Button>
            )}
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex-1"
              onClick={() => onDelete?.(product.id)}
            >
              <XCircle className="mr-1 h-4 w-4" /> Delete
            </Button>
          </>
        )}
        
        {user?.role === "admin" && (
          <>
            {product.status === "pending" && (
              <>
                <Button 
                  className="bg-farm-green hover:bg-farm-green-dark flex-1" 
                  size="sm"
                  onClick={() => onStatusChange?.(product.id, "approved")}
                >
                  <CheckCircle className="mr-1 h-4 w-4" /> Approve
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onStatusChange?.(product.id, "rejected")}
                >
                  <XCircle className="mr-1 h-4 w-4" /> Reject
                </Button>
              </>
            )}
          </>
        )}
        
        {user?.role === "buyer" && (
          <Button className="bg-farm-orange hover:bg-farm-orange-dark w-full">
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        )}
        
        {!user && (
          <Link to="/login" className="w-full">
            <Button className="w-full bg-farm-green hover:bg-farm-green-dark">
              Login to Purchase
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
