const AppError = require("../utils/AppError");
const jwt = require('jsonwebtoken');

const protected = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return next(new AppError('Unauthorized access', 401));
    }

    const token = authHeader.split(' ')[1];

    try{
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decode;
        next();
    }catch(error){
        next(new AppError('Expired token', 401));
    }
}

const isAdmin = (req, res, next) => {
    if(req.user?.userRole !== 'admin'){
        return next(new AppError('Access denied', 403));
    }
    next();
}

module.exports = {
    protected,
    isAdmin
}