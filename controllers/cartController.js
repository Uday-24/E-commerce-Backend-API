const Product = require('../models/Product');
const Cart = require('../models/Cart');
const AppError = require('../utils/AppError');

/**
 * @desc    Get current user's cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user.userId }).populate('products.product');
    if (!cart) return next(new AppError('Cart not found', 404));
    res.status(200).json({ success: true, message: 'Cart retrieved successfully', cart });
}

/**
 * @desc    Add product to cart
 * @route   POST /api/cart/add
 * @access  Private
 */
const addToCart = async (req, res, next) => {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.userId;

    const product = await Product.findById(productId);
    if (!product) return next(new AppError('Product not exist', 404));
    if (product.stock < quantity) return next(new AppError(`Only ${product.stock} units available for this product`, 400));

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({
            user: userId,
            products: [
                {
                    product: productId,
                    quantity
                }
            ]
        });
        return res.status(200).json({ success: true, message: 'Product added to cart', cart });
    }

    const existingItem = cart.products.find(p => p.product.toString() === productId);
    if (existingItem) return next(new AppError('Product is already in the cart', 400));

    cart.products.push({ product: productId, quantity });
    await cart.save();
    return res.status(200).json({ success: true, message: 'Product added to cart', cart });
}

/**
 * @desc    Remove product from cart
 * @route   DELETE /api/cart/remove/:productId
 * @access  Private
 */
const removeFromCart = async (req, res, next) => {
    const productId = req.params.productId;
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return next(new AppError('Cart not found', 404));

    const itemInCart = cart.products.find(p => p.product.toString() === productId);
    if (!itemInCart) return next(new AppError('Product not found in your cart', 404));

    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    await cart.save();

    res.status(200).json({
        success: true,
        message: 'Product removed from cart successfully',
        cart
    });
}

/**
 * @desc    Update quantity of a cart item
 * @route   PUT /api/cart/update/:productId
 * @access  Private
 */
const updateCartItem = async (req, res, next) => {
    const { quantity } = req.body;
    const { productId } = req.params;
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return next(new AppError('Cart not found', 404));

    const product = await Product.findById(productId).select('stock');
    if (!product) return next(new AppError('Product not found', 404));
    if (quantity > product.stock) return next(new AppError(`Only ${product.stock} units available for this product`, 400));;

    const item = cart.products.find(p => p.product.toString() === productId);
    if (!item) return next(new AppError('Item not found in cart', 404));

    item.quantity = quantity;
    await cart.save();
    res.status(200).json({ success: true, message: 'Cart updated', cart });
}

/**
 * @desc    Clear all items from cart
 * @route   DELETE /api/cart/clear
 * @access  Private
 */
const clearCart = async (req, res, next) => {
    const userId = req.user.userId;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return next(new AppError('Cart not found', 404));

    cart.products = [];
    await cart.save();

    res.status(200).json({ success: true, message: 'Cart cleared', cart });
}

module.exports = {
    getCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
}