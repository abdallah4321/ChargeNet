import APIError from '../utils/apiError.js';
import { verifyToken } from '../utils/jwt.js';

export const protect = (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new APIError('Not authorized, no token provided', 401);
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    next(new APIError('Not authorized or token failed', 401));
  }
};

export const checkRole = (roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      return next();
    }
    next(new APIError('Access denied: insufficient permissions', 403));
  };
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new APIError(`Access denied: Allowed only for ${roles.join(', ')}`, 403)
      );
    }
    next();
  };
};
