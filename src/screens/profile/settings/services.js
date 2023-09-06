import request2 from 'src/utils/fetch2';

/**
 * API check Stripe token
 * @param data
 * @returns {Promise<unknown>}
 */
export const checkStripeToken = async (data) => {
  return await request2.checkStripeToken(`/api/v1/payment/stripeCallback`, data);
}

/*
 * API udpate setting
 * @param data
 * @returns {Promise<unknown>}
 */
export const updateSetting = async (data) => {
  return await request2.updateSetting(`/api/v1/users/settings`, data);
}

/**
 * API delete account
 * @param data
 * @returns {Promise<unknown>}
 */
export const deleteAccount = async (data) => {
  return await request2.deleteAccount(`/api/v1/users`, data);
}