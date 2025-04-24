
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { UserRole } from "@/types";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AuthFormProps {
  type: "login" | "register";
}

const AuthForm = ({ type }: AuthFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, isLoading: authLoading } = useAuth();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("buyer");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{ [key: string]: boolean }>({
    minLength: false,
  });

  const validatePassword = (value: string) => {
    const errors = {
      minLength: value.length < 6,
    };
    
    setPasswordErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (type === "register") {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (type === "login") {
        if (!email || !password) {
          throw new Error("Please enter both email and password");
        }
        
        await signIn(email, password);
        // Navigation is handled in the auth hook
      } else {
        // Registration validation
        if (!name) {
          throw new Error("Please enter your name");
        }
        
        if (!email) {
          throw new Error("Please enter your email address");
        }
        
        if (!validatePassword(password)) {
          throw new Error("Password must be at least 6 characters");
        }
        
        await signUp({ email, password, name, role });
        // Navigation is handled in the auth hook
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      setError(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isProcessing = isSubmitting || authLoading;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{type === "login" ? "Login" : "Create an Account"}</CardTitle>
        <CardDescription>
          {type === "login"
            ? "Enter your credentials to access your account"
            : "Fill in the details to create your FarmFeria account"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {type === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isProcessing}
                autoComplete="name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isProcessing}
              autoComplete={type === "login" ? "username" : "email"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              required
              disabled={isProcessing}
              autoComplete={type === "login" ? "current-password" : "new-password"}
            />
            {type === "register" && (
              <div className="text-xs text-muted-foreground">
                <p className={passwordErrors.minLength ? "text-destructive" : ""}>
                  • Password must be at least 6 characters
                </p>
              </div>
            )}
          </div>

          {type === "register" && (
            <div className="space-y-2">
              <Label>I am a</Label>
              <RadioGroup
                value={role}
                onValueChange={(value) => setRole(value as UserRole)}
                className="flex flex-col space-y-1"
                disabled={isProcessing}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="seller" id="seller" />
                  <Label htmlFor="seller">Farmer (Seller)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="buyer" id="buyer" />
                  <Label htmlFor="buyer">Consumer (Buyer)</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full bg-farm-green hover:bg-farm-green-dark"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {type === "login" ? "Logging in..." : "Creating account..."}
              </>
            ) : (
              type === "login" ? "Login" : "Create Account"
            )}
          </Button>
          
          <div className="text-center text-sm">
            {type === "login" ? (
              <p>
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal text-farm-green hover:text-farm-green-dark"
                  onClick={() => navigate("/register")}
                  disabled={isProcessing}
                >
                  Register now
                </Button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal text-farm-green hover:text-farm-green-dark"
                  onClick={() => navigate("/login")}
                  disabled={isProcessing}
                >
                  Login
                </Button>
              </p>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;
