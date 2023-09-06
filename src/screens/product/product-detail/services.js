
import request2 from 'src/utils/fetch2';

/**
 * API send comment
 * @param data
 * @returns {Promise<unknown>}
 */
export const sendComment = async (data) => {
  return await request2.sendComment(`/api/v1/comments`, data);
}

/**
 * API get comments
 * @param data
 * @returns {Promise<unknown>}
 */
export const getComments = async (data) => {
  return await request2.getComments(`/api/v1/comments?productId=${data}`);
}

/**
 * API get list product
 * @param data
 * @returns {Promise<unknown>}
 */
export const getProductDetail = async (data) => {
  return await request2.getProductDetail(`/api/v1/products/${data}`);
}

/**
 * API get likes list
 * @param data
 * @returns {Promise<unknown>}
 */
export const getLikesList = async (data) => {
  return await request2.getLikesList(`/api/v1/products/${data}/likes`);
}

/**
 * API delete comment
 * @param data
 * @returns {Promise<unknown>}
 */
export const deleteComment = async (data) => {
  return await request2.deleteComment(`/api/v1/comments/${data}`);
}