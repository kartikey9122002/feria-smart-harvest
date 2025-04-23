
import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Profile } from "@/types/profile";
import { useNavigate } from "react-router-dom";

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
      fetchProfile(session?.user?.id ?? null);
    });

    // Load session/profile on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      fetchProfile(session?.user?.id ?? null);
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
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) setProfile(data as Profile);
    setIsLoading(false);
  }

  async function signIn(email: string, password: string) {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setIsLoading(false);
    // Redirect handled by effect
  }

  async function signUp(data: { name: string; email: string; password: string; role: string }) {
    setIsLoading(true);
    // 1. Register user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    if (signUpError) throw signUpError;

    // 2. Insert profile
    const userId = signUpData.user?.id;
    if (userId) {
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
      if (profileError) throw profileError;
    }
    setIsLoading(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    if (navigate) {
      navigate("/login");
    } else {
      window.location.href = "/login";
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
