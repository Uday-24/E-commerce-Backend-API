const jwt = require('jsonwebtoken');

const signAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
}

const signRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
}

module.exports = {
    signAccessToken,
    signRefreshToken
};