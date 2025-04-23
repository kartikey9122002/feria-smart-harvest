
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

      // 3. Insert profile record using service role to bypass RLS
      // Note: In a production environment, this should be done in a secure server-side function
      // For now we'll use direct insertion which will work if no restrictive RLS is applied
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
        toast({
          title: "Profile creation failed",
          description: profileError.message || "Could not create profile. Please contact support.",
          variant: "destructive",
        });
        throw profileError;
      }

      toast({
        title: "Registration successful",
        description: "Your account has been created successfully!",
      });
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
