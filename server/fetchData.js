// fetchData.js - Script to connect to MongoDB and fetch data from collections
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './libs/db.js';

// Import models
import User from './models/user.js';
import Product from './models/product.js';
import Category from './models/category.js';
import Order from './models/order.js';
import { ForumCategory, ForumTopic } from './models/forum.js';

// Load environment variables
dotenv.config();

// Main function to fetch data
async function fetchAllData() {
    try {
        console.log('Connecting to MongoDB...');
        await connectDB();
        console.log('Connected successfully to the database!\n');

        // Fetch users
        console.log('Fetching users...');
        const users = await User.find({}).select('name email role createdAt');
        console.log(`Found ${users.length} users:`);
        console.log(users);
        console.log('\n-----------------------------------\n');

        // Fetch products
        console.log('Fetching products...');
        const products = await Product.find({});
        console.log(`Found ${products.length} products:`);
        console.log(products);
        console.log('\n-----------------------------------\n');

        // Fetch categories
        console.log('Fetching categories...');
        const categories = await Category.find({});
        console.log(`Found ${categories.length} categories:`);
        console.log(categories);
        console.log('\n-----------------------------------\n');

        // Fetch orders
        console.log('Fetching orders...');
        const orders = await Order.find({});
        console.log(`Found ${orders.length} orders:`);
        console.log(orders);
        console.log('\n-----------------------------------\n');

        // Fetch forum categories and topics
        console.log('Fetching forum data...');
        const forumCategories = await ForumCategory.find({});
        const forumTopics = await ForumTopic.find({});
        console.log(`Found ${forumCategories.length} forum categories and ${forumTopics.length} topics`);
        console.log('Forum categories:');
        console.log(forumCategories);
        console.log('Forum topics:');
        console.log(forumTopics);

        console.log('\nData fetching completed successfully!');
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Execute the function
fetchAllData();