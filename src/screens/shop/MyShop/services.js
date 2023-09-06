import request2 from 'src/utils/fetch2';
import { sampleSuccess, sampleOTPSuccess, sampleCheckOTPSuccess } from '../../../sample';
/**
 * API add new product
 * @param data
 * @returns {Promise<unknown>}
 */
export const addNewProduct = async (data) => {
  return await request2.addNewProduct('/api/v1/products', data);
}

/**
 * API update product
 * @param data
 * @returns {Promise<unknown>}
 */
export const updateProduct = async (data) => {
  return await request2.updateProduct(`/api/v1/products/${data.id}`, data);
}

/**
 * API get all my product
 * @param data
 * @returns {Promise<unknown>}
 */
export const getAllMyProducts = async (data) => {
  return await request2.getAllMyProducts(`/api/v1/products/owner/me?limit=${data.limit}&page=${data.page}`);
}

/**
 * API delete product
 * @param data
 * @returns {Promise<unknown>}
 */
export const deleteProduct = async (data, options) => {
  return await request2.deleteProduct(`/api/v1/products/${data}`, options);
}

/**
 * API clone product
 * @param data
 * @returns {Promise<unknown>}
 */
export const cloneProduct = async (data) => {
  return await request2.cloneProduct(`/api/v1/products/${data}`);
}
