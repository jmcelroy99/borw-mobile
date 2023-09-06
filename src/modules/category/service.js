import request from 'src/utils/fetch2';
import queryString from 'query-string';

/**
 * Fetch category data
 * @returns {*}
 */
export const getCategories = async () => {
  return await request.get('/api/v1/products/categories');
}
