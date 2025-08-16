import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { ProductsPage } from './components/ProductsPage';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { Auth } from './components/Auth';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { useAuth } from './contexts/AuthContext';

type Page = 'home' | 'products' | 'categories' | 'cart' | 'checkout' | 'auth' | 'admin' | 'product';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const { user } = useAuth();

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    if (page !== 'products') {
      setSearchQuery('');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleViewProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage('product');
  };

  // Redirect non-admin users from admin page
  useEffect(() => {
    if (currentPage === 'admin' && (!user || user.role !== 'admin')) {
      setCurrentPage('home');
    }
  }, [currentPage, user]);

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} onViewProduct={handleViewProduct} />;
      case 'products':
      case 'categories':
        return <ProductsPage searchQuery={searchQuery} onViewProduct={handleViewProduct} />;
      case 'cart':
        return <Cart onNavigate={handleNavigate} />;
      case 'checkout':
        return user ? <Checkout onNavigate={handleNavigate} /> : <Auth onNavigate={handleNavigate} />;
      case 'auth':
        return <Auth onNavigate={handleNavigate} />;
      case 'admin':
        return user?.role === 'admin' ? <AdminDashboard /> : <HomePage onNavigate={handleNavigate} onViewProduct={handleViewProduct} />;
      case 'product':
        return <ProductsPage onViewProduct={handleViewProduct} />;
      default:
        return <HomePage onNavigate={handleNavigate} onViewProduct={handleViewProduct} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        onSearch={handleSearch}
      />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;