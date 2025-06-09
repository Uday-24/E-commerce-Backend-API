const User = require('../models/User');
const crypto = require('crypto');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/sendEmail');

const forgotPassword = async (req, res, next) => {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!email || !user) return next(new AppError('User not found', 404));
    const token = user.generateResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `http://localhost:5000/reset-password/${token}`;
    await sendEmail(user.email, 'Password Reset', `Reset your password here ${resetUrl}`);

    res.status(200).json({ success: true, message: 'Reset link sent to email' });
}

const resetPassword = async (req, res, next) => {

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return next(new AppError('Token is invalid or expired', 400));

    user.password = req.body.newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.status(200).json({ success: true, message: 'Password reset successful' });
}

module.exports = {
    forgotPassword,
    resetPassword
}