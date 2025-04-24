
import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Profile } from "@/types/profile";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Profile type matches new DB `profiles` table (not in original types/index.ts)
export interface AuthContextType {
  user: SupabaseUser | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (data: { name: string; email: string; password: string; role: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up listener first for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.id);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Use setTimeout to avoid potential deadlock with Supabase client
        setTimeout(() => {
          fetchProfile(session.user.id);
        }, 0);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    // Load initial session/profile on mount
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session:", session?.user?.id);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  async function fetchProfile(userId: string) {
    console.log("Fetching profile for user:", userId);
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      // First try to get the profile with a direct query
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        
        // If profile doesn't exist yet, try to create it using user metadata
        if (error.code === "PGRST116") { // Record not found
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            const metadata = userData.user.user_metadata;
            const email = userData.user.email;
            
            console.log("Creating missing profile from metadata:", metadata);
            
            const { data: newProfile, error: insertError } = await supabase
              .from("profiles")
              .insert([
                {
                  id: userId,
                  name: metadata?.name || "User",
                  email: email,
                  role: metadata?.role || "buyer",
                  avatar_url: null
                }
              ])
              .select()
              .single();
              
            if (insertError) {
              console.error("Error creating profile:", insertError);
              toast({
                title: "Profile Error",
                description: "Could not create user profile. Some features may be limited.",
                variant: "destructive",
              });
            } else if (newProfile) {
              console.log("Successfully created profile:", newProfile);
              setProfile(newProfile as Profile);
            }
          }
        } else {
          toast({
            title: "Profile Error",
            description: "Could not load user profile. Please try logging out and back in.",
            variant: "destructive",
          });
        }
      } else if (data) {
        console.log("Found profile:", data);
        setProfile(data as Profile);
      }
    } catch (err) {
      console.error("Exception when fetching profile:", err);
      toast({
        title: "Profile Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      toast({
        title: "Login successful",
        description: "Welcome back to FarmFeria!",
      });
      
      // Navigation is handled by the auth state change listener
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Could not sign in. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function signUp(data: { name: string; email: string; password: string; role: string }) {
    setIsLoading(true);
    try {
      // 1. Register user with Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            // Store user metadata that can be used in RLS policies
            name: data.name,
            role: data.role
          }
        }
      });
      
      if (signUpError) throw signUpError;

      // 2. Get the new user ID
      const userId = signUpData.user?.id;
      if (!userId) throw new Error("User registration failed");

      // 3. Create profile record
      try {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              id: userId,
              name: data.name,
              email: data.email,
              avatar_url: null,
              role: data.role,
            }
          ]);

        if (profileError) {
          console.error("Profile creation error:", profileError);
          
          // Check if profile exists despite the error (RLS error)
          if (profileError.code === "42501") { // RLS violation
            const { data: checkProfile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", userId)
              .single();
              
            if (checkProfile) {
              console.log("Profile exists despite RLS error:", checkProfile);
            } else {
              // Try to create profile with auth.getUser() to get fresh token
              const { data: userData } = await supabase.auth.getUser();
              if (userData?.user) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay
                
                const { error: retryError } = await supabase
                  .from("profiles")
                  .insert([
                    {
                      id: userId,
                      name: data.name,
                      email: data.email,
                      avatar_url: null,
                      role: data.role,
                    }
                  ]);
                  
                if (retryError) {
                  console.error("Retry profile creation failed:", retryError);
                }
              }
            }
          }
        }
        
        toast({
          title: "Registration successful",
          description: "Your account has been created. You can now log in.",
        });
        
        // Redirect to login page
        navigate("/login");
        
      } catch (profileCreationError: any) {
        console.error("Profile creation exception:", profileCreationError);
        toast({
          title: "Profile creation failed",
          description: "An unexpected error occurred. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Could not create your account. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function signOut() {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      
      if (navigate) {
        navigate("/login");
      } else {
        window.location.href = "/login";
      }
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: error.message || "Could not sign out. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, signIn, signOut, signUp, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
