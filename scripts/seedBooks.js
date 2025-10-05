const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('../backend/models/Book');

// Load environment variables
dotenv.config({ path: '../backend/.env' });

// Sample book data
const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
    price: 12.99,
    stock: 50,
    category: "fiction",
    genre: "classic",
    isbn: "978-0-7432-7356-5",
    publishedDate: new Date("1925-04-10"),
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "A gripping tale of racial injustice and childhood innocence in the American South.",
    price: 14.99,
    stock: 35,
    category: "fiction",
    genre: "classic",
    isbn: "978-0-06-112008-4",
    publishedDate: new Date("1960-07-11"),
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"
  },
  {
    title: "1984",
    author: "George Orwell",
    description: "A dystopian social science fiction novel about totalitarian control and surveillance.",
    price: 13.99,
    stock: 40,
    category: "fiction",
    genre: "dystopian",
    isbn: "978-0-452-28423-4",
    publishedDate: new Date("1949-06-08"),
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "A romantic novel that critiques the British landed gentry of the early 19th century.",
    price: 11.99,
    stock: 30,
    category: "fiction",
    genre: "romance",
    isbn: "978-0-14-143951-8",
    publishedDate: new Date("1813-01-28"),
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400"
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    description: "A coming-of-age story about teenage rebellion and alienation.",
    price: 12.99,
    stock: 25,
    category: "fiction",
    genre: "coming-of-age",
    isbn: "978-0-316-76948-0",
    publishedDate: new Date("1951-07-16"),
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400"
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    description: "An epic high-fantasy novel about the quest to destroy the One Ring.",
    price: 19.99,
    stock: 60,
    category: "fiction",
    genre: "fantasy",
    isbn: "978-0-547-92822-7",
    publishedDate: new Date("1954-07-29"),
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    description: "The first book in the Harry Potter series about a young wizard's journey.",
    price: 16.99,
    stock: 80,
    category: "fiction",
    genre: "fantasy",
    isbn: "978-0-439-35548-4",
    publishedDate: new Date("1997-06-26"),
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400"
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "A fantasy novel about a hobbit's unexpected journey to help dwarves reclaim their homeland.",
    price: 15.99,
    stock: 45,
    category: "fiction",
    genre: "fantasy",
    isbn: "978-0-547-92822-7",
    publishedDate: new Date("1937-09-21"),
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
  },
  {
    title: "The Chronicles of Narnia",
    author: "C.S. Lewis",
    description: "A series of fantasy novels about children who discover the magical world of Narnia.",
    price: 17.99,
    stock: 55,
    category: "fiction",
    genre: "fantasy",
    isbn: "978-0-06-447119-0",
    publishedDate: new Date("1950-10-16"),
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    description: "A philosophical novel about a young Andalusian shepherd's journey to find treasure.",
    price: 13.99,
    stock: 40,
    category: "fiction",
    genre: "philosophical",
    isbn: "978-0-06-112008-4",
    publishedDate: new Date("1988-01-01"),
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"
  },
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    description: "A mystery thriller novel about a symbologist's quest to solve a murder and uncover a conspiracy.",
    price: 14.99,
    stock: 35,
    category: "fiction",
    genre: "thriller",
    isbn: "978-0-307-26595-4",
    publishedDate: new Date("2003-03-18"),
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
  },
  {
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    description: "A novel about friendship, betrayal, and redemption set against the backdrop of Afghanistan.",
    price: 15.99,
    stock: 30,
    category: "fiction",
    genre: "drama",
    isbn: "978-1-59448-000-3",
    publishedDate: new Date("2003-05-29"),
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400"
  },
  {
    title: "The Book Thief",
    author: "Markus Zusak",
    description: "A novel set in Nazi Germany, narrated by Death, about a young girl who steals books.",
    price: 16.99,
    stock: 25,
    category: "fiction",
    genre: "historical",
    isbn: "978-0-375-84220-7",
    publishedDate: new Date("2005-09-14"),
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"
  },
  {
    title: "The Hunger Games",
    author: "Suzanne Collins",
    description: "A dystopian novel about a televised fight to the death in a post-apocalyptic world.",
    price: 14.99,
    stock: 50,
    category: "fiction",
    genre: "dystopian",
    isbn: "978-0-439-02352-8",
    publishedDate: new Date("2008-09-14"),
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
  },
  {
    title: "The Fault in Our Stars",
    author: "John Green",
    description: "A young adult novel about two teenagers who meet in a cancer support group.",
    price: 13.99,
    stock: 40,
    category: "fiction",
    genre: "young-adult",
    isbn: "978-0-525-47881-2",
    publishedDate: new Date("2012-01-10"),
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400"
  }
];

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

// Seed the database
const seedBooks = async () => {
  try {
    // Clear existing books
    await Book.deleteMany({});
    console.log('Cleared existing books');

    // Insert sample books
    const books = await Book.insertMany(sampleBooks);
    console.log(`Successfully seeded ${books.length} books`);

    // Display seeded books
    console.log('\nSeeded books:');
    books.forEach((book, index) => {
      console.log(`${index + 1}. ${book.title} by ${book.author} - $${book.price}`);
    });

  } catch (error) {
    console.error('Error seeding books:', error);
  } finally {
    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

// Run the seeder
const runSeeder = async () => {
  await connectDB();
  await seedBooks();
};

// Check if this script is being run directly
if (require.main === module) {
  runSeeder();
}

module.exports = { seedBooks, sampleBooks };

