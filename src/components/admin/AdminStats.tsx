
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Product } from "@/types";

interface AdminStatsProps {
  pendingProducts: Product[];
  approvedProducts: Product[];
  rejectedProducts: Product[];
}

export function AdminStats({ pendingProducts, approvedProducts, rejectedProducts }: AdminStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingProducts.length}</div>
          <p className="text-xs text-muted-foreground">Products waiting for review</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved Products</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{approvedProducts.length}</div>
          <p className="text-xs text-muted-foreground">Products available on marketplace</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rejected Products</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rejectedProducts.length}</div>
          <p className="text-xs text-muted-foreground">Products not meeting standards</p>
        </CardContent>
      </Card>
    </div>
  );
}
