const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Authentication failed, token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed, token invalid' });
    }
};

module.exports = { authenticateUser };