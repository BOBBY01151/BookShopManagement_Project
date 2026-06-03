const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const DailyUsage = require('./models/DailyUsage');

const runVerification = async () => {
  try {
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookshop';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected successfully!');

    // 1) Cleanup existing test data if any
    console.log('\n--- 1) Cleaning up prior test data ---');
    
    // Find any leftover products/categories and delete
    const oldUsers = await User.find({ email: { $in: ['test_a@example.com', 'test_b@example.com'] } });
    const oldUserIds = oldUsers.map(u => u._id);
    
    await Product.deleteMany({ createdBy: { $in: oldUserIds } });
    await Category.deleteMany({ createdBy: { $in: oldUserIds } });
    await User.deleteMany({ email: { $in: ['test_a@example.com', 'test_b@example.com'] } });

    // 2) Create Test User A and Test User B
    console.log('\n--- 2) Creating Test Users A and B ---');
    const userA = await User.create({
      name: 'Test User A',
      email: 'test_a@example.com',
      password: 'password123',
      phone: '0711111111',
      role: 'admin',
      emailVerified: true
    });
    console.log('Created User A:', userA._id);

    const userB = await User.create({
      name: 'Test User B',
      email: 'test_b@example.com',
      password: 'password123',
      phone: '0722222222',
      role: 'admin',
      emailVerified: true
    });
    console.log('Created User B:', userB._id);

    // 3) Create Category and Product under User A
    console.log('\n--- 3) Creating Category & Product under User A ---');
    const catA = await Category.create({
      name: 'Sci-Fi Books',
      description: 'Science fiction genre books',
      createdBy: userA._id
    });
    console.log('Created Category under User A:', catA._id, catA.name);

    const prodA = await Product.create({
      title: 'Dune',
      author: 'Frank Herbert',
      category: 'Sci-Fi Books',
      price: 1500,
      stock: 20,
      sku: 'TEST-DUNE-A',
      description: 'Classic sci-fi novel',
      createdBy: userA._id
    });
    console.log('Created Product under User A:', prodA._id, prodA.title);

    // 4) Verify User B cannot see User A's data
    console.log('\n--- 4) Verifying data isolation for User B ---');
    
    // Simulate Category getCategories for User B
    const catsForB = await Category.find({ createdBy: userB._id });
    console.log(`Categories found for User B: ${catsForB.length} (Expected: 0)`);
    if (catsForB.length !== 0) throw new Error('Data Isolation Fail: User B can see User A categories');

    // Simulate Product getProducts for User B
    const prodsForB = await Product.find({ createdBy: userB._id });
    console.log(`Products found for User B: ${prodsForB.length} (Expected: 0)`);
    if (prodsForB.length !== 0) throw new Error('Data Isolation Fail: User B can see User A products');

    // 5) Verify User B can create a Category with the same name "Sci-Fi Books"
    console.log('\n--- 5) Verifying compound uniqueness constraint (Category Name per User) ---');
    try {
      const catB = await Category.create({
        name: 'Sci-Fi Books',
        description: 'User B science fiction genre books',
        createdBy: userB._id
      });
      console.log('Successfully created duplicate category name "Sci-Fi Books" under User B! ID:', catB._id);
    } catch (error) {
      console.error('Failed compound index uniqueness verification:', error.message);
      throw error;
    }

    // 6) Verify stats isolation for User A and User B
    console.log('\n--- 6) Verifying statistics isolation ---');
    
    // Aggregation helper logic matching productController.js getInventoryStats
    const getStats = async (user) => {
      const allCategories = await Category.find({ createdBy: user._id }).select('name');
      const productStats = await Product.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(user._id) } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            stock: { $sum: '$stock' },
            value: { $sum: { $multiply: ['$price', '$stock'] } }
          }
        }
      ]);
      const summary = await Product.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(user._id) } },
        {
          $group: {
            _id: null,
            totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
            totalStock: { $sum: '$stock' },
            totalProducts: { $count: {} },
            averagePrice: { $avg: '$price' }
          }
        }
      ]);
      return {
        categoryCount: allCategories.length,
        groupedCategoryStats: productStats,
        summary: summary[0] || { totalValue: 0, totalStock: 0, totalProducts: 0 }
      };
    };

    const statsA = await getStats(userA);
    console.log('Stats for User A:', JSON.stringify(statsA, null, 2));
    if (statsA.categoryCount !== 1 || statsA.summary.totalProducts !== 1 || statsA.summary.totalValue !== 30000) {
      throw new Error('Stats Isolation Fail: User A stats are incorrect');
    }

    const statsB = await getStats(userB);
    console.log('Stats for User B:', JSON.stringify(statsB, null, 2));
    if (statsB.categoryCount !== 1 || statsB.summary.totalProducts !== 0 || statsB.summary.totalValue !== 0) {
      throw new Error('Stats Isolation Fail: User B stats are incorrect');
    }

    console.log('\n--- Cleanup and finish ---');
    // Cleanup
    await Product.deleteMany({ createdBy: { $in: [userA._id, userB._id] } });
    await Category.deleteMany({ createdBy: { $in: [userA._id, userB._id] } });
    await User.deleteMany({ _id: { $in: [userA._id, userB._id] } });
    console.log('All temporary test data successfully cleaned up!');
    console.log('🎉 DATABASE ISOLATION VERIFICATION PASSED SUCCESSFULLY! 🎉');

  } catch (error) {
    console.error('❌ Verification Failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

runVerification();
