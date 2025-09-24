import Joi from 'joi';

export const createStationSchema = Joi.object({
  ownerId: Joi.string().required(),
  name: Joi.string().min(2).required(),
  stationImg: Joi.string().optional(),
  location: Joi.object({
    type: Joi.string().valid('Point').default('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2).required(), // [lng, lat]
  }).required(),
  capacity: Joi.number().required(),
  units: Joi.array().items(Joi.string()).optional(),
  unitsCount: Joi.number().min(0).default(0),
  status: Joi.string().valid('active', 'inactive').default('active'),
});

export const updateStationSchema = Joi.object({
  ownerId: Joi.string().optional(),
  stationImg: Joi.string().optional(),
  name: Joi.string().min(2).optional(),
  location: Joi.object({
    type: Joi.string().valid('Point').default('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2).optional(),
  }).optional(),
  capacity: Joi.number().optional(),
  unitsCount: Joi.number().min(0).optional(),
  units: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
});
