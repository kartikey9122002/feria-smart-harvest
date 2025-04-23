
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
    // Set up listener first
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
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

    // Load session/profile on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  async function fetchProfile(userId: string | null) {
    setProfile(null);
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else if (data) {
        setProfile(data as Profile);
      }
    } catch (err) {
      console.error("Exception when fetching profile:", err);
    }
    setIsLoading(false);
  }

  async function signIn(email: string, password: string) {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // Redirect handled by effect
    } catch (error: any) {
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

      // 3. Create profile record - try/catch separately to provide better error handling
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
            },
          ]);

        if (profileError) {
          console.error("Profile creation error:", profileError);
          
          // Special handling for RLS errors - verify if profile exists despite the error
          if (profileError.code === "42501") {
            console.log("RLS error - checking if profile was created anyway...");
            const { data: checkProfile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", userId)
              .single();
              
            if (checkProfile) {
              console.log("Profile exists despite RLS error:", checkProfile);
              // Profile exists, no need to throw an error
              toast({
                title: "Registration successful",
                description: "Your account has been created. You can now log in.",
              });
              return;
            }
          }
          
          // If we reach here, there was a real error
          toast({
            title: "Profile creation failed",
            description: profileError.message || "Could not create profile. Please contact support.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registration successful",
            description: "Your account has been created successfully!",
          });
        }
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
      if (navigate) {
        navigate("/login");
      } else {
        window.location.href = "/login";
      }
    } catch (error: any) {
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
