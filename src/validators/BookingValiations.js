import Joi from 'joi';

export const BookingValidations = Joi.object({
  vehicle: Joi.string().required().messages({
    'any.required': 'Vehicle is required',
    'string.empty': 'Vehicle cannot be empty'
  }),
  unit: Joi.string().required().messages({
    'any.required': 'Unit is required',
    'string.empty': 'Unit cannot be empty'
  }),
  startTime: Joi.date().required().greater('now').messages({
    'any.required': 'Start time is required',
    'date.greater': 'Start time must be in the future'
  }),
  endTime: Joi.date().required().greater(Joi.ref('startTime')).messages({
    'any.required': 'End time is required',
    'date.greater': 'End time must be after start time'
  }),
});