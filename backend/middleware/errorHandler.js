/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message);

    // Mongoose validation error
    if (err.name === "ValidationError") {
        return res.status(400).json({ message: "Validation error", errors: err.errors });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({ message: `${field} already exists` });
    }

    // Default error
    res.status(err.status || 500).json({
        message: err.message || "Internal server error",
    });
};

/**
 * 404 Not Found middleware
 */
export const notFound = (req, res) => {
    res.status(404).json({ message: "Route not found" });
};
