const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { signAccessToken, signRefreshToken } = require('../utils/jwt');

const register = async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already Registered' });

    const user = await User.create({ name, email, password });
    res.status(201).json({ success: true, message: 'New user registered' });
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        sameSiteL: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ success: true, accessToken, message: 'Login success' });
}

const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'Refresh token missing' });

    try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(payload.id);
        if (!user || user.refreshToken !== token) return res.status(403).json({ message: 'Invalid refresh token' });

        const newAccessToken = signAccessToken(user);
        const newRefreshToken = signRefreshToken(user);

        user.refreshToken = newRefreshToken;
        await user.save();

        res
            .cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                sameSite: 'strict',
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .json({ accessToken: newAccessToken });

    } catch (error) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
}

const logout = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(204);

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);

    if (!user || user.refreshToken !== token) return res.sendStatus(204);

    user.refreshToken = null;
    await user.save();

    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'Strict',
        // secure: process.env.NODE_ENV === 'production',
    });

    res.json({ message: 'Logout successful' });
}

module.exports = {
    register,
    login,
    logout,
    refreshToken
}