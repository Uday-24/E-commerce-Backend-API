const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { signAccessToken, signRefreshToken } = require('../utils/authUtils');
const AppError = require('../utils/AppError');

const register = async (req, res, next) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) return next(new AppError('Email already registered', 400));

    const user = new User({ name, email, password });
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({ success: true, message: 'Register successful', accessToken });
}

const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return next(new AppError('Invalid Credentials', 401));

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return next(new AppError('Invalid Credentials', 401));


    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({ success: true, message: 'Login successful', accessToken });
}

const refreshToken = async (req, res, next) => {
    const token = req.cookies.refreshToken;
    if (!token) return next(new AppError('Invalid Token', 401));

    try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(payload.userId);
        if (!user || user.refreshToken !== token) return next(new AppError('Invalid Token', 401));

        const accessToken = signAccessToken(user);
        const refreshToken = signRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ accessToken });

    } catch (error) {
        next(new AppError('Expired Token', 401));
    }
}

const logout = async (req, res, next) => {
    const token = req.cookies.refreshToken;
    if (!token) return next(new AppError('Invalid Token', 401));

    try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(payload.userId);
        if (!user || user.refreshToken !== token) return next(new AppError('Invalid Token', 401));

        user.refreshToken = null;
        await user.save();

        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });

        res.status(200).json({ success: true, message: 'Logout successful' });
    } catch (error) {
        next(new AppError('Expired Token', 401));
    }
}

module.exports = {
    register,
    login,
    refreshToken,
    logout
}