const errorHandler = (error, req, res, next) => {
    console.error('❌ Error:', error);

    // Default error
    let statusCode = 500;
    let message = 'Internal server error';

    // Validation errors
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = error.message;
    }

    // Database errors
    if (error.code) {
        switch (error.code) {
            case 'SQLITE_CONSTRAINT_UNIQUE':
                statusCode = 409;
                message = 'Resource already exists';
                break;
            case 'SQLITE_CONSTRAINT_FOREIGNKEY':
                statusCode = 400;
                message = 'Invalid reference';
                break;
            default:
                statusCode = 500;
                message = 'Database error';
        }
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }

    if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    // Rate limit errors
    if (error.status === 429) {
        statusCode = 429;
        message = 'Too many requests';
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
};

module.exports = errorHandler;