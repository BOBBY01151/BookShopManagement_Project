import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Shield, CreditCard } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency } from '../../utils/helpers';

const CartSummary = ({ onCheckout }) => {
  const { cartItems, getTotalPrice, getTotalItems } = useCart();

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const benefits = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over $50',
      active: subtotal > 50
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: 'Your data is protected',
      active: true
    },
    {
      icon: CreditCard,
      title: 'Easy Returns',
      description: '30-day return policy',
      active: true
    }
  ];

  if (cartItems.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Your cart is empty
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add some items to get started!
          </p>
          <Link
            to="/products"
            className="btn btn-primary w-full"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Order Summary
        </h3>

        <div className="space-y-3">
          {/* Items Count */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Items ({getTotalItems()})
            </span>
            <span className="text-gray-900 dark:text-white">
              {formatCurrency(subtotal)}
            </span>
          </div>

          {/* Shipping */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Shipping</span>
            <span className="text-gray-900 dark:text-white">
              {shipping === 0 ? (
                <span className="text-green-600 dark:text-green-400">Free</span>
              ) : (
                formatCurrency(shipping)
              )}
            </span>
          </div>

          {/* Tax */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Tax</span>
            <span className="text-gray-900 dark:text-white">
              {formatCurrency(tax)}
            </span>
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-gray-900 dark:text-white">Total</span>
              <span className="text-gray-900 dark:text-white">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={onCheckout}
          className="w-full btn btn-primary mt-6 py-3 text-base font-medium"
        >
          Proceed to Checkout
        </button>

        {/* Continue Shopping */}
        <Link
          to="/products"
          className="w-full btn btn-secondary mt-3 py-3 text-base font-medium text-center"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Benefits */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Why Shop with Us?
        </h3>

        <div className="space-y-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 p-3 rounded-lg ${
                benefit.active
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600'
              }`}
            >
              <benefit.icon
                className={`h-5 w-5 mt-0.5 ${
                  benefit.active
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              />
              <div>
                <h4
                  className={`font-medium ${
                    benefit.active
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {benefit.title}
                </h4>
                <p
                  className={`text-sm ${
                    benefit.active
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-gray-500 dark:text-gray-500'
                  }`}
                >
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promo Code */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Promo Code
        </h3>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter promo code"
            className="flex-1 input py-2"
          />
          <button className="btn btn-secondary px-4 py-2">
            Apply
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Popular codes: STUDENT10, BACKTOSCHOOL, SAVE20
        </p>
      </div>
    </div>
  );
};

export default CartSummary;
