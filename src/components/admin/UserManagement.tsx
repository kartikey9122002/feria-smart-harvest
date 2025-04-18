
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types";
import { Search, UserX, Shield, ShieldCheck } from "lucide-react";

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Farmer",
    email: "john@example.com",
    role: "seller",
    avatar: "/placeholder.svg"
  },
  {
    id: "2",
    name: "Mary Buyer",
    email: "mary@example.com",
    role: "buyer",
    avatar: "/placeholder.svg"
  }
];

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setUsers(mockUsers);
      return;
    }
    
    const filtered = mockUsers.filter(user => 
      user.name.toLowerCase().includes(term.toLowerCase()) ||
      user.email.toLowerCase().includes(term.toLowerCase())
    );
    setUsers(filtered);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'seller' ? 'default' : 'secondary'}>
                      {user.role === 'seller' ? (
                        <Shield className="mr-1 h-3 w-3" />
                      ) : (
                        <ShieldCheck className="mr-1 h-3 w-3" />
                      )}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Active</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <UserX className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
