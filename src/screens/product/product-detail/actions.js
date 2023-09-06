import * as Actions from './actionTypes';

/**
 * Action add item to cart
 * @param data
 */
export function addItemToCart(data) {
  return {
    type: Actions.ADD_ITEM_TO_CART,
    data
  };
}

/**
 * Action fetch data cart from async
 * @param data
 */
export function fetchDataCartAsync(data) {
  return {
    type: Actions.FETCH_DATA_CART_ASYNC,
    data
  };
}

/**
 * Action remove product to cart
 * @param data
 */
export function removeProductToCart(data) {
  return {
    type: Actions.REMOVE_PRODUCT_TO_CART,
    data
  };
}

/**
 * Action remove all product to cart
 * @param data
 */
export function removeAllProductToCart() {
  return {
    type: Actions.REMOVE_ALL_PRODUCT_TO_CART,
  };
}

/**
 * Action send comment
 * @param data
 */
export function sendComment(data) {
  return {
    type: Actions.SEND_COMMENT,
    data
  };
}

/**
 * Action get comments
 * @param data
 */
export function getComments(data) {
  return {
    type: Actions.GET_COMMENTS,
    data
  }
}

/* Action get product detail
* @param data
*/
export function getProductDetail(data) {
  return {
    type: Actions.GET_PRODUCT_DETAIL,
    data
  };
}

/**
 * Action get likes list
 * @param data
 */
export function getLikesList(data) {
  return {
    type: Actions.GET_LIKES_LIST,
    data
  };
}

/**
 * Action delete comment
 * @param data
 */
export function deleteComment(data) {
  return {
    type: Actions.DELETE_COMMENT,
    data
  };
}