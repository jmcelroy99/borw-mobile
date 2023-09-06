import request2 from 'src/utils/fetch2';

/**
 * API cancel order
 * @param data
 * @returns {Promise<unknown>}
 */
export const cancelOrder = async (data) => {
  return await request2.cancelOrder(`/api/v1/orders/${data}/cancel`);
}

/**
 * API update status order
 * @param data
 * @returns {Promise<unknown>}
 */
export const updateStatusOrder = async (data) => {
  return await request2.updateStatusOrder(`/api/v1/orders/${data.orderId}/updateStatus`, data);
}

/**
 * API add photos order
 * @param data
 * @returns {Promise<unknown>}
 */
export const addOrderPhotos = async (data) => {
  return await request2.addOrderPhotos(`/api/v1/orders/${data.orderId}/photos`, data);
}

/**
 * API get photos order
 * @param data
 * @returns {Promise<unknown>}
 */
export const getOrderPhotos = async (data) => {
  return await request2.getOrderPhotos(`/api/v1/orders/${data.orderId}/photos?step=${data.step}`);
}

/**
 * API get photos order
 * @param data
 * @returns {Promise<unknown>}
 */
export const deleteOrderPhoto = async (data) => {
  return await request2.deleteOrderPhoto(`/api/v1/orders/${data.orderId}/photos`, data);
}

/**
 * API complete order
 * @param data
 * @returns {Promise<unknown>}
 */
export const completeOrder = async (data) => {
  return await request2.completeOrder(`/api/v1/orders/${data.orderId}/complete`);
}

/**
 * API rating user
 * @param data
 * @returns {Promise<unknown>}
 */
export const ratingUser = async (data) => {
  return await request2.ratingUser(`/api/v1/ratings`, data);
}

/**
 * API archive order
 * @param data
 * @returns {Promise<unknown>}
 */
export const archiveOrder = async (data) => {
  return await request2.archiveOrder(`/api/v1/orders/${data}/archive`);
}

/**
 * API purchase extra fee
 * @param data
 * @returns {Promise<unknown>}
 */
export const purchaseExtraFee = async (data) => {
  return await request2.purchaseExtraFee(`/api/v1/orders/${data.orderId}/purchaseExtraFee`);
}

/**
 * API post purchase order
 * @param data
 * @returns {Promise<unknown>}
 */
export const purchaseOrder = async (data) => {
  return await request2.purchaseOrder(`/api/v1/orders/${data.orderId}/purchase`, data);
}