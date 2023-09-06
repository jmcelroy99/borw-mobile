import * as Actions from './actionTypes';

/**
 * Action order product
 * @param data
 */
export function orderProduct(data) {
  return {
    type: Actions.ORDER_PRODUCT,
    data
  };
}

/**
 * Action get bookmarked profiles
 * @param data
 */
export function getBookmarkedProfiles(data) {
  return {
    type: Actions.GET_BOOKMARKED_PROFILES,
    data
  };
}

/**
 * Action get bookmarked products
 * @param data
 */
export function getBookmarkedProducts(data) {
  return {
    type: Actions.GET_BOOKMARKED_PRODUCTS,
    data
  };
}