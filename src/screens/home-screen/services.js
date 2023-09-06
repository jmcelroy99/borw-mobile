
import { atan } from 'react-native-reanimated';
import request2 from 'src/utils/fetch2';

/**
 * API get list product
 * @param data
 * @returns {Promise<unknown>}
 */
export const getListProduct = async (data) => {
  if (!data.isDesigner) {
    data.isDesigner = false;
  }
  if (!data.isVideo) {
    data.isVideo = false;
  }
  if (data.location) {
    return await request2.getListProduct(`/api/v1/products?page=${data.page}&limit=${data.limit}&isDesigner=${data.isDesigner}&isVideo=${data.isVideo}&location=${data.location}`);
  }
  return await request2.getListProduct(`/api/v1/products?page=${data.page}&limit=${data.limit}&isDesigner=${data.isDesigner}&isVideo=${data.isVideo}`);
}

/**
 * API get list designers
 * @param data
 * @returns {Promise<unknown>}
 */
export const getListDesigners = async (data) => {
  if (data.location) {
    return await request2.getListDesigners(`/api/v1/products?page=${data.page}&limit=${data.limit}&isDesigner=true&location=${data.location}`);
  } else {
    return await request2.getListDesigners(`/api/v1/products?page=${data.page}&limit=${data.limit}&isDesigner=true`);
  }
}

/**
 * API get list videos
 * @param data 
 * @returns {Promise<unknow>}
 */
export const getListVideos = async (data) => {
  if (data.location) {
    return await request2.getListDesigners(`/api/v1/products?page=${data.page}&limit=${data.limit}&isVideo=true&location=${data.location}`);
  } else {
    return await request2.getListDesigners(`/api/v1/products?page=${data.page}&limit=${data.limit}&isVideo=true`);
  }
}

/**
 * API like item
 * @param data
 * @returns {Promise<unknown>}
 */
export const likeItem = async (data) => {
  return await request2.likeItem(`/api/v1/products/${data.id}/likes`, data);
}

/**
 * API bookmark item
 * @param data
 * @returns {Promise<unknown>}
 */
export const bookmarkItem = async (data) => {
  return await request2.bookmarkItem(`/api/v1/products/${data.id}/bookmark`, data);
}