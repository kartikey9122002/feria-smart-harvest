
import { Product } from "@/types";

// Mock product data
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Fresh Organic Tomatoes',
    description: 'Locally grown organic tomatoes, perfect for salads and cooking.',
    price: 50, // Price in ₹
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    category: 'Vegetable',
    sellerId: '1',
    sellerName: 'Farmer Singh',
    status: 'approved',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Premium Basmati Rice',
    description: '100% authentic basmati rice, aromatic and long grain.',
    price: 150, // Price in ₹
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    category: 'Grain',
    sellerId: '1',
    sellerName: 'Farmer Singh',
    status: 'approved',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Fresh Farm Eggs',
    description: 'Free-range chicken eggs, high in protein and freshly collected daily.',
    price: 80, // Price in ₹
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    category: 'Poultry',
    sellerId: '1',
    sellerName: 'Farmer Singh',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Organic Potatoes',
    description: 'Pesticide-free potatoes, perfect for all your cooking needs.',
    price: 40, // Price in ₹
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    category: 'Vegetable',
    sellerId: '1',
    sellerName: 'Farmer Singh',
    status: 'approved',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return MOCK_PRODUCTS;
};

// Get products by sellerId
export const getProductsBySeller = async (sellerId: string): Promise<Product[]> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return MOCK_PRODUCTS.filter(product => product.sellerId === sellerId);
};

// Get products for buyers (only approved products)
export const getApprovedProducts = async (): Promise<Product[]> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return MOCK_PRODUCTS.filter(product => product.status === 'approved');
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | undefined> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_PRODUCTS.find(product => product.id === id);
};

// Create new product
export const createProduct = async (productData: Omit<Product, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newProduct: Product = {
    ...productData,
    id: `${MOCK_PRODUCTS.length + 1}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  MOCK_PRODUCTS.push(newProduct);
  return newProduct;
};

// Update product status
export const updateProductStatus = async (id: string, status: 'approved' | 'rejected' | 'unavailable'): Promise<Product> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const productIndex = MOCK_PRODUCTS.findIndex(product => product.id === id);
  if (productIndex === -1) {
    throw new Error('Product not found');
  }
  
  MOCK_PRODUCTS[productIndex] = {
    ...MOCK_PRODUCTS[productIndex],
    status,
    updatedAt: new Date().toISOString()
  };
  
  return MOCK_PRODUCTS[productIndex];
};

// Delete product
export const deleteProduct = async (id: string): Promise<void> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const productIndex = MOCK_PRODUCTS.findIndex(product => product.id === id);
  if (productIndex === -1) {
    throw new Error('Product not found');
  }
  
  MOCK_PRODUCTS.splice(productIndex, 1);
};
