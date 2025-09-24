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

export const idParamSchema = Joi.object({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)          
    .required()
    .messages({
      "string.pattern.base": "Invalid ID format. Must be a MongoDB ObjectId",
      "any.required": "ID is required",
    }),
});

 
export const geoSearchQuerySchema = Joi.object({
  lng: Joi.number().required().min(-180).max(180).messages({
    "any.required": "Longitude (lng) is required",
    "number.base": "Longitude must be a number",
    "number.min": "Longitude cannot be less than -180",
    "number.max": "Longitude cannot be more than 180",
  }),
  lat: Joi.number().required().min(-90).max(90).messages({
    "any.required": "Latitude (lat) is required",
    "number.base": "Latitude must be a number",
    "number.min": "Latitude cannot be less than -90",
    "number.max": "Latitude cannot be more than 90",
  }),
  radius: Joi.number().required().positive().messages({
    "any.required": "Radius is required",
    "number.base": "Radius must be a number",
    "number.positive": "Radius must be a positive number",
  }),
});
