const express = require('express');
const router = express.Router();
const { protected, isAdmin } = require('../middlewares/authMiddleware');
const { createOrder, getMyOrder, getSingleOrder, getAllOrder, updateOrderStatus } = require('../controllers/orderController');

router.post('/', protected, createOrder);
router.get('/', protected, getMyOrder);
router.get('/:orderId', protected, getSingleOrder);
router.get('/admin', protected, isAdmin, getAllOrder);
router.patch('/admin/:orderId', protected, isAdmin, updateOrderStatus);

module.exports = router;