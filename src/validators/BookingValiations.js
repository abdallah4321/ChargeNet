import Joi from 'joi';

export const BookingValidations = Joi.object({
  userId: Joi.string().required(),
  vehicleId: Joi.string().required(),
  unitId: Joi.string().required(),
  stationId: Joi.string().required(),
  startTime: Joi.date().required(),
  endTime: Joi.date().required(),
  totalPrice: Joi.number().required(),
  status: Joi.string()
    .valid('pending', 'confirmed', 'completed', 'canceled')
    .default('pending'),
});
