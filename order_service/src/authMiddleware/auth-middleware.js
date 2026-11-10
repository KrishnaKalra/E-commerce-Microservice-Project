import jwt from 'jsonwebtoken';
import config from '../../config/index.js'

const authMiddleware = async (req, res, next) => {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
        res.status(401).json({
            success: false,
            message: 'Authorization Header Missing.'
        });
        return;
    }
    const token = bearerToken.split(' ')[1];
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Auth token is missing.'
        });
        return;
    }
    try {
        const user = jwt.verify(token, config.JWT_PUBLIC_KEY, { algorithms: ['RS256'], issuer: 'auth-microservice' });
        req.user = user.user ? { ...user.user, ...user, id: user.id || user.user.id } : user;
        console.log(req.user);
        next();
    }
    catch (error) {
        console.log("JWT Error:",error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
}
export default authMiddleware;