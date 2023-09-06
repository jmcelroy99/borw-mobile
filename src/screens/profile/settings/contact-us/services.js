import request2 from 'src/utils/fetch2';

/**
 * API send contact us
 * @param data
 * @returns {Promise<unknown>}
 */
export const sendContact = async (data) => {
  return await request2.sendContact(`/api/v1/users/contact`, data);
}