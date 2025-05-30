const express = require('express');
const { protected, isAdmin } = require("../middlewares/authMiddleware");
const { getAllProducts, getSingleProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { productValidation } = require('../validators/productValidator');
const { validateRequest } = require('../validators/validateErrors');
const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getSingleProducts);

// Admin routes
router.post('/', protected, isAdmin, productValidation, validateRequest, createProduct);
router.put('/:id', protected, isAdmin, productValidation, validateRequest, updateProduct);
router.delete('/:id', protected, isAdmin, deleteProduct);

module.exports = router;