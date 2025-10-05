import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              404
            </div>
            <div className="w-24 h-24 mx-auto mb-6">
              <svg
                className="w-full h-full text-gray-400 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.9-6.1-2.4l1.4-1.4A5.97 5.97 0 0012 13c1.66 0 3.2-.67 4.3-1.7l1.4 1.4z"
                />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/"
              className="w-full btn btn-primary py-3 text-base font-medium inline-flex items-center justify-center space-x-2"
            >
              <Home className="h-5 w-5" />
              <span>Go Home</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="w-full btn btn-secondary py-3 text-base font-medium inline-flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Go Back</span>
            </button>

            <Link
              to="/products"
              className="w-full btn btn-secondary py-3 text-base font-medium inline-flex items-center justify-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>Browse Products</span>
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            <p>
              Need help?{' '}
              <Link
                to="/contact"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
