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