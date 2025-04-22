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
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI environment variable is not defined');
        }
        const conn = await mongoose.connect(mongoUri);
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
            .pipe(parse({
                columns: true,
                trim: true,
                skip_empty_lines: true,
                relax_quotes: true,
                skip_records_with_error: true // Skip records with parsing errors instead of failing
            }))
            .on('data', (data) => results.push(data))
            .on('error', (error) => reject(error))
            .on('skip', (error) => {
                console.warn(`Warning: Skipped line in CSV - ${error.message}`);
            })
            .on('end', () => {
                console.log(`Successfully parsed ${results.length} records from ${path.basename(filePath)}`);
                resolve(results);
            });
    });
};

// Import users
const importUsers = async () => {
    try {
        const userData = await readCSV(path.join(__dirname, '../mock-data/users.csv'));
        console.log(`Importing ${userData.length} users...`);

        // Track successful imports and duplicates
        let importCount = 0;
        let duplicateCount = 0;
        let errorCount = 0;

        for (const user of userData) {
            try {
                // Skip records with missing required fields
                if (!user.email || !user.name || !user.password || !user.phone) {
                    console.warn(`Skipping user with missing required fields: ${user.email || 'Unknown email'}`);
                    errorCount++;
                    continue;
                }

                // Check if user already exists by email
                const existingUser = await User.findOne({
                    $or: [
                        { email: user.email },
                        { phone: user.phone }
                    ]
                });

                if (existingUser) {
                    console.log(`User with email ${user.email} or phone ${user.phone} already exists. Skipping.`);
                    duplicateCount++;
                    continue;
                }

                // Format address
                const address = {
                    addressLine1: user.addressLine1 || '',
                    addressLine2: user.addressLine2 || '',
                    city: user.city || '',
                    district: user.district || '',
                    state: user.state || '',
                    pinCode: user.pinCode || ''
                };

                // Create user object with proper password hashing using bcrypt
                // In a production environment, passwords should be properly hashed
                // Here we're assuming the CSV already has hashed passwords or temporary ones
                const newUser = new User({
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    phone: user.phone,
                    role: user.role || 'buyer',
                    upiId: user.upiId || undefined,
                    address: address,
                    isVerified: user.isVerified === 'true',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    metrics: {
                        joinDate: new Date(),
                        lastActive: new Date()
                    }
                });

                // Handle profile image correctly based on format
                if (user.profileImage) {
                    if (user.profileImage.startsWith('http')) {
                        // It's a URL
                        newUser.profileImage = {
                            data: null,
                            contentType: 'image/jpeg',
                            originalName: user.profileImage
                        };
                    } else {
                        // Assume it's a filename reference
                        newUser.profileImage = {
                            data: null,
                            contentType: 'image/jpeg',
                            originalName: user.profileImage
                        };
                    }
                }

                // Save to database
                await newUser.save();
                importCount++;
            } catch (err) {
                console.warn(`Failed to import user ${user.name} (${user.email || 'unknown'}): ${err.message}`);
                errorCount++;
            }
        }

        console.log(`Users import summary: ${importCount} added, ${duplicateCount} duplicates skipped, ${errorCount} errors`);
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
        let importCount = 0;
        let duplicateCount = 0;
        let errorCount = 0;

        for (const category of categoryData) {
            try {
                // Skip if required fields are missing
                if (!category.name) {
                    console.warn(`Skipping category with missing name`);
                    errorCount++;
                    continue;
                }

                // Check if category already exists
                const existingCategory = await Category.findOne({
                    $or: [
                        { name: category.name },
                        { slug: category.slug }
                    ]
                });

                if (existingCategory) {
                    console.log(`Category "${category.name}" already exists. Skipping.`);
                    categoryMap.set(category.name, existingCategory);
                    duplicateCount++;
                    continue;
                }

                // Generate a slug if not provided
                const slug = category.slug || category.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

                const newCategory = new Category({
                    name: category.name,
                    slug: slug,
                    description: category.description || '',
                    icon: category.icon || '',
                    image: category.image || '',
                    isActive: category.isActive === 'true',
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                await newCategory.save();
                categoryMap.set(category.name, newCategory);
                importCount++;
            } catch (err) {
                console.warn(`Failed to import category ${category.name}: ${err.message}`);
                errorCount++;
            }
        }

        // Second pass: Set parent relationships
        let relationshipsSet = 0;
        for (const category of categoryData) {
            if (category.parent) {
                const child = categoryMap.get(category.name);
                const parent = categoryMap.get(category.parent);

                if (child && parent) {
                    try {
                        child.parent = parent._id;

                        // Update ancestors array
                        child.ancestors = [
                            ...(parent.ancestors || []),
                            { _id: parent._id, name: parent.name, slug: parent.slug }
                        ];

                        await child.save();
                        relationshipsSet++;
                    } catch (err) {
                        console.warn(`Failed to set parent for ${category.name}: ${err.message}`);
                        errorCount++;
                    }
                }
            }
        }

        console.log(`Categories import summary: ${importCount} added, ${duplicateCount} duplicates skipped, ${errorCount} errors, ${relationshipsSet} parent relationships set`);
        return categoryMap;
    } catch (error) {
        console.error(`Error importing categories: ${error.message}`);
        return new Map();
    }
};

// Import products
const importProducts = async () => {
    try {
        const productData = await readCSV(path.join(__dirname, '../mock-data/products.csv'));
        console.log(`Importing ${productData.length} physical products...`);

        // Get all users
        const users = await User.find({});
        const userMap = new Map();
        users.forEach(user => userMap.set(user.email, user));

        let importCount = 0;
        let duplicateCount = 0;
        let errorCount = 0;
        let skippedCount = 0;

        for (const item of productData) {
            try {
                // Skip if required fields are missing
                if (!item.name || !item.sellerEmail || !item.price) {
                    console.warn(`Skipping product with missing required fields: ${item.name || 'Unknown'}`);
                    skippedCount++;
                    continue;
                }

                // Skip courses - they're handled by importCourses
                if (item.productType === 'course') {
                    continue;
                }

                const seller = userMap.get(item.sellerEmail);

                if (!seller) {
                    console.warn(`Seller not found for product: ${item.name}. Email: ${item.sellerEmail}`);
                    skippedCount++;
                    continue;
                }

                // Check if product already exists (by name and seller)
                const existingProduct = await Product.findOne({
                    name: item.name,
                    seller: seller._id
                });

                if (existingProduct) {
                    console.log(`Product "${item.name}" by ${item.sellerEmail} already exists. Skipping.`);
                    duplicateCount++;
                    continue;
                }

                const newProduct = new Product({
                    name: item.name,
                    description: item.description || '',
                    price: parseFloat(item.price) || 0,
                    originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : undefined,
                    quantityAvailable: parseInt(item.quantityAvailable) || 0,
                    category: item.category || 'Uncategorized',
                    subCategory: item.subCategory || undefined,
                    images: item.images ? item.images.split('|') : [],
                    seller: seller._id,
                    location: item.location || '',
                    productType: item.productType || 'physical',
                    tags: item.tags ? item.tags.split('|') : [],
                    inStock: item.inStock === 'true',
                    featured: item.featured === 'true',
                    isNewProduct: item.isNewProduct === 'true',
                    discount: parseInt(item.discount) || 0,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                await newProduct.save();
                importCount++;

                // Update seller metrics
                if (seller.metrics) {
                    seller.metrics.productsListed = (seller.metrics.productsListed || 0) + 1;
                    await seller.save();
                }
            } catch (err) {
                console.warn(`Failed to import product "${item.name}": ${err.message}`);
                errorCount++;
            }
        }

        console.log(`Products import summary: ${importCount} added, ${duplicateCount} duplicates skipped, ${skippedCount} skipped due to missing data, ${errorCount} errors`);
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

        let importCount = 0;
        let duplicateCount = 0;
        let errorCount = 0;
        let skippedCount = 0;

        for (const item of courseData) {
            try {
                // Skip if required fields are missing
                if (!item.name || !item.sellerEmail || !item.price) {
                    console.warn(`Skipping course with missing required fields: ${item.name || 'Unknown'}`);
                    skippedCount++;
                    continue;
                }

                const seller = userMap.get(item.sellerEmail);

                if (!seller) {
                    console.warn(`Seller not found for course: ${item.name}. Email: ${item.sellerEmail}`);
                    skippedCount++;
                    continue;
                }

                // Check if course already exists (by name and seller)
                const existingCourse = await Product.findOne({
                    name: item.name,
                    seller: seller._id,
                    productType: 'course'
                });

                if (existingCourse) {
                    console.log(`Course "${item.name}" by ${item.sellerEmail} already exists. Skipping.`);
                    duplicateCount++;
                    continue;
                }

                const newProduct = new Product({
                    name: item.name,
                    description: item.description || '',
                    price: parseFloat(item.price) || 0,
                    originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : undefined,
                    quantityAvailable: parseInt(item.quantityAvailable) || 100, // Default high value for courses
                    category: item.category || 'Uncategorized',
                    subCategory: item.subCategory || undefined,
                    images: item.images ? item.images.split('|') : [],
                    seller: seller._id,
                    location: item.location || '',
                    productType: 'course',
                    courseDetails: {
                        level: item.level || 'All Levels',
                        duration: item.duration || '',
                        topics: item.topics ? item.topics.split('|') : [],
                        instructorDetails: item.instructorDetails || ''
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
                importCount++;

                // Update instructor profile
                if (!seller.instructorProfile) {
                    seller.instructorProfile = {
                        coursesCreated: [newProduct._id],
                        bio: item.instructorBio || `Instructor for ${item.name}`,
                        specialty: item.instructorSpecialty || item.category,
                        studentsCount: 0,
                        rating: 0
                    };
                } else {
                    seller.instructorProfile.coursesCreated = seller.instructorProfile.coursesCreated || [];
                    seller.instructorProfile.coursesCreated.push(newProduct._id);
                }

                await seller.save();
            } catch (err) {
                console.warn(`Failed to import course "${item.name}": ${err.message}`);
                errorCount++;
            }
        }

        console.log(`Courses import summary: ${importCount} added, ${duplicateCount} duplicates skipped, ${skippedCount} skipped due to missing data, ${errorCount} errors`);
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

        let importCount = 0;
        let duplicateCount = 0;
        let errorCount = 0;
        let skippedCount = 0;

        for (const item of couponData) {
            try {
                // Skip if required fields are missing
                if (!item.code || !item.createdByEmail || !item.type || !item.value) {
                    console.warn(`Skipping coupon with missing required fields: ${item.code || 'Unknown'}`);
                    skippedCount++;
                    continue;
                }

                const creator = userMap.get(item.createdByEmail);

                if (!creator) {
                    console.warn(`Creator not found for coupon: ${item.code}. Email: ${item.createdByEmail}`);
                    skippedCount++;
                    continue;
                }

                // Check if coupon already exists
                const existingCoupon = await Coupon.findOne({ code: item.code });

                if (existingCoupon) {
                    console.log(`Coupon with code "${item.code}" already exists. Skipping.`);
                    duplicateCount++;
                    continue;
                }

                // Validate dates
                let startDate, endDate;
                try {
                    startDate = new Date(item.startDate);
                    if (isNaN(startDate.getTime())) {
                        startDate = new Date(); // Default to current date
                    }
                } catch (e) {
                    startDate = new Date();
                }

                try {
                    if (item.endDate) {
                        endDate = new Date(item.endDate);
                        if (isNaN(endDate.getTime())) {
                            endDate = undefined;
                        }
                    }
                } catch (e) {
                    endDate = undefined;
                }

                const newCoupon = new Coupon({
                    code: item.code,
                    type: item.type || 'percentage',
                    value: parseFloat(item.value) || 0,
                    minimumPurchase: parseFloat(item.minimumPurchase) || 0,
                    maximumDiscount: item.maximumDiscount ? parseFloat(item.maximumDiscount) : undefined,
                    startDate: startDate,
                    endDate: endDate,
                    maxUses: item.maxUses ? parseInt(item.maxUses) : undefined,
                    maxUsesPerUser: item.maxUsesPerUser ? parseInt(item.maxUsesPerUser) : 1,
                    applicableTo: item.applicableTo || 'all',
                    isFirstOrderOnly: item.isFirstOrderOnly === 'true',
                    isActive: item.isActive === 'true',
                    description: item.description || '',
                    createdBy: creator._id,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                await newCoupon.save();
                importCount++;
            } catch (err) {
                console.warn(`Failed to import coupon "${item.code}": ${err.message}`);
                errorCount++;
            }
        }

        console.log(`Coupons import summary: ${importCount} added, ${duplicateCount} duplicates skipped, ${skippedCount} skipped due to missing data, ${errorCount} errors`);
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