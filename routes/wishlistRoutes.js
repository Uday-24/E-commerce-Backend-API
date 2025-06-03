const express = require('express');
const router = express.Router();
const { protected } = require('../middlewares/authMiddleware');
const { createWishlist, deleteWishlist, productToggle, getAllWishlists, getSingleWishlist } = require('../controllers/wishlistController');

router.post('/', protected, createWishlist);
router.get('/', protected, getAllWishlists);
router.get('/:id', protected, getSingleWishlist);
router.delete('/:id', protected, deleteWishlist);
router.patch('/:listId/toggle/:productId', protected, productToggle);

module.exports = router;