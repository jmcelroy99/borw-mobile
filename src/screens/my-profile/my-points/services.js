import request2 from 'src/utils/fetch2';

/**
 * API get list my points
 * @param data
 * @returns {Promise<unknown>}
 */
export const getListPoints = async (data) => {
  return await request2.getListPoints(`/api/v1/users/points?limit=${data.limit}&page=${data.page}`);
}

/**
 * API redeem code
 * @param data
 * @returns {Promise<unknown>}
 */
export const redeemCode = async (data) => {
  return await request2.redeemCode('/api/v1/users/redeemCode', data);
}

/**
 * API get user info
 * @param data
 * @returns {Promise<unknown>}
 */
export const getUserInfo = async () => {
  return await request2.getUserInfo('/api/v1/users/me');
}