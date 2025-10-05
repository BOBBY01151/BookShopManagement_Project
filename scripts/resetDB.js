const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../backend/.env' });

// Import models
const User = require('../backend/models/User');
const Book = require('../backend/models/Book');
const Order = require('../backend/models/Order');
const Review = require('../backend/models/Review');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookshop', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Reset the database
const resetDatabase = async () => {
  try {
    console.log('Starting database reset...');

    // Clear all collections
    await User.deleteMany({});
    console.log('✓ Cleared Users collection');

    await Book.deleteMany({});
    console.log('✓ Cleared Books collection');

    await Order.deleteMany({});
    console.log('✓ Cleared Orders collection');

    await Review.deleteMany({});
    console.log('✓ Cleared Reviews collection');

    console.log('\n✅ Database reset completed successfully!');
    console.log('All collections have been cleared.');

  } catch (error) {
    console.error('❌ Error resetting database:', error);
  } finally {
    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

// Run the reset
const runReset = async () => {
  await connectDB();
  await resetDatabase();
};

// Check if this script is being run directly
if (require.main === module) {
  runReset();
}

module.exports = { resetDatabase };

