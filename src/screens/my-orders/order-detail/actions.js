import * as Actions from './actionTypes';

/**
 * Action cancel order
 * @param data
 */
export function cancelOrder(data) {
  return {
    type: Actions.CANCEL_ORDER,
    data
  };
}

/**
 * Action update status order
 * @param data
 */
export function updateStatusOrder(data) {
  return {
    type: Actions.UPDATE_STATUS_ORDER,
    data
  };
}

/**
 * Action add order photos
 * @param data
 */
export function addOrderPhotos(data) {
  return {
    type: Actions.ADD_ORDER_PHOTO,
    data
  };
}

/**
 * Action get order photos
 * @param data
 */
export function getOrderPhotos(data) {
  return {
    type: Actions.GET_ORDER_PHOTOS,
    data
  };
}

/**
 * Action delete order photos
 * @param data
 */
export function deleteOrdePhoto(data) {
  return {
    type: Actions.DELETE_ORDER_PHOTOS,
    data
  };
}

/**
 * Action complete order
 * @param data
 */
export function completeOrder(data) {
  return {
    type: Actions.COMPLETE_ORDER,
    data
  };
}

/**
 * Action rating user
 * @param data
 */
export function ratingUser(data) {
  return {
    type: Actions.RATING_USER,
    data
  };
}

/**
 * Action archive order
 * @param data
 */
export function archiveOrder(data) {
  return {
    type: Actions.ARCHIVE_ORDER,
    data
  };
}

/**
 * Action purchase extra fee
 * @param data
 */
export function purchaseExtraFee(data) {
  return {
    type: Actions.PURCHASE_EXTRA_FEE,
    data
  };
}