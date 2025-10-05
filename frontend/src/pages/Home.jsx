import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  PenTool, 
  Gamepad2, 
  Palette, 
  Backpack, 
  Star,
  ArrowRight,
  ShoppingCart,
  Users,
  Award,
  Truck
} from 'lucide-react';
import ProductGrid from '../components/products/ProductGrid';
import { useFetch } from '../hooks/useFetch';
import { productsAPI } from '../api/products';

const Home = () => {
  const { data: featuredProducts, loading: featuredLoading } = useFetch('/products/featured');
  const { data: newProducts, loading: newLoading } = useFetch('/products?sort=newest&limit=8');

  const categories = [
    {
      name: 'Books',
      icon: BookOpen,
      description: 'Educational books, novels, and textbooks',
      color: 'from-blue-500 to-blue-600',
      link: '/products?category=books'
    },
    {
      name: 'Pens & Pencils',
      icon: PenTool,
      description: 'Writing instruments and stationery',
      color: 'from-green-500 to-green-600',
      link: '/products?category=pens'
    },
    {
      name: 'Toys',
      icon: Gamepad2,
      description: 'Educational toys and games',
      color: 'from-purple-500 to-purple-600',
      link: '/products?category=toys'
    },
    {
      name: 'Art & Craft',
      icon: Palette,
      description: 'Creative supplies and materials',
      color: 'from-pink-500 to-pink-600',
      link: '/products?category=art'
    },
    {
      name: 'Backpacks',
      icon: Backpack,
      description: 'School bags and accessories',
      color: 'from-orange-500 to-orange-600',
      link: '/products?category=backpacks'
    },
    {
      name: 'School Supplies',
      icon: BookOpen,
      description: 'Essential school materials',
      color: 'from-teal-500 to-teal-600',
      link: '/products?category=supplies'
    }
  ];

  const features = [
    {
      icon: ShoppingCart,
      title: 'Easy Shopping',
      description: 'Browse and purchase school supplies with ease'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery to your doorstep'
    },
    {
      icon: Award,
      title: 'Quality Products',
      description: 'Only the best quality school supplies'
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: '24/7 customer support for all your needs'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '5,000+', label: 'Products Available' },
    { number: '50+', label: 'School Partners' },
    { number: '99%', label: 'Customer Satisfaction' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SchoolShop
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Your one-stop destination for all school supplies. From books and stationery 
              to toys and backpacks, we have everything students need for success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="btn btn-primary px-8 py-3 text-lg font-medium flex items-center justify-center space-x-2"
              >
                <span>Shop Now</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/about"
                className="btn btn-secondary px-8 py-3 text-lg font-medium"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore our wide range of school supplies organized by category
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="group bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-center">
                  <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${category.color} mb-6`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    <span className="text-sm font-medium">Explore</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our most popular and highly-rated school supplies
            </p>
          </div>

          {featuredLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <ProductGrid
              products={featuredProducts?.data?.products || []}
              gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            />
          )}

          <div className="text-center mt-12">
            <Link
              to="/products?featured=true"
              className="btn btn-primary px-8 py-3 text-lg font-medium inline-flex items-center space-x-2"
            >
              <span>View All Featured</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              New Arrivals
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Check out our latest additions to the SchoolShop collection
            </p>
          </div>

          {newLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <ProductGrid
              products={newProducts?.data?.products || []}
              gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            />
          )}

          <div className="text-center mt-12">
            <Link
              to="/products?sort=newest"
              className="btn btn-primary px-8 py-3 text-lg font-medium inline-flex items-center space-x-2"
            >
              <span>View All New Arrivals</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose SchoolShop?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We're committed to providing the best shopping experience for students and parents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex p-4 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and get all your school supplies in one place
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Create Account
            </Link>
            <Link
              to="/products"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
