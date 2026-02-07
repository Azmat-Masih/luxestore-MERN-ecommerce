import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Cart from '../models/cartModel';
import Product from '../models/productModel';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({
            // @ts-ignore
            user: req.user._id,
            cartItems: [],
        });
    }

    res.json(cart);
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req: Request, res: Response) => {
    const { productId, qty } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (product.countInStock < qty) {
        res.status(400);
        throw new Error('Insufficient stock');
    }

    // @ts-ignore
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({
            // @ts-ignore
            user: req.user._id,
            cartItems: [],
        });
    }

    const existingItemIndex = cart.cartItems.findIndex(
        (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
        cart.cartItems[existingItemIndex].qty = qty;
    } else {
        cart.cartItems.push({
            product: productId,
            name: product.name,
            image: product.image,
            price: product.price,
            qty,
            countInStock: product.countInStock,
        });
    }

    await cart.save();
    res.json(cart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    const itemIndex = cart.cartItems.findIndex(
        (item) => item.product.toString() === req.params.productId
    );

    if (itemIndex > -1) {
        cart.cartItems.splice(itemIndex, 1);
    }

    await cart.save();
    res.json(cart);
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        cart.cartItems.splice(0, cart.cartItems.length);
        await cart.save();
    }

    res.json({ message: 'Cart cleared' });
});

// @desc    Sync cart from local storage
// @route   PUT /api/cart/sync
// @access  Private
const syncCart = asyncHandler(async (req: Request, res: Response) => {
    const { cartItems } = req.body;

    // @ts-ignore
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({
            // @ts-ignore
            user: req.user._id,
            cartItems: [],
        });
    }

    // Merge with existing cart, validate products exist and have stock
    for (const item of cartItems) {
        const product = await Product.findById(item.product);
        if (product && product.countInStock >= item.qty) {
            const existingIndex = cart.cartItems.findIndex(
                (i) => i.product.toString() === item.product
            );

            if (existingIndex > -1) {
                cart.cartItems[existingIndex].qty = Math.min(
                    item.qty,
                    product.countInStock
                );
            } else {
                cart.cartItems.push({
                    product: item.product,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    qty: Math.min(item.qty, product.countInStock),
                    countInStock: product.countInStock,
                });
            }
        }
    }

    await cart.save();
    res.json(cart);
});

export {
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
    syncCart,
};
