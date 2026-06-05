import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';
import User from './src/models/User.js';
import dns from 'dns';
import { createProduct } from './src/services/productService.js';
import additionalProducts from './additionalProducts.js';

dns.setServers(["1.1.1.1", "8.8.8.8"])

dotenv.config();

const seedProducts = [
  {
    name: 'Wireless Headphones',
    description: 'Premium wireless headphones...',
    brand: 'AudioPro',
    category: 'Electronics',
    price: 199.99,
    salePrice: 149.99,
    stock: 45,
    isActive: true
  },
  {
    name: 'Smart Watch',
    description: 'Feature-rich smart watch with heart rate monitor, sleep tracking, and 7-day battery. Compatible with iOS and Android.',
    brand: 'TechWear',
    category: 'Electronics',
    price: 299.99,
    salePrice: 249.99,
    stock: 32,
    primaryImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1474708249182-3c3f04e1dba4?w=400&h=300&fit=crop'
    ],
    isActive: true
  },
  {
    name: 'USB-C Cable',
    description: 'Durable USB-C charging cable with fast charging support up to 100W. Length: 2 meters.',
    brand: 'ChargeMax',
    category: 'Electronics',
    price: 19.99,
    salePrice: 14.99,
    stock: 150,
    primaryImage: 'https://images.unsplash.com/photo-1625948515291-79613efd103f?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
    ],
    isActive: true
  },
  {
    name: 'Cotton T-Shirt',
    description: 'Comfortable 100% organic cotton t-shirt. Available in multiple colors. Perfect for everyday wear.',
    brand: 'ComfortWear',
    category: 'Fashion',
    price: 29.99,
    salePrice: 19.99,
    stock: 200,
    primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
    ],
    isActive: true
  },
  {
    name: 'Running Shoes',
    description: 'Professional running shoes with advanced cushioning technology. Lightweight and durable for all terrains.',
    brand: 'SpeedRunner',
    category: 'Fashion',
    price: 129.99,
    salePrice: 99.99,
    stock: 78,
    primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
    ],
    isActive: true
  },
  {
    name: 'Coffee Maker',
    description: 'Automatic coffee maker with programmable timer and thermal carafe. Brews 12 cups of fresh coffee.',
    brand: 'BrewMaster',
    category: 'Home & Garden',
    price: 89.99,
    salePrice: 69.99,
    stock: 56,
    primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
    ],
    isActive: true
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat with carrying strap. 6mm thickness for comfort and stability. Eco-friendly material.',
    brand: 'ZenFlow',
    category: 'Sports & Outdoors',
    price: 39.99,
    salePrice: 29.99,
    stock: 120,
    primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
    ],
    isActive: true
  },
  {
    name: 'Hiking Backpack',
    description: 'Durable 50L hiking backpack with rain cover. Multiple compartments for organization. Water-resistant material.',
    brand: 'TrailAdventure',
    category: 'Sports & Outdoors',
    price: 149.99,
    salePrice: 119.99,
    stock: 42,
    primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
    ],
    isActive: true
  },
  {
    name: 'JavaScript Book',
    description: 'Comprehensive guide to JavaScript programming. Learn advanced concepts and best practices. 500+ pages.',
    brand: 'TechPublish',
    category: 'Books',
    price: 49.99,
    salePrice: 39.99,
    stock: 85,
    primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
    ],
    isActive: true
  },
  {
    name: 'Building Modern Web Apps',
    description: 'Learn to build modern web applications with React, Node.js, and MongoDB. Practical examples included.',
    brand: 'TechPublish',
    category: 'Books',
    price: 59.99,
    salePrice: 44.99,
    stock: 67,
    primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
    ],
    isActive: true
  },
  {
    name: 'Action Figures Set',
    description: 'Set of 5 detailed action figures. Highly poseable with accessories. Perfect for collectors and kids.',
    brand: 'ActionWorld',
    category: 'Toys & Games',
    price: 39.99,
    salePrice: 29.99,
    stock: 95,
    primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
    ],
    isActive: true
  },
  {
    name: 'Board Game Collection',
    description: 'Classic board game collection with 10 popular games. Family fun for all ages. Complete with all pieces.',
    brand: 'GameMasters',
    category: 'Toys & Games',
    price: 79.99,
    salePrice: 59.99,
    stock: 48,
    primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
    ],
    isActive: true
  },
  {
    name: 'Face Moisturizer',
    description: 'Lightweight daily moisturizer for all skin types. Contains hyaluronic acid and vitamin E. 50ml bottle.',
    brand: 'SkinCare Plus',
    category: 'Health & Beauty',
    price: 29.99,
    salePrice: 22.99,
    stock: 110,
    primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
    ],
    isActive: true
  },
  {
    name: 'Hair Shampoo',
    description: 'Natural shampoo with botanical extracts. Gentle on hair, sulfate-free formula. 250ml bottle.',
    brand: 'NaturalHair',
    category: 'Health & Beauty',
    price: 15.99,
    salePrice: 12.99,
    stock: 180,
    primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
    ],
    isActive: true
  },
  {
    name: 'Car Phone Mount',
    description: 'Universal phone mount for car dashboard. Adjustable grip for all phone sizes. Easy one-hand operation.',
    brand: 'DriveSafe',
    category: 'Automotive',
    price: 24.99,
    salePrice: 19.99,
    stock: 140,
    primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
    ],
    isActive: true
  },
  {
    name: 'Engine Air Filter',
    description: 'High-quality engine air filter. Improves engine performance and fuel efficiency. Fits most vehicle models.',
    brand: 'AutoCare',
    category: 'Automotive',
    price: 34.99,
    salePrice: 27.99,
    stock: 75,
    primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
    ],
    isActive: true
  },
  {
    name: 'Organic Coffee Beans',
    description: 'Premium organic coffee beans from Ethiopian highlands. Medium roast. 1kg bag. Fresh roasted.',
    brand: 'CoffeeLovers',
    category: 'Food & Groceries',
    price: 22.99,
    salePrice: 17.99,
    stock: 200,
    primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
    ],
    isActive: true
  },
  {
    name: 'Dark Chocolate Bar',
    description: '85% dark chocolate bar. Fair trade, vegan-friendly. Rich and smooth taste. 100g bar.',
    brand: 'ChocolateArtisan',
    category: 'Food & Groceries',
    price: 8.99,
    salePrice: 6.99,
    stock: 300,
    primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
    ],
    isActive: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    const deletedProducts = await Product.deleteMany({});
    const deletedUsers = await User.deleteMany({ role: 'admin' });
    console.log(`🗑️  Deleted ${deletedProducts.deletedCount} existing products`);
    console.log(`🗑️  Deleted ${deletedUsers.deletedCount} existing admin users`);

    // Create or find admin user
    let adminUser = await User.findOne({ email: 'admin@cloudcart.com' });

    if (!adminUser) {
      adminUser = new User({
        name: 'Admin User',
        email: 'admin@cloudcart.com',
        password: 'admin123', // Will be hashed by pre-save hook
        role: 'admin',
      });
      await adminUser.save();
      console.log('✅ Admin user created: admin@cloudcart.com / admin123');
    } else {
      console.log('✅ Using existing admin user:', adminUser.email);
    }

    // Insert seed products with real admin user ID
    // Remove old image fields so every product uses Pexels
    const allProducts = [
      ...seedProducts,
      ...additionalProducts
    ];

    const cleanedProducts = allProducts.map(
      ({ primaryImage, images, ...product }) => product
    );

    let count = 0;

    for (const product of cleanedProducts) {
      try {
        await createProduct(product, adminUser._id);
        count++;

        console.log(`✅ Seeded: ${product.name}`);
      } catch (error) {
        console.error(`❌ Failed to seed ${product.name}:`, error.message);
      }
    }

    console.log(`✅ Successfully seeded ${count} products`);

    // Get statistics
    const totalCount = await Product.countDocuments();
    const categories = await Product.distinct('category');
    console.log(`\n📊 Database Statistics:`);
    console.log(`   Total Products: ${totalCount}`);
    console.log(`   Categories: ${categories.join(', ')}`);
    console.log(
      `   Average Price: $${(
        allProducts.reduce((sum, p) => sum + p.price, 0) /
        allProducts.length
      ).toFixed(2)}`
    );

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();

