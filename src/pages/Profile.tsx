
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { User, Mail, UserCircle, Edit } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { profile, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !profile) {
      navigate("/login");
    }
  }, [profile, isLoading, navigate]);

  if (isLoading || !profile) {
    return null; // Will redirect in useEffect or still loading
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Your Profile</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    <UserCircle className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profile Picture</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="text-xs" disabled>
                        <Edit className="mr-2 h-3 w-3" />
                        Change
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <Button className="bg-farm-green hover:bg-farm-green-dark" disabled>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="grid gap-1">
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{profile.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 border-b pb-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="grid gap-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-farm-green" />
                  <div className="grid gap-1">
                    <p className="text-sm text-muted-foreground">Account Type</p>
                    <p className="font-medium capitalize">{profile.role}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" disabled>Change Password</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
