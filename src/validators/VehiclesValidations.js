import Joi from 'joi';

export const vehicleSchema = Joi.object({
  vehicleId: Joi.string().required(),
  UserId: Joi.string().required(),
  name: Joi.string().required(),
  type: Joi.string().required(),
  powerKW: Joi.number().required(),
  status: Joi.string().valid('empty', 'in-charging', 'full').default('empty'),
});
