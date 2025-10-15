import Joi from 'joi';

export const PaymentInitiateValidation = Joi.object({
  orderId: Joi.string().required(),
  paymentMethod: Joi.string().valid('Paymob').required(),
  currency: Joi.string().valid('EGP').required(),
  billingData: Joi.object({
    apartment: Joi.string().required(),
    email: Joi.string().email().required(),
    floor: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    street: Joi.string().required(),
    building: Joi.string().required(),
    phone_number: Joi.string().required(),
    shipping_method: Joi.string().required(),
    postal_code: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    state: Joi.string().required(),
  }).required(),
});

export const PaymentCallbackValidation = Joi.object({
  id: Joi.string().required(),
  success: Joi.boolean().required(),
  order: Joi.object({
    id: Joi.number().required(),
  }).required(),
});
