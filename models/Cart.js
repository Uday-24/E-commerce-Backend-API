const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);