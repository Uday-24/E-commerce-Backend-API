const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json('Login first');
    }

    const token = authHeader.split(' ')[0];

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    }catch(error){
        return res.status(401).json('Invalid or expired token');
    }
}

const isAdmin = (req, res, next) => {
    if(req.user?.role !== 'admin'){
        return res.status(403).json({message: 'Access denied'});
    }
    next();
}

module.exports = {
    protect,
    isAdmin
}