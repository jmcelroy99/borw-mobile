import * as Actions from './actionTypes';

/**
 * Action get list orders
 * @param data
 */
export function getListOrders(data) {
  return {
    type: Actions.GET_LIST_ORDERS,
    data
  };
}

/**
 * Action get order detail
 * @param data
 */
export function getOrderDetail(data) {
  return {
    type: Actions.GET_ORDER_DETAIL,
    data
  };
}