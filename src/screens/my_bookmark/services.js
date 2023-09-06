import request2 from 'src/utils/fetch2';

/**
 * API order Product
 * @param data
 * @returns {Promise<unknown>}
 */
export const orderProduct = async (data) => {
  return await request2.orderProduct('/api/v1/orders', data);
}

/**
 * API get Bookmarked Products
 * @param data
 * @returns {Promise<unknown>}
 */
export const getBookmarkedProducts = async (data) => {
  return await request2.getBookmarkedProducts(`/api/v1/users/bookmarks?limit=${data.limit}&page=${data.page}&type=product`);
}

/**
 * API get Bookmarked Profiles
 * @param data
 * @returns {Promise<unknown>}
 */
export const getBookmarkedProfiles = async (data) => {
  return await request2.getBookmarkedProfiles(`/api/v1/users/bookmarks?limit=${data.limit}&page=${data.page}&type=profile`);
}