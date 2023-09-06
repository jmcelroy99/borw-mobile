import * as Actions from './actionTypes';

/**
 * Action send contact us
 * @param data
 */
export function sendContactUs(data) {
  return {
    type: Actions.SEND_CONTACT,
    data
  };
}