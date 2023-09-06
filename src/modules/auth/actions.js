import * as Actions from './constants';

/**
 * Action login
 * @param username
 * @param password
 * @returns {{type: string, username: *, password: *}}
 */
export function signInWithEmail({username, password}) {
  return {
    type: Actions.SIGN_IN_WITH_EMAIL,
    username,
    password,
  };
}

/**
 * Action register
 * @param data
 * @returns {{type: string, payload: *}}
 */
export function signUpWithEmail(data) {
  return {
    type: Actions.SIGN_UP_WITH_EMAIL,
    payload: {
      data,
    },
  };
}

/**
 * Change password by phone number
 * @param {*} phoneNumber 
 */
export function forgotPassword(phoneNumber) {
  return {
    type: Actions.FORGOT_PASSWORD,
    payload: {
      phoneNumber,
      via: 'sms'
    }
  };
}

/**
 * Check verifiication code for reset password
 * @param {*} phoneNumber 
 */
export function checkVerifyCodeResetPass(data) {
  return {
    type: Actions.CHECK_VERIFY_RESET_PASSWORD,
    payload: {
      phoneNumber: data.phoneNumber,
      verificationCode: data.otp
    }
  };
}

export function checkAuth() {
  return {
    type: Actions.CHECK_AUTH,
  };
}

/**
 * Change email action
 * @param u_password
 * @param u_email
 * @returns {{type: string, payload: {password: *, email: *}}}
 */
export function changeEmail({u_password, u_email}) {
  return {
    type: Actions.CHANGE_EMAIL,
    payload: {
      u_password,
      u_email,
    },
  };
}

/**
 * Sign in Firebase with firebaseToken
 */
export function signInFirebase(data) {
  return {
    type: Actions.SIGN_IN_FIREBASE,
    data
  };
}

/**
 * Update customer
 * @param data
 * @returns {{type: string, payload: {data: *, cb: *}}}
 */
export function updateCustomer(data, cb = () => {}) {
  return {
    type: Actions.UPDATE_CUSTOMER,
    payload: {
      data,
      cb,
    },
  };
}

/**
 * Update user
 * @param data
 * @returns {{type: string, payload: *}}
 */
export function updateShippingAddressSuccess(data) {
  return {
    type: Actions.UPDATE_SHIPPING_ADDRESS_SUCCESS,
    payload: data,
  };
}

/**
 * Update user
 * @param data
 * @returns {{type: string, payload: *}}
 */
export function updateUserSuccess(data) {
  return {
    type: Actions.UPDATE_USER_SUCCESS,
    payload: data,
  };
}

/**
 * Change password action
 * @param data
 * @returns {{type: string, payload: object}}
 */
export function changePassword(data) {
  return {
    type: Actions.CHANGE_PASSWORD,
    payload: data,
  };
}

/**
 * Action sign out
 * @returns {{type: string}}
 */
export function signOut() {
  return {
    type: Actions.SIGN_OUT,
  };
}

/**
 * SignIn with Apple
 * @param identityToken
 * @param user
 * @returns {{payload: {identityToken: *, user: *}, type: string}}
 */
export function signInWithApple(payload) {
  return {
    type: Actions.SIGN_IN_WITH_APPLE,
    payload,
  };
}

/**
 * Sign Up with OTP
 * @param data
 * @returns {{type: string, payload: *}}
 */
export function signUpWithOtp(data) {
  return {
    type: Actions.SIGN_UP_WITH_OTP,
    payload: {
      phoneNumber: data,
      via: 'sms' // optional
    },
  };
}

/**
 * Sign In with OTP
 * @param data
 * @returns {{payload: {identityToken: *, user: *}, type: string}}
 */
export function signInWithOtp(data) {
  return {
    type: Actions.SIGN_IN_WITH_OTP,
    payload: {
      data,
    },
  };
}


/**
 * Get List file download of user
 * @param data
 * @returns {{type: string, payload: *}}
 */
export function getFilesDonwload() {
  return {
    type: Actions.GET_LIST_FILE_DOWNLOAD,
    payload: {},
  };
}

/**
 * Check OTP validation
 * @param data
 * @returns {{type: string, payload: *}}
 */
export function checkOTP(data) {
  return {
    type: Actions.CHECK_OTP,
    payload: {
      verificationCode: data
    },
  };
}

/**
 * Request permission
 * @returns {{type: string, payload: *}}
 */
export function requestPermission() {
  return {
    type: Actions.REQUEST_PERMISSION,
  };
}

/**
 * Update notification badge
 * @returns {{type: string, payload: *}}
 */
export function updateNotificationBadge(data) {
  return {
    type: Actions.UPDATE_NOTIFICATION_BADGE,
    data
  };
}

/**
 * Update device token
 * @returns {{type: string, payload: *}}
 */
export function updateDeviceToken(data) {
  return {
    type: Actions.UPDATE_TOKEN,
    data
  };
}

/**
 * Navigate to screen
 * @returns {{type: string, payload: *}}
 */
export function navigateToScreen(data) {
  return {
    type: Actions.NAVIGATE_TO_SCREEN,
    data
  };
}
