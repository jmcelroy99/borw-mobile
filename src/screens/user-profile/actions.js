import * as Actions from './actionTypes';

/**
 * Action get user info
 * @param data
 */
export function getUserInfo(data) {
  return {
    type: Actions.GET_USER_PROFILE_INFO,
    data
  };
}

/**
 * Action get products
 * @param data
 */
export function getProducts(data) {
  return {
    type: Actions.GET_PRODUCTS,
    data
  };
}

/**
 * Action bookmark profile
 * @param data
 */
export function bookmarkProfile(data) {
  return {
    type: Actions.BOOKMARK_PROFILE,
    data
  };
}