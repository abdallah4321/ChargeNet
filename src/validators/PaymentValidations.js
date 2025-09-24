import Joi from 'joi';

export const PaymentValidations = Joi.object({
  paymentId: Joi.string().required(),
  bookingId: Joi.string().required(),
  amount: Joi.string().required(),
  paymentMethod: Joi.string().required(),
  paymentStatus: Joi.string()
    .valid('pending', 'confirmed', 'completed', 'canceled')
    .default('pending'),
  transactionRef: Joi.string().required(),
});
