const hasPermissions = (roles) => {
    return (req, res, next) => {
        const userRole = req.role;
        if (!roles.includes(userRole)) {
            return res.status(401).json({ message: 'forbidden'});
        }
        next();
    }
}

module.exports = hasPermissions;