const hasPermissions = (roles) => {
    return (req, res, next) => {
        const userRole = req.role;
        if (!roles.includes(userRole)) {
            return res.status(403).json({ message: 'Forbidden'});
        }
        next();
    }
}

module.exports = hasPermissions;