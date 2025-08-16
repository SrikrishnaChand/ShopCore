import React from 'react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';

interface CartProps {
  onNavigate: (page: string) => void;
}

export const Cart: React.FC<CartProps> = ({ onNavigate }) => {
  const { items, updateQuantity, removeItem, getCartTotal, clearCart } = useCart();
  const { getProduct } = useProducts();

  const cartItems = items.map(item => ({
    ...item,
    product: getProduct(item.productId)!
  })).filter(item => item.product);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
          <button
            onClick={() => onNavigate('products')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 font-medium"
        >
          Clear Cart
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {cartItems.map(({ product, quantity }) => (
          <div key={product.id} className="flex items-center p-6 border-b border-gray-200 last:border-b-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            
            <div className="flex-1 ml-4">
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{product.category}</p>
              <p className="font-bold text-lg text-gray-900 mt-2">${product.price.toFixed(2)}</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              
              <span className="font-medium text-lg min-w-[2rem] text-center">
                {quantity}
              </span>
              
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                disabled={quantity >= product.stock}
                className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => removeItem(product.id)}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors ml-4"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <div className="flex justify-between items-center text-xl font-bold mb-6">
          <span>Total: ${getCartTotal().toFixed(2)}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onNavigate('products')}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => onNavigate('checkout')}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};