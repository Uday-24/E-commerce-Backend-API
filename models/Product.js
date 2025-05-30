const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    imageurl: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    review: [reviewSchema],
    averageRatig: {
        type: Number,
        default: 0
    },
    numberReviews: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);