import * as Actions from './actionTypes';

/**
 * Action verify token stripe
 * @param data
 */
export function verifyTokenStripe(data) {
  return {
    type: Actions.VERIFY_TOKEN_STRIPE,
    data
  };
}

/**
 * Action delete account
 * @param data
 */
export function deleteAccount() {
  return {
    type: Actions.DELETE_ACCOUNT,
  }
}

/**
 * Action update setting
 * @param data
 */
export function updateSetting(data) {
  return {
    type: Actions.UPDATE_SETTING,
    data
  };
}

/**
 * Action fetch setting
 * @param data
 */
export function fetchSetting(data) {
  return {
    type: Actions.FETCH_SETTING,
    data
  };
}