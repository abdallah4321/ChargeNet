import Joi from 'joi';

export const createUnitsSchema = Joi.object({
  stationId: Joi.string().required(),
  //unitId: Joi.string().required(),
  // vehiclesId: Joi.string().optional(),
  name: Joi.string().min(2).required(),
  unitType: Joi.string().required(),
  status: Joi.string()
    .valid('available', 'in-use', 'maintenance')
    .default('available'),
  pricePerHour: Joi.number().required(),
  lastMaintenance: Joi.date()
    .iso()
    .messages({
      'date.base': 'lastMaintenance must be a valid date',
      'date.format': 'lastMaintenance must be in ISO format (YYYY-MM-DD)',
    })
    .optional(),
});

export const updateUnitsSchema = Joi.object({
  stationId: Joi.string().optional(),
  // unitId: Joi.string().optional(),
  // vehiclesId: Joi.string().optional(),
  name: Joi.string().min(2).optional(),
  unitType: Joi.string().optional(),
  status: Joi.string()
    .valid('available', 'in-use', 'maintenance')
    .default('available'),
  pricePerHour: Joi.number().optional(),
  lastMaintenance: Joi.date().optional(),
});
