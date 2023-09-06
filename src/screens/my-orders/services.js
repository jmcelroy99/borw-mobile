import request2 from 'src/utils/fetch2';

/**
 * API get list product
 * @param data
 * @returns {Promise<unknown>}
 */
export const getListOrders = async (data) => {
  return await request2.getListOrders('/api/v1/orders', data);
}

/**
 * API get order detail
 * @param data
 * @returns {Promise<unknown>}
 */
export const getOrderDetail = async (data) => {
  return await request2.getOrderDetail(`/api/v1/orders/${data}`);
}