import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  getFeaturedProducts: () => Product[];
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (query: string) => Product[];
  categories: string[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 299.99,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Electronics',
    stock: 50,
    featured: true
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Track your health and fitness with this advanced smartwatch featuring heart rate monitoring.',
    price: 399.99,
    image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Electronics',
    stock: 30,
    featured: true
  },
  {
    id: '3',
    name: 'Minimalist Backpack',
    description: 'Stylish and functional backpack perfect for work, travel, and everyday use.',
    price: 89.99,
    image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Fashion',
    stock: 25,
    featured: false
  },
  {
    id: '4',
    name: 'Organic Coffee Beans',
    description: 'Premium organic coffee beans sourced from sustainable farms around the world.',
    price: 24.99,
    image: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Food & Beverage',
    stock: 100,
    featured: true
  },
  {
    id: '5',
    name: 'Wireless Phone Charger',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 49.99,
    image: 'https://images.pexels.com/photos/4316839/pexels-photo-4316839.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Electronics',
    stock: 75,
    featured: false
  },
  {
    id: '6',
    name: 'Ceramic Plant Pot Set',
    description: 'Beautiful set of 3 ceramic plant pots perfect for indoor gardening.',
    price: 34.99,
    image: 'https://images.pexels.com/photos/4503821/pexels-photo-4503821.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Home & Garden',
    stock: 40,
    featured: false
  }
];

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const categories = Array.from(new Set(products.map(product => product.category)));

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
    };
    setProducts(current => [...current, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(current =>
      current.map(product =>
        product.id === id ? { ...product, ...updates } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(current => current.filter(product => product.id !== id));
  };

  const getProduct = (id: string) => {
    return products.find(product => product.id === id);
  };

  const getFeaturedProducts = () => {
    return products.filter(product => product.featured);
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  const searchProducts = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(
      product =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery)
    );
  };

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getFeaturedProducts,
    getProductsByCategory,
    searchProducts,
    categories,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};