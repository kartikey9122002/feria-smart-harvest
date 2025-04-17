
import { LoginCredentials, RegisterData, User } from "@/types";

// Mock authentication service
// In a real app, this would make API calls to your backend

const LOCAL_STORAGE_KEY = 'farmferia_auth';

// Mock users for demo
const MOCK_USERS = [
  {
    id: '1',
    name: 'Farmer Singh',
    email: 'farmer@example.com',
    password: 'password123',
    role: 'seller',
    avatar: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Consumer Kumar',
    email: 'buyer@example.com',
    password: 'password123',
    role: 'buyer',
    avatar: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    avatar: '/placeholder.svg'
  }
];

// Save authentication state to localStorage
const saveAuthState = (user: User, token: string) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ user, token }));
};

// Load authentication state from localStorage
export const loadAuthState = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (data) {
    return JSON.parse(data);
  }
  return { user: null, token: null };
};

// Clear authentication state
export const clearAuthState = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};

// Login function
export const login = async ({ email, password }: LoginCredentials): Promise<{ user: User, token: string }> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find user by email
  const user = MOCK_USERS.find(u => u.email === email);
  
  // Check if user exists and password matches
  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }
  
  // Create user without password and generate token
  const { password: _, ...userWithoutPassword } = user;
  const token = `mock-jwt-token-${Date.now()}`;
  
  // Save auth state
  saveAuthState(userWithoutPassword as User, token);
  
  return { user: userWithoutPassword as User, token };
};

// Register function
export const register = async (data: RegisterData): Promise<{ user: User, token: string }> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if email already exists
  if (MOCK_USERS.some(u => u.email === data.email)) {
    throw new Error('Email already registered');
  }
  
  // Create new user
  const newUser = {
    id: `${MOCK_USERS.length + 1}`,
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
    avatar: '/placeholder.svg'
  };
  
  // Add to mock database (in a real app, this would be a POST request)
  MOCK_USERS.push(newUser);
  
  // Create user without password and generate token
  const { password: _, ...userWithoutPassword } = newUser;
  const token = `mock-jwt-token-${Date.now()}`;
  
  // Save auth state
  saveAuthState(userWithoutPassword as User, token);
  
  return { user: userWithoutPassword as User, token };
};

// Logout function
export const logout = () => {
  clearAuthState();
};

// Get current user
export const getCurrentUser = (): User | null => {
  const { user } = loadAuthState();
  return user;
};
