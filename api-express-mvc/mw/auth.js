const jwt = require('jsonwebtoken');
const secretKey = "mySecretKey";

// Generar un token JWT
function generateToken(user) {
    return jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
}

// Verificar un token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token.split(" ")[1], secretKey, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid Token" });
        req.user = decoded;
        next();
    });
};

module.exports = {
    generateToken,
    verifyToken
};