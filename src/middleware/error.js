import dotenv from 'dotenv';
import APIError from '../utils/apiError.js';
dotenv.config();

const notfound = (req, res, next) => {
  next(new APIError(`not foud - ${req.originalUrl}`, 404));
};
//globle error handleing middleware
const errorhandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export { errorhandler, notfound };
