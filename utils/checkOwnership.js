/**
 * Check if the logged-in user is the owner of a resource.
 * @param {ObjectId} resourceOwnerId - The ObjectId from the resource (e.g., address.user)
 * @param {string} userId - The current logged-in user's ID (from req.user.id)
 * @returns {boolean}
 */

exports.isOwner = (resourceOwnerId, userId) => {
    return resourceOwnerId.toString() === userId
}