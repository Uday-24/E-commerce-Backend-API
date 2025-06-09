const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
    const userId = req.user.userId;
    const { addressId, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate('products.product');
    if (!cart || cart.products.length === 0) {
        return next(new AppError('Cart is empty', 400));
    }

    const items = cart.products.map(item => ({
        product: item.product._id,
        quantity: item.quantity
    }));

    let totalAmount = 0;

    for (const item of cart.products) {
        totalAmount += item.product.price * item.quantity;
        let product = await Product.findById(item.product._id).select('stock');
        if (!product) return next(new AppError('Product not found', 404));
        if (product.stock < item.quantity) {
            return next(new AppError(`Only ${product.stock} units available for ${item.product.name}`, 400));
        }
        product.stock -= item.quantity;
        if (product.stock < 0) product.stock = 0;
        await product.save();
    }

    cart.products = [];
    await cart.save();

    const order = await Order.create({
        user: userId,
        items,
        shippingAddress: addressId,
        totalAmount,
        paymentMethod,
    });

    res.status(201).json({ success: true, message: 'New order craeted successfully', order });
}

// @desc    Get logged-in user's orders
// @route   GET /api/orders
// @access  Private
const getMyOrder = async (req, res, next) => {
    const orders = await Order.find({ user: req.user.userId }).populate('items.product');
    if (!orders) return next(new AppError('Orders not found', 404));
    res.status(200).json({ success: true, message: 'Orders retrieved successfully', orders });
}

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getSingleOrder = async (req, res, next) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('items.product').populate('shippingAddress');
    if (!order) return next(new AppError('Orders not found', 404));
    res.status(200).json({ success: true, message: 'Order retrieved successfully', order });
}

// @desc    Admin - Get all orders
// @route   GET /api/orders/admin
// @access  Admin
const getAllOrder = async (req, res, next) => {
    const orders = await Order.find();
    if (orders.length === 0) return next(new AppError('Orders not found', 404));
    res.status(200).json({ success: true, message: 'All orders retrieved successfully', orders });
}

// @desc    Admin - Update order status
// @route   PUT /api/orders/admin/:id
// @access  Admin
const updateOrderStatus = async (req, res, next) => {
    const { orderId } = req.params;
    const { status, isPaid } = req.body;
    const order = await Order.findById(orderId).select('status isPaid paidAt');
    if (!order) return next(new AppError('Order not found', 404));
    if(status){
        order.status = status;
    }
    if(isPaid){
        order.isPaid = true;
        order.paidAt = new Date();
    }

    await order.save();
    res.status(200).json({ success: true, message: 'Order updated', order });
}

module.exports = {
    createOrder,
    getMyOrder,
    getSingleOrder,
    getAllOrder,
    updateOrderStatus
}