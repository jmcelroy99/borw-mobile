import request2 from 'src/utils/fetch2';

/**
 * API order Product
 * @param data
 * @returns {Promise<unknown>}
 */
export const orderProduct = async (data, lang) => {
  return await request2.orderProduct('/api/v1/orders', data, { lang });  
}