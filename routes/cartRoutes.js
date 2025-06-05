const express = require('express');
const { protected } = require('../middlewares/authMiddleware');
const { getCart, addToCart, removeFromCart, updateCartItem, clearCart } = require('../controllers/cartController');
const router = express.Router();

router.get('/', protected, getCart);
router.post('/add', protected, addToCart);
router.delete('/remove/:productId', protected, removeFromCart);
router.patch('/update/:productId', protected, updateCartItem);
router.delete('/clear', protected, clearCart);

module.exports = router;