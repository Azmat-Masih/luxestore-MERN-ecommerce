import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Product from '../models/productModel';
import { products as mockProducts } from '../mockData';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req: Request, res: Response) => {
    // Check if DB is connected
    const isDBConnected = mongoose.connection.readyState === 1;

    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = (req.query.keyword as string)?.toLowerCase();

    if (!isDBConnected) {
        let filteredProducts = [...mockProducts];

        if (keyword) {
            filteredProducts = filteredProducts.filter(p =>
                p.name.toLowerCase().includes(keyword) ||
                p.description.toLowerCase().includes(keyword)
            );
        }

        if (req.query.category) {
            filteredProducts = filteredProducts.filter(p => p.category === req.query.category);
        }

        const count = filteredProducts.length;
        const products = filteredProducts.slice(pageSize * (page - 1), pageSize * page);

        res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
        return;
    }

    const keywordQuery = req.query.keyword
        ? {
            $text: { $search: req.query.keyword as string },
        }
        : {};

    const category = req.query.category
        ? { category: req.query.category }
        : {};

    const priceFilter: Record<string, unknown> = {};
    if (req.query.minPrice) {
        priceFilter.$gte = Number(req.query.minPrice);
    }
    if (req.query.maxPrice) {
        priceFilter.$lte = Number(req.query.maxPrice);
    }
    const priceQuery = Object.keys(priceFilter).length > 0 ? { price: priceFilter } : {};

    const sortOptions: Record<string, 1 | -1> = {};
    if (req.query.sortBy === 'price_asc') sortOptions.price = 1;
    else if (req.query.sortBy === 'price_desc') sortOptions.price = -1;
    else if (req.query.sortBy === 'rating') sortOptions.rating = -1;
    else sortOptions.createdAt = -1;

    const count = await Product.countDocuments({ ...keywordQuery, ...category, ...priceQuery });
    const products = await Product.find({ ...keywordQuery, ...category, ...priceQuery })
        .sort(sortOptions)
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req: Request, res: Response) => {
    // Mock Fallback
    if (mongoose.connection.readyState !== 1) {
        const product = mockProducts.find(p => p.slug === req.params.id || p._id === req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found (Mock Mode)');
        }
        return;
    }

    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = new Product({
        // @ts-ignore
        user: req.user._id,
        name: 'Sample name',
        slug: `sample-product-${Date.now()}`,
        price: 0,
        image: '/images/sample.jpg',
        brand: 'Sample Brand',
        category: 'Sample Category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { name, price, description, image, images, brand, category, countInStock, attributes } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.price = price ?? product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.images = images || product.images;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.countInStock = countInStock ?? product.countInStock;
        product.slug = name ? name.toLowerCase().replace(/ /g, '-') + '-' + Date.now() : product.slug;
        if (attributes) product.attributes = attributes;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req: Request, res: Response) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        // @ts-ignore
        const alreadyReviewed = product.reviews.find(
            // @ts-ignore
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            // @ts-ignore
            name: req.user.name,
            rating: Number(rating),
            comment,
            // @ts-ignore
            user: req.user._id,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req: Request, res: Response) => {
    if (mongoose.connection.readyState !== 1) {
        const topProducts = [...mockProducts].sort((a, b) => b.rating - a.rating).slice(0, 5);
        res.json(topProducts);
        return;
    }

    const products = await Product.find({}).sort({ rating: -1 }).limit(5);
    res.json(products);
});

// @desc    Get products by category
// @route   GET /api/products/categories
// @access  Public
const getCategories = asyncHandler(async (req: Request, res: Response) => {
    if (mongoose.connection.readyState !== 1) {
        const categories = Array.from(new Set(mockProducts.map(p => p.category)));
        res.json(categories);
        return;
    }

    const categories = await Product.distinct('category');
    res.json(categories);
});

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getTopProducts,
    getCategories,
};
