import * as Actions from './actionTypes';

/**
 * Action connect with google
 */
export function connectWithGoogle() {
  return {
    type: Actions.CONNECT_GOOGLE,
  };
}

/**
 * Action disconnect with google
 */
export function disconnectWithGoogle() {
  return {
    type: Actions.DISCONNECT_GOOGLE,
  };
}

/**
 * Action connect with facebook
 */
export function connectWithFacebook() {
  return {
    type: Actions.CONNECT_FACEBOOK,
  };
}

/**
 * Action disconnect with facebook
 */
export function disconnectWithFacebook() {
  return {
    type: Actions.DISCONNECT_FACEBOOK,
  };
}

/**
 * Action get user info
 * @param data
 */
export function getUserInfo() {
  return {
    type: Actions.GET_EDIT_USER_INFO,
  };
}

/**
 * Action update user profile
 * @param data
 */
export function updateUserInfo(data) {
  return {
    type: Actions.UPDATE_USER_PROFILE,
    data
  };
}

/**
 * Action update google account from async
 * @param data
 */
export function updateGoogleAccountFromAsync(data) {
  return {
    type: Actions.UPDATE_GOOGLE_ACCOUNT,
    data
  };
}

/**
 * Action update facebook account from async
 * @param data
 */
export function updateFacebookAccountFromAsync(data) {
  return {
    type: Actions.UPDATE_FACEBOOK_ACCOUNT,
    data
  };
}

/**
 * Action remove social account from redux store
 * @param data
 */
export function removeTemporatySocialAccount() {
  return {
    type: Actions.REMOVE_SOCIAL_ACCOUNT,
  };
}

/**
 * Action verify email
 * @param data
 */
export function verifyEmail(data) {
  return {
    type: Actions.VERIFY_EMAIL,
    data
  };
}