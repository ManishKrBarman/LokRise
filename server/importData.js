import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse';
import dotenv from 'dotenv';

// Load models
import User from '../server/models/user.js';
import Category from '../server/models/category.js';
import Product from '../server/models/product.js';
import Coupon from '../server/models/coupon.js';

// Load environment variables
dotenv.config();

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lokrise');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Function to read CSV file
const readCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(parse({ columns: true, trim: true }))
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

// Import users
const importUsers = async () => {
    try {
        const userData = await readCSV(path.join(__dirname, '../mock-data/users.csv'));
        console.log(`Importing ${userData.length} users...`);

        for (const user of userData) {
            // Format address
            const address = {
                addressLine1: user.addressLine1 || '',
                addressLine2: user.addressLine2 || '',
                city: user.city || '',
                district: user.district || '',
                state: user.state || '',
                pinCode: user.pinCode || ''
            };

            // Create user object
            const newUser = new User({
                name: user.name,
                email: user.email,
                password: user.password, // Note: In production, passwords should be hashed
                profileImage: user.profileImage,
                phone: user.phone,
                role: user.role,
                upiId: user.upiId,
                address: address,
                isVerified: user.isVerified === 'true',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Save to database
            await newUser.save();
        }

        console.log('Users imported successfully');
    } catch (error) {
        console.error(`Error importing users: ${error.message}`);
    }
};

// Import categories
const importCategories = async () => {
    try {
        const categoryData = await readCSV(path.join(__dirname, '../mock-data/categories.csv'));
        console.log(`Importing ${categoryData.length} categories...`);

        // First pass: Create all categories
        const categoryMap = new Map();

        for (const category of categoryData) {
            const newCategory = new Category({
                name: category.name,
                slug: category.slug,
                description: category.description,
                icon: category.icon,
                image: category.image,
                isActive: category.isActive === 'true'
            });

            await newCategory.save();
            categoryMap.set(category.name, newCategory);
        }

        // Second pass: Set parent relationships
        for (const category of categoryData) {
            if (category.parent) {
                const child = categoryMap.get(category.name);
                const parent = categoryMap.get(category.parent);

                if (child && parent) {
                    child.parent = parent._id;

                    // Update ancestors array
                    child.ancestors = [
                        ...(parent.ancestors || []),
                        { _id: parent._id, name: parent.name, slug: parent.slug }
                    ];

                    await child.save();
                }
            }
        }

        console.log('Categories imported successfully');
        return categoryMap;
    } catch (error) {
        console.error(`Error importing categories: ${error.message}`);
        return new Map();
    }
};

// Import products
const importProducts = async (userMap, categoryMap) => {
    try {
        const productData = await readCSV(path.join(__dirname, '../mock-data/products.csv'));
        console.log(`Importing ${productData.length} physical products...`);

        // Get all users
        const users = await User.find({});
        const userMap = new Map();
        users.forEach(user => userMap.set(user.email, user));

        for (const item of productData) {
            const seller = userMap.get(item.sellerEmail);

            if (!seller) {
                console.warn(`Seller not found for product: ${item.name}`);
                continue;
            }

            const newProduct = new Product({
                name: item.name,
                description: item.description,
                price: parseFloat(item.price),
                originalPrice: parseFloat(item.originalPrice),
                quantityAvailable: parseInt(item.quantityAvailable),
                category: item.category,
                subCategory: item.subCategory,
                images: item.images.split('|'),
                seller: seller._id,
                location: item.location,
                productType: 'physical',
                tags: item.tags ? item.tags.split('|') : [],
                inStock: item.inStock === 'true',
                featured: item.featured === 'true',
                isNewProduct: item.isNewProduct === 'true',
                discount: parseInt(item.discount) || 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await newProduct.save();
        }

        console.log('Physical products imported successfully');
    } catch (error) {
        console.error(`Error importing products: ${error.message}`);
    }
};

// Import courses
const importCourses = async () => {
    try {
        const courseData = await readCSV(path.join(__dirname, '../mock-data/courses.csv'));
        console.log(`Importing ${courseData.length} courses...`);

        // Get all users
        const users = await User.find({});
        const userMap = new Map();
        users.forEach(user => userMap.set(user.email, user));

        for (const item of courseData) {
            const seller = userMap.get(item.sellerEmail);

            if (!seller) {
                console.warn(`Seller not found for course: ${item.name}`);
                continue;
            }

            const newProduct = new Product({
                name: item.name,
                description: item.description,
                price: parseFloat(item.price),
                originalPrice: parseFloat(item.originalPrice),
                quantityAvailable: parseInt(item.quantityAvailable),
                category: item.category,
                subCategory: item.subCategory,
                images: item.images.split('|'),
                seller: seller._id,
                location: item.location,
                productType: 'course',
                courseDetails: {
                    level: item.level,
                    duration: item.duration,
                    topics: item.topics ? item.topics.split('|') : [],
                    instructorDetails: item.instructorDetails
                },
                tags: item.tags ? item.tags.split('|') : [],
                inStock: item.inStock === 'true',
                featured: item.featured === 'true',
                isNewProduct: item.isNewProduct === 'true',
                discount: parseInt(item.discount) || 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await newProduct.save();

            // Update instructor profile
            if (seller.instructorProfile) {
                seller.instructorProfile.coursesCreated.push(newProduct._id);
                await seller.save();
            }
        }

        console.log('Courses imported successfully');
    } catch (error) {
        console.error(`Error importing courses: ${error.message}`);
    }
};

// Import coupons
const importCoupons = async () => {
    try {
        const couponData = await readCSV(path.join(__dirname, '../mock-data/coupons.csv'));
        console.log(`Importing ${couponData.length} coupons...`);

        // Get admin user for creator
        const users = await User.find({});
        const userMap = new Map();
        users.forEach(user => userMap.set(user.email, user));

        for (const item of couponData) {
            const creator = userMap.get(item.createdByEmail);

            if (!creator) {
                console.warn(`Creator not found for coupon: ${item.code}`);
                continue;
            }

            const newCoupon = new Coupon({
                code: item.code,
                type: item.type,
                value: parseFloat(item.value),
                minimumPurchase: parseFloat(item.minimumPurchase) || 0,
                maximumDiscount: item.maximumDiscount ? parseFloat(item.maximumDiscount) : undefined,
                startDate: new Date(item.startDate),
                endDate: item.endDate ? new Date(item.endDate) : undefined,
                maxUses: item.maxUses ? parseInt(item.maxUses) : undefined,
                maxUsesPerUser: item.maxUsesPerUser ? parseInt(item.maxUsesPerUser) : 1,
                applicableTo: item.applicableTo,
                isFirstOrderOnly: item.isFirstOrderOnly === 'true',
                isActive: item.isActive === 'true',
                description: item.description,
                createdBy: creator._id,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await newCoupon.save();
        }

        console.log('Coupons imported successfully');
    } catch (error) {
        console.error(`Error importing coupons: ${error.message}`);
    }
};

// Main import function
const importAllData = async () => {
    try {
        console.log('Starting data import...');
        await connectDB();

        // Ask for confirmation
        console.log('WARNING: This will add mock data to your database.');
        console.log('Any existing data with the same IDs may be overwritten.');
        console.log('Are you sure you want to proceed? (yes/no)');

        process.stdin.once('data', async (data) => {
            const confirmation = data.toString().trim().toLowerCase();

            if (confirmation === 'yes') {
                console.log('Proceeding with data import...');

                // Import in sequence to maintain data relationships
                await importUsers();
                await importCategories();
                await importProducts();
                await importCourses();
                await importCoupons();

                console.log('All data imported successfully.');
            } else {
                console.log('Operation cancelled. No data was imported.');
            }

            // Close connection and exit
            await mongoose.connection.close();
            process.exit(0);
        });
    } catch (error) {
        console.error(`Error importing data: ${error.message}`);
        process.exit(1);
    }
};

// Run the import function
importAllData();