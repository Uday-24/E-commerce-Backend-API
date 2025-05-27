const errorHandler = (err, req, res, next) => {
    console.log('Hello');
    console.log(err);
    console.log('Status code', err.statusCode);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal error'
    });
}

module.exports = errorHandler;