import Joi from 'joi';

export const crerateVehicleSchema = Joi.object({
  UserId: Joi.string().required(),
  name: Joi.string().required(),
  type: Joi.string().required(),
  powerKW: Joi.number().required(),
  status: Joi.string().valid('empty', 'in-charging', 'full').default('empty'),
});


export const updateVehicleSchema = Joi.object({
  UserId: Joi.string().optional(),
  name: Joi.string().optional(),
  type: Joi.string().optional(),
  powerKW: Joi.number().optional(),
  status: Joi.string().valid('empty', 'in-charging', 'full').default('empty'),
});

export const idParamSchema = Joi.object({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)          
    .required()
    .messages({
      "string.pattern.base": "Invalid ID format. Must be a MongoDB ObjectId",
      "any.required": "ID is required",
    }),
});
