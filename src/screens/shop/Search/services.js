
import request2 from 'src/utils/fetch2';

/**
 * API get list search
 * @param data
 * @returns {Promise<unknown>}
 */
export const getListSearch = async (data) => {
  return await request2.getListSearch(`/api/v1/products`, data);
}

/**
 * API get list filter
 * @param data
 * @returns {Promise<unknown>}
 */
export const getListFilter = async (data) => {
  return await request2.getListFilter(`/api/v1/products`, data);
}