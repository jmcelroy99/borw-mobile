import * as Actions from './actionTypes';

/**
 * Action add new product
 * @param data
 */
export function addNewProduct(data) {
  return {
    type: Actions.ADD_NEW_PRODUCT,
    data
  };
}

/**
 * Action update product
 * @param data
 */
export function updateProduct(data) {
  return {
    type: Actions.UPDATE_PRODUCT,
    data
  };
}

/**
 * Action update product
 * @param data
 */
export function getMyProducts(data) {
  return {
    type: Actions.GET_MY_PRODUCTS,
    data
  };
}

/**
 * Action delete product
 * @param data
 */
export function deleteProduct(data) {
  return {
    type: Actions.DELETE_PRODUCT,
    data
  };
}

/**
 * Action clone product
 * @param data
 */
export function cloneProduct(data) {
  return {
    type: Actions.CLONE_PRODUCT,
    data
  };
}