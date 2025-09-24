import Joi from 'joi';

export const crerateVehicleByAdminSchema = Joi.object({
  User: Joi.string().required(),
  name: Joi.string().required(),
  type: Joi.string().required(),
  powerKW: Joi.number().required(),
  status: Joi.string().valid('empty', 'in-charging', 'full').default('empty'),
});

export const updateVehicleSchema = Joi.object({
  User: Joi.string().optional(),
  name: Joi.string().optional(),
  type: Joi.string().optional(),
  powerKW: Joi.number().optional(),
  status: Joi.string().valid('empty', 'in-charging', 'full').default('empty'),
});
