import request2 from 'src/utils/fetch2';

/**
 * API get google account
 * @param data
 * @returns {Promise<unknown>}
 */
export const getGoogleAccount = async () => {
  return await request2.getGoogleAccount();
}

/**
 * API disconnect Google
 * @param data
 * @returns {Promise<unknown>}
 */
export const disconnectGoogle = async () => {
  return await request2.disconnectGoogle();
}

/**
 * API get facebook account
 * @param data
 * @returns {Promise<unknown>}
 */
export const getFacebookAccount = async () => {
  return await request2.getFacebookAccount();
}

/**
 * API disconnect Facebook
 * @param data
 * @returns {Promise<unknown>}
 */
export const disconnectFacebook = async () => {
  return await request2.disconnectFacebook();
}

/**
 * API get user info for edit
 * @param data
 * @returns {Promise<unknown>}
 */
export const getEditUserInfo = async () => {
  return await request2.getUserInfo('/api/v1/users/me');
}

/**
 * API update user profile
 * @param data
 * @returns {Promise<unknown>}
 */
export const updateUserProfile = async (data) => {
  return await request2.updateUserProfile('/api/v1/users', data);
}

/**
 * API verify email
 * @param data
 * @returns {Promise<unknown>}
 */
export const verifyEmail = async () => {
  return await request2.verifyEmail('/api/v1/users/verifyEmail');
}