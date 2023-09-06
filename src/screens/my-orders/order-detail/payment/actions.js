
import * as Actions from './actionTypes';

/**
 * Action update status order
 * @param data
 */
export function updateStatusOrder(data) {
  return {
    type: Actions.UPDATE_STATUS_ORDER_FOR_PAYMENT,
    data
  };
}

/**
 * Action purchase order
 * @param data
 */
export function purchaseOrder(data) {
  return {
    type: Actions.PURCHASE_ORDER,
    data
  };
}