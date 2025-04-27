// controllers/Product.js
import mongoose from 'mongoose';
import Product from '../models/product.js';
import UserModel from '../models/user.js';
import CategoryModel from '../models/category.js';

// Create a new product
export const createProduct = async (req, res) => {
    try {
        // Get data from request
        const {
            name,
            description,
            price,
            quantityAvailable,
            category,
            images,
            location,
            specifications,
            tags,
            isDigital,
            digitalContent,
            shippingDetails
        } = req.body;

        // Create product with seller ID from authenticated user
        const product = new Product({
            seller: req.user.id,
            name,
            description,
            price,
            quantityAvailable,
            category,
            images,
            location,
            specifications,
            tags,
            isDigital,
            digitalContent,
            shippingDetails,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Save product
        const savedProduct = await product.save();

        // Update seller product count
        await UserModel.findByIdAndUpdate(
            req.user.id,
            { $inc: { 'metrics.productsListed': 1 } }
        );

        res.status(201).json({
            message: "Product created successfully",
            product: savedProduct
        });
    } catch (err) {
        console.error('Create product error:', err);
        res.status(500).json({ message: err.message });
    }
};

export const getCoursesBySearch = async (req, res) => {
    try {
        const { query } = req.query;

        const courses = await Product.find({
            productType: 'course',
            name: { $regex: query, $options: 'i' }
        });

        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Search failed', error });
    }
};


// Get all products with filtering, sorting, and pagination
export const getProducts = async (req, res) => {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            search,
            sort,
            page = 1,
            limit = 12,
            seller
        } = req.query;

        // Build query filters
        const query = {};

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by price range
        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice !== undefined) query.price.$gte = Number(minPrice);
            if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
        }

        // Filter by seller
        if (seller) {
            query.seller = seller;
        }

        // Search by name or description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        // Prepare sort options
        let sortOptions = { createdAt: -1 }; // Default sort by newest

        if (sort) {
            switch (sort) {
                case 'price-asc':
                    sortOptions = { price: 1 };
                    break;
                case 'price-desc':
                    sortOptions = { price: -1 };
                    break;
                case 'name-asc':
                    sortOptions = { name: 1 };
                    break;
                case 'name-desc':
                    sortOptions = { name: -1 };
                    break;
                case 'oldest':
                    sortOptions = { createdAt: 1 };
                    break;
                case 'popularity':
                    sortOptions = { 'metrics.views': -1 };
                    break;
                default:
                    sortOptions = { createdAt: -1 }; // Newest
            }
        }

        // Apply pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Execute query with pagination
        const products = await Product.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum)
            .populate('seller', 'name email profileImage')
            .populate('category', 'name');

        // Get total count for pagination info
        const totalProducts = await Product.countDocuments(query);

        res.status(200).json({
            products,
            currentPage: pageNum,
            totalPages: Math.ceil(totalProducts / limitNum),
            totalProducts
        });
    } catch (err) {
        console.error('Get products error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }

        // Find product and update view count
        const product = await Product.findByIdAndUpdate(
            id,
            { $inc: { 'metrics.views': 1 } },
            { new: true }
        ).populate('seller', 'name email profileImage')
            .populate('category', 'name');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (err) {
        console.error('Get product by ID error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Update a product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }

        // Find product
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user is the product seller
        if (product.seller.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to update this product' });
        }

        // Update product fields
        const updates = { ...req.body, updatedAt: new Date() };

        // Remove fields that shouldn't be updated directly
        delete updates.seller;
        delete updates.createdAt;
        delete updates.metrics;

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).populate('seller', 'name email profileImage')
            .populate('category', 'name');

        res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (err) {
        console.error('Update product error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Delete a product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }

        // Find product
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user is the product seller or admin
        if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to delete this product' });
        }

        // Delete product
        await Product.findByIdAndDelete(id);

        // Update seller product count
        await UserModel.findByIdAndUpdate(
            product.seller,
            { $inc: { 'metrics.productsListed': -1 } }
        );

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Delete product error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Get seller products
export const getSellerProducts = async (req, res) => {
    try {
        // Get seller ID from authenticated user
        const sellerId = req.user.id;

        const {
            status,
            search,
            sort,
            page = 1,
            limit = 20
        } = req.query;

        // Build query filters
        const query = { seller: sellerId };

        // Filter by status if provided
        if (status) {
            query.status = status;
        }

        // Search by name or description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Prepare sort options
        let sortOptions = { createdAt: -1 }; // Default sort by newest

        if (sort) {
            switch (sort) {
                case 'price-asc':
                    sortOptions = { price: 1 };
                    break;
                case 'price-desc':
                    sortOptions = { price: -1 };
                    break;
                case 'sales':
                    sortOptions = { 'metrics.totalSales': -1 };
                    break;
                case 'views':
                    sortOptions = { 'metrics.views': -1 };
                    break;
                default:
                    sortOptions = { createdAt: -1 };
            }
        }

        // Apply pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Execute query
        const products = await Product.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum)
            .populate('category', 'name');

        // Get total count
        const totalProducts = await Product.countDocuments(query);

        res.status(200).json({
            products,
            currentPage: pageNum,
            totalPages: Math.ceil(totalProducts / limitNum),
            totalProducts
        });
    } catch (err) {
        console.error('Get seller products error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Get product statistics
export const getProductStats = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }

        // Find product
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user is the product seller
        if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to view these statistics' });
        }

        // Return product metrics
        res.status(200).json({
            metrics: product.metrics,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        });
    } catch (err) {
        console.error('Get product stats error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Get related products
export const getRelatedProducts = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }

        // Find original product
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find related products based on category and tags
        const relatedProducts = await Product.find({
            _id: { $ne: id },
            $or: [
                { category: product.category },
                { tags: { $in: product.tags } }
            ]
        })
            .limit(6)
            .populate('seller', 'name')
            .populate('category', 'name');

        res.status(200).json(relatedProducts);
    } catch (err) {
        console.error('Get related products error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Get featured products
export const getFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await Product.find({
            quantityAvailable: { $gt: 0 },
            status: 'active'
        })
            .sort({ 'metrics.rating': -1, 'metrics.views': -1 })
            .limit(8)
            .populate('seller', 'name')
            .populate('category', 'name');

        res.status(200).json(featuredProducts);
    } catch (err) {
        console.error('Get featured products error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Get all product categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.find({ isActive: true })
            .select('_id name slug description icon image')
            .sort({ displayOrder: 1, name: 1 });

        res.status(200).json(categories);
    } catch (err) {
        console.error('Get categories error:', err);
        res.status(500).json({ message: err.message });
    }
};
