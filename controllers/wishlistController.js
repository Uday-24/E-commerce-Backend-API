const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const { isOwner } = require('../utils/checkOwnership');

// @desc    Helper function to get wishlist if the user is the owner
const getOwnerWishlist = async (listId, userId, next) => {
    const wishlist = await Wishlist.findById(listId).populate('products');
    if (!wishlist || !isOwner(wishlist.user, userId)) {
        next(new AppError('Wishlist not found', 404));
        return null;
    }
    return wishlist;
}

// @desc    Get all wishlists for the logged-in user
// @route   GET /api/wishlists
// @access  Private
const getAllWishlists = async (req, res, next) => {
    const wishlists = await Wishlist.find({ user: req.user.userId });
    if (!wishlists) return next(new AppError('Wishlist not found', 404));
    res.status(200).json({ success: true, message: 'Wishlist retrieved successfully', wishlists });
}

// @desc    Get a single wishlist by ID (owned by user)
// @route   GET /api/wishlists/:id
// @access  Private
const getSingleWishlist = async (req, res, next) => {
    const listId = req.params.id;
    const userId = req.user.userId;
    const wishlist = await getOwnerWishlist(listId, userId, next);
    if (!wishlist) return;
    res.status(200).json({ success: true, message: 'Wishlist retrieved successfully', wishlist });
}

// @desc    Create a new wishlist
// @route   POST /api/wishlists
// @access  Private
const createWishlist = async (req, res, next) => {
    const { listName } = req.body;
    if (!listName || !listName.trim()) return next(new AppError('Wishlist name is required', 400));

    const wishlist = await Wishlist.create({ listName, user: req.user.userId });
    if (!wishlist) return next(new AppError('Something went wrong', 400));

    res.status(201).json({ success: true, message: 'Wishlist created successfully', wishlist });
}

// @desc    Delete a wishlist by ID (only if owned by user)
// @route   DELETE /api/wishlists/:id
// @access  Private
const deleteWishlist = async (req, res, next) => {
    const listId = req.params.id;
    const userId = req.user.userId;
    const wishlist = await getOwnerWishlist(listId, userId, next);
    if (!wishlist) return;
    
    await wishlist.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Wishlist deleted successfully',
        wishlist
    });
}

// @desc    Toggle product in wishlist (add or remove)
// @route   PATCH /api/wishlists/:listId/toggle/:productId
// @access  Private
const productToggle = async (req, res, next) => {
    const { listId, productId } = req.params;
    const userId = req.user.userId;
    const wishlist = await getOwnerWishlist(listId, userId, next);
    if (!wishlist) return;

    const productIndex = wishlist.products.findIndex((doc) => doc._id.toString() === productId);

    if (productIndex !== -1) {
        wishlist.products.splice(productIndex, 1);
        await wishlist.save();
        return res.status(200).json({ success: true, message: 'Product removed from wishlist', wishlist });
    } else {
        const isProductExist = await Product.exists({ _id: productId });
        if (!isProductExist) return next(new AppError('Wishlist or Product not found', 404));
        wishlist.products.push(productId);
        await wishlist.save();
        return res.status(200).json({ success: true, message: 'Product added to wishlist', wishlist });
    }
}

module.exports = {
    getAllWishlists,
    getSingleWishlist,
    createWishlist,
    deleteWishlist,
    productToggle
}
