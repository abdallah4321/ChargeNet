import Joi from 'joi';

export const BookingValidations = Joi.object({
  vehicle: Joi.string().required(),
  unit: Joi.string().required(),
  startTime: Joi.date().required(),
  endTime: Joi.date().greater(Joi.ref('startTime')).required(),
});
