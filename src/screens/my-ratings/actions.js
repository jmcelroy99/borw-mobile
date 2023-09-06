import * as Actions from './actionTypes';

/**
 * Action get ratings from sellers
 * @param data
 */
export function getRatingFromSellers(data) {
  return {
    type: Actions.GET_RATING_FROM_SELLERS,
    data
  };
}

/**
 * Action get ratings from buyers
 * @param data
 */
export function getRatingFromBuyers(data) {
  return {
    type: Actions.GET_RATING_FROM_BUYERS,
    data
  };
}