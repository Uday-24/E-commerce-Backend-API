const Address = require('../models/Address');
const AppError = require('../utils/AppError');
const { isOwner } = require('../utils/checkOwnership');

// @desc    Internal helper to validate address ownership
const getOwnerAddress = async (addressId, userId, next) => {
    const address = await Address.findById(addressId);
    if (!address || !isOwner(address.user, userId)) {
        next(new AppError('Address not found', 404));
        return null;
    }
    return address;
};

// @desc    Get all addresses of the logged-in user
// @route   GET /api/addresses
// @access  Private
const getAllAddresses = async (req, res, next) => {
    const addresses = await Address.find({ user: req.user.userId });
    if (!addresses) return next(new AppError('Addresses not found', 404));
    res.status(200).json({ success: true, message: 'Address retrieved successfully', addresses });
};

// @desc    Get a single address by ID
// @route   GET /api/addresses/:id
// @access  Private
const getAddress = async (req, res, next) => {
    const address = await getOwnerAddress(req.params.id, req.user.userId, next);
    if (!address) return;
    res.status(200).json({ success: true, message: 'Address retrieved successfully', address });
};

// @desc    Create a new address
// @route   POST /api/addresses
// @access  Private
const createAddress = async (req, res, next) => {
    const addressCount = await Address.countDocuments({ user: req.user.userId });
    if (addressCount >= 3) return next(new AppError('You can save up to 3 addresses.', 400));

    const address = new Address({
        user: req.user.userId,
        ...req.body
    });

    if (!address) return next(new AppError('Address was not created', 400));

    if (addressCount === 0) {
        address.isDefault = true;
    }

    await address.save();

    res.status(201).json({ success: true, message: 'Address created successfully', address });
};

// @desc    Update an address
// @route   PUT /api/addresses/:id
// @access  Private
const updateAddress = async (req, res, next) => {
    const address = await getOwnerAddress(req.params.id, req.user.userId, next);
    if (!address) return;

    const updatedAddress = await Address.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        { new: true, runValidators: true }
    );

    if (!updatedAddress) return next(new AppError('Something went wrong', 400));

    res.status(200).json({ success: true, message: 'Address updated successfully', updatedAddress });
};

// @desc    Delete an address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = async (req, res, next) => {
    const address = await getOwnerAddress(req.params.id, req.user.userId, next);
    if (!address) return;

    await address.deleteOne();

    res.status(204).json({ success: true, message: 'Address deleted successfully', address });
};

// @desc    Set an address as default
// @route   PATCH /api/addresses/:id/default
// @access  Private
const selectDefaultAddress = async (req, res, next) => {
    const address = await getOwnerAddress(req.params.id, req.user.userId, next);
    if (!address) return;

    if (address.isDefault) {
        return res.status(200).json({ success: true, message: 'Default address updated successfully' });
    }

    const defaultAddress = await Address.findOne({ user: req.user.userId, isDefault: true });
    if (!defaultAddress) return next(new AppError('Something went wrong', 400));

    defaultAddress.isDefault = false;
    address.isDefault = true;

    await defaultAddress.save();
    await address.save();

    return res.status(200).json({ success: true, message: 'Default address updated successfully' });
};

module.exports = {
    getAllAddresses,
    getAddress,
    createAddress,
    updateAddress,
    deleteAddress,
    selectDefaultAddress
};
