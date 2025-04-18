
import { Button } from "@/components/ui/button";
import { FileText, ShoppingBag, Users } from "lucide-react";

interface AdminNavProps {
  activePage: 'products' | 'schemes' | 'users';
  onPageChange: (page: 'products' | 'schemes' | 'users') => void;
}

export function AdminNav({ activePage, onPageChange }: AdminNavProps) {
  return (
    <div className="flex space-x-2">
      <Button 
        variant={activePage === 'products' ? 'default' : 'outline'} 
        onClick={() => onPageChange('products')}
        className={activePage === 'products' ? 'bg-farm-green hover:bg-farm-green-dark' : ''}
      >
        <ShoppingBag className="mr-2 h-4 w-4" />
        Products
      </Button>
      <Button 
        variant={activePage === 'schemes' ? 'default' : 'outline'} 
        onClick={() => onPageChange('schemes')}
        className={activePage === 'schemes' ? 'bg-farm-green hover:bg-farm-green-dark' : ''}
      >
        <FileText className="mr-2 h-4 w-4" />
        Govt Schemes
      </Button>
      <Button 
        variant={activePage === 'users' ? 'default' : 'outline'} 
        onClick={() => onPageChange('users')}
        className={activePage === 'users' ? 'bg-farm-green hover:bg-farm-green-dark' : ''}
      >
        <Users className="mr-2 h-4 w-4" />
        Users
      </Button>
    </div>
  );
}
