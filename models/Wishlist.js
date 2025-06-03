const mongoose = require('mongoose');

const wishlistSchema = mongoose.Schema({
    listName: {
        type: String,
        trim: true,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, { timestamps: true });

wishlistSchema.index({ listName: 1, user: 1 }, { unique: true });

/**
 * This is used to remove duplicate products from wishlist but I have used toggle function so it doesn't require
 */
// wishlistSchema.pre('save', function (next) {
//     if(this.products && Array.isArray(this.products)){
//         this.products = [...new Set(this.products.map(id => id.toString()))];
//     }
//     next();
// });

module.exports = mongoose.model('Wishlist', wishlistSchema);