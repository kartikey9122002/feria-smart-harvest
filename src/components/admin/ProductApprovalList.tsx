
import { Product } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface ProductApprovalListProps {
  products: Product[];
  onStatusChange: (id: string, status: 'approved' | 'rejected') => void;
}

export function ProductApprovalList({ products, onStatusChange }: ProductApprovalListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Seller</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.slice(0, 10).map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.sellerName}</TableCell>
            <TableCell>₹{product.price}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>
              {product.status === 'approved' && (
                <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" /> Approved</Badge>
              )}
              {product.status === 'pending' && (
                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                  <AlertTriangle className="mr-1 h-3 w-3" /> Pending
                </Badge>
              )}
              {product.status === 'rejected' && (
                <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Rejected</Badge>
              )}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                {product.status === 'pending' && (
                  <>
                    <Button 
                      size="sm" 
                      className="bg-farm-green hover:bg-farm-green-dark h-8 px-2 py-0"
                      onClick={() => onStatusChange(product.id, 'approved')}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="h-8 px-2 py-0"
                      onClick={() => onStatusChange(product.id, 'rejected')}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {product.status !== 'pending' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 px-2 py-0"
                  >
                    View
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
