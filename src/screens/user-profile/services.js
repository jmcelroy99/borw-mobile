import request2 from 'src/utils/fetch2';

/**
 * API get user info
 * @param data
 * @returns {Promise<unknown>}
 */
export const getUserInfo = async (data) => {
  if (data.userId) {
    return await request2.getUserInfo(`/api/v1/users/${data.userId}`);
  } else if (data.me) {
    return await request2.getUserInfo(`/api/v1/users/me`);
  }
}

/**
 * API get products
 * @param data
 * @returns {Promise<unknown>}
 */
export const getProductOfUser = async (data) => {
  return await request2.getProductOfUser(`/api/v1/products/owner/${data.userId}?page=${data.page}&limit=${data.limit}`);
}

/**
 * API bookmark profile
 * @param data
 * @returns {Promise<unknown>}
 */
export const bookmarkProfile = async (data) => {
  return await request2.bookmarkProfile(`/api/v1/users/${data.id}/bookmark`, data);
}