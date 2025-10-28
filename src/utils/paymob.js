import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID;
const PAYMOB_API_URL = process.env.PAYMOB_API_URL;

export const paymob = {
  authenticate: async () => {
    const { data } = await axios.post(`${PAYMOB_API_URL}/auth/tokens`, {
      api_key: PAYMOB_API_KEY,
    });
    return data.token;
  },

  createOrder: async (token, amount, currency = 'EGP') => {
    const { data } = await axios.post(`${PAYMOB_API_URL}/ecommerce/orders`, {
      auth_token: token,
      delivery_needed: 'false',
      amount_cents: amount * 100,
      currency,
      items: [],
    });
    return data;
  },

  generatePaymentKey: async (token, orderId, amount, billingData) => {
    const { data } = await axios.post(
      `${PAYMOB_API_URL}/acceptance/payment_keys`,
      {
        auth_token: token,
        amount_cents: amount * 100,
        expiration: 3600,
        order_id: orderId,
        billing_data: billingData,
        currency: 'EGP',
        integration_id: PAYMOB_INTEGRATION_ID,
      }
    );
    return data.token;
  },
};

