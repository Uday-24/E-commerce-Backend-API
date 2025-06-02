// const Address = require('../models/Address');
const Address = require('../models/Address');
const AppError = require('../utils/AppError');
const { isOwner } = require('../utils/checkOwnership');

const getAllAddresses = async (req, res, next) => {
    const addresses = await Address.find({ user: req.user.userId });
    if (!addresses) return next(new AppError('Addresses not found', 404));
    res.status(200).json({ success: true, message: 'Gets all addresses', addresses });
}

const getAddress = async (req, res, next) => {
    const address = await Address.findById(req.params.id);
    if (!address || !isOwner(address.user, req.user.userId)) return next(new AppError('Address not found', 404));
    res.status(200).json({ success: true, message: 'You got address', address });
}
const createAddress = async (req, res, next) => {
    const addressCount = await Address.countDocuments({ user: req.user.userId });
    if (addressCount >= 3) return next(new AppError('You can save upto 3 addresses.', 400));

    const address = await Address.create({
        user: req.user.userId,
        ...req.body
    });

    if (!address) return next(new AppError('Address doest not created', 400));

    res.status(201).json({ success: true, message: 'New address created', address });
}
const updateAddress = async (req, res, next) => {
    const address = await Address.findById(req.params.id);
    if (!address || !isOwner(address.user, req.user.userId)) return next(new AppError('Address not found', 404));

    const updatedAddress = await Address.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        { new: true, runValidators: true }
    );

    if (!updatedAddress) return next(new AppError('Something went wrong', 400));

    res.status(200).json({ success: true, message: 'Address updated', updatedAddress });
}
const deleteAddress = async (req, res, next) => {
    const address = await Address.findById(req.params.id);
    if (!address || !isOwner(address.user, req.user.userId)) return next(new AppError('Address not found', 404));

    await address.deleteOne();

    res.status(200).json({ success: true, message: 'Address deleted', address });
}

module.exports = {
    getAllAddresses,
    getAddress,
    createAddress,
    updateAddress,
    deleteAddress
}