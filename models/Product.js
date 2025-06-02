const mongoose = require('mongoose');
const Wishlist = require('./Wishlist');
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

productSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Wishlist.updateMany(
            { products: doc._id },
            { $pull: { products: doc._id } }
        );
    }
});

module.exports = mongoose.model('Product', productSchema);