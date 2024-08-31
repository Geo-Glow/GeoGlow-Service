function errorHandler(err, req, res, next) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
}

module.exports = errorHandler;