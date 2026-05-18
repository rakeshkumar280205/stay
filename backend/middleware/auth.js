/**
 * Middleware: Check if user is authenticated (guest)
 */
export const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated as user" });
    }
    req.userId = req.session.userId;
    next();
};

/**
 * Middleware: Check if user is authenticated as host
 */
export const isHostAuthenticated = (req, res, next) => {
    if (!req.session.hostId) {
        return res.status(401).json({ message: "Not authenticated as host" });
    }
    req.hostId = req.session.hostId;
    next();
};

/**
 * Middleware: Check if user is admin
 */
export const isAdmin = (req, res, next) => {
    if (!req.session.hostId || req.session.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
};

/**
 * Middleware: Check if user is host or admin
 */
export const isHostOrAdmin = (req, res, next) => {
    if (!req.session.hostId || (req.session.role !== "host" && req.session.role !== "admin")) {
        return res.status(403).json({ message: "Host or Admin access required" });
    }
    next();
};
