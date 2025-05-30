const Product = require('../models/Product');
const AppError = require('../utils/AppError');

// @desc Get all products (Public, User)
// @route GET api/products
const getAllProducts = async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({ success: true, message: 'Get all products', products });
}

// @desc Get a product (Public, User)
// @route GET api/products/:id
const getSingleProducts = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new AppError('Product not found', 404));
    res.status(201).json({ success: true, product });
}

// @desc Create a product (Private, Admin)
// @route POST api/products/
const createProduct = async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, message: `${product.name} added to stock` });
}

// @desc Update a product (Private, Admin)
// @route PUT api/products/:id
const updateProduct = async (req, res, next) => {
    const updateProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if(!updateProduct) return next(new AppError('Product not found', 404));
    res.status(200).json({ success:true, message: 'Product updated', updateProduct });
}

// @desc Delete a product (Private, Admin)
// @route DELETE api/products/:id
const deleteProduct = async (req, res, next) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if(!deletedProduct) return next(new AppError('Product not found', 404));
    res.status(200).json({ success:true, message: 'Product deleted', deletedProduct });
}

module.exports = {
    getAllProducts,
    getSingleProducts,
    createProduct,
    updateProduct,
    deleteProduct
}