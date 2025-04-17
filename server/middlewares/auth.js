export const isAuthenticated = (req, res, next) => {
    // Dummy middleware placeholder, extend with Firebase or JWT
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    // Verify token logic here (Firebase Admin SDK or JWT)
    next();
};