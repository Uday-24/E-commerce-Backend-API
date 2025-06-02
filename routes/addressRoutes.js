const express = require('express');
const { protected } = require('../middlewares/authMiddleware');
const { getAllAddresses, getAddress, createAddress, updateAddress, deleteAddress, selectDefaultAddress } = require('../controllers/addressController');
const { addressValidation } = require('../validators/addressValidation');
const { validateRequest } = require('../validators/validateErrors');
const router = express.Router();

router.get('/', protected, getAllAddresses);
router.get('/:id', protected, getAddress);
router.post('/', protected, addressValidation, validateRequest, createAddress);
router.put('/:id', protected, addressValidation, validateRequest, updateAddress);
router.delete('/:id', protected, deleteAddress);
router.post('/:id/default', protected, selectDefaultAddress);

module.exports = router;