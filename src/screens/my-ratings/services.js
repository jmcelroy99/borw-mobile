import request2 from 'src/utils/fetch2';

/**
 * API get ratings from sellers
 * @param data
 * @returns {Promise<unknown>}
 */
export const getRatingsFromSellers = async (data) => {
  return await request2.getRatingsFromSellers(`/api/v1/users/${data.userId}/ratings?from=seller&limit=${data.limit}&page=${data.page}`);
}

/**
 * API get ratings from buyers
 * @param data
 * @returns {Promise<unknown>}
 */
export const getRatingsFromBuyers = async (data) => {
  return await request2.getRatingsFromBuyers(`/api/v1/users/${data.userId}/ratings?from=buyer&limit=${data.limit}&page=${data.page}`);
}

