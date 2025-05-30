const jwt = require('jsonwebtoken');

exports.signAccessToken = (user) => {
    return jwt.sign({ userId: user.id, userRole: user.role }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_EXPIRE || '15m' });
}

exports.signRefreshToken = (user) => {
    return jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_EXPIRE || '7d'});
}