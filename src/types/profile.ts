
export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
  role: string;
  created_at?: string;
  updated_at?: string;
}
