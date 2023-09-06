import * as Actions from './actionTypes';

/**
 * Action get list points
 * @param data
 */
export function getListPoints(data) {
  return {
    type: Actions.GET_LIST_POINTS,
    data
  };
}

/**
 * Action redeem code
 * @param data
 */
export function redeemCode(data) {
  return {
    type: Actions.REDEEM_CODE,
    data
  };
}

/**
 * Action get user info
 * @param data
 */
export function getUserInfo() {
  return {
    type: Actions.GET_USER_INFO,
  };
}