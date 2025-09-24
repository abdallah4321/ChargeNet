import { isValidObjectId } from 'mongoose';
import Joi from 'joi';
export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: 'fail',
        errors: error.details.map((err) => err.message),
      });
    }
    next();
  };
};

export const validateParam = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: 'fail',
        errors: error.details.map((err) => err.message),
      });
    }
    next();
  };
};

export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: 'fail',
        errors: error.details.map((err) => err.message),
      });
    }
    next();
  };
};

export const idParamSchema = Joi.object({
  id: Joi.string()
    .custom((value, helpers) => {
      if (!isValidObjectId(value)) {
        return helpers.error('any.custom', {
          message: 'Invalid ID format. Must be a MongoDB ObjectId',
        });
      }
      return value;
    })
    .required()
    .messages({
      'any.required': 'ID is required',
    }),
});
