import firebase from '@react-native-firebase/app';
import { GoogleSignin } from '@react-native-community/google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import { put, call, select, takeEvery } from 'redux-saga/effects';
import { showMessage } from 'react-native-flash-message';
import { handleError } from 'src/utils/error';
import globalConfig from '../../utils/global';
import languages from 'src/locales';
import * as Actions from './constants';
import { userIdSelector } from './selectors';
import { GET_USER_PROFILE_INFO } from 'src/screens/user-profile/actionTypes';
import { FETCH_SETTING } from 'src/screens/profile/settings/actionTypes';
import {
  loginWithEmail,
  loginWithMobile,
  registerWithEmail,
  loginWithGoogle,
  loginWithFacebook,
  logout,
  changeEmail,
  changePassword,
  forgotPassword,
  updateCustomer,
  getCustomer,
  getFilesDownload,
  requestPermission,
  signOutApp,
  updateToken,
  signInFirebase,
  loginWithApple, digitsLoginUser, digitsCreateUser, digitsLogoutUser, digitsCheckVerificationCode, digitsResetPassword, digitsCheckForgotVerificationCode
} from './service';

import {
  validatorSignIn,
  validatorRegister,
  validatorForgotPassword,
  validatorChangePassword,
} from './validator';
import { validatorAddress } from '../cart/validator';

import appleAuth, {
  AppleAuthRequestOperation,
  AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';

import { languageSelector, requiredLoginSelector } from '../common/selectors';

import NavigationService from 'src/utils/navigation';
import { rootSwitch, authStack, mainStack } from 'src/config/navigator';
import { shippingAddressInit } from './config';
import { signInWithOtp } from './actions';
import { setBadgeNumber } from 'src/utils/func';

async function getUserAndTokenTemp() {
  try {
    const user = await AsyncStorage.getItem('user_temp')
    globalConfig.setUser(user)
    const token = await AsyncStorage.getItem('token_temp')

    if (token == '' && token) {
      globalConfig.setToken(token)
    }
    AsyncStorage.setItem, 'user', JSON.stringify(user);
    AsyncStorage.setItem, 'token', token;
  } catch (error) {
    console.log('Has error while store token: ', error)
  }
}

async function signOut() {
  // Sign Out Firebase
  await firebase.auth().signOut();
  // Sign Out Google
  await GoogleSignin.revokeAccess();
  await GoogleSignin.signOut();

  // Sign Out Apple
  await appleAuth.performRequest({
    requestedOperation: AppleAuthRequestOperation.LOGOUT,
  });

  // Sign Out Facebook

  // Sign Out Digits
  await digitsLogoutUser();
}

/**
 * Do login success
 * @param token
 * @param user
 * @returns {IterableIterator<*>}
 */
function* doLoginSuccess(token, user) {
  const language = yield select(languageSelector);
  yield call(showMessage, {
    message: languages[language].notifications.text_login_success,
    type: 'info',
  });
  
  yield put({
    type: Actions.SIGN_IN_FIREBASE,
    data: user.firebaseToken
  })
  yield put({
    type: Actions.SIGN_IN_WITH_EMAIL_SUCCESS,
    payload: { token, user },
  });
  globalConfig.setToken(token)
  globalConfig.setUser(user)
  yield put({
    type: FETCH_SETTING,
    data: user.settings
  })
  yield call(AsyncStorage.setItem, 'token', token);
  yield call(AsyncStorage.setItem, 'user', JSON.stringify(user));
  yield call(NavigationService.navigate, rootSwitch.main);
}

/**
 * Sign In with Firebase
 * @param firebaseToken
 * @returns {IterableIterator<*>}
 */
function* signInFirebaseSaga({ data }) {
  try {
    const success = yield call(signInFirebase, data)
    if (success) {
      yield put({
        type: Actions.SIGN_IN_FIREBASE_SUCCESS
      })
    }
  } catch (error) {
    console.log("signInFirebaseSaga", error)
  }
}

/**
 * Sign In saga
 * @param username
 * @param password
 * @returns {IterableIterator<*>}
 */
function* signInWithEmailSaga({ username, password }) {
  try {
    const language = yield select(languageSelector);
    const { success, user } = yield call(loginWithEmail, { username, password, language });
    if (success) {
      if (user.verifiedPhoneNumber) {
        yield call(doLoginSuccess, user.token, user);
      } else {
        globalConfig.setToken(user.token)
        const error = languages[language].notifications.text_error_verify_phone_before_log_in
        yield put({
          type: Actions.SIGN_IN_WITH_EMAIL_ERROR,
          payload: {
            message: error,
          },
        });
        yield put({
          type: Actions.SIGN_UP_WITH_OTP,
          payload: {
            phoneNumber: user.phoneNumber,
            via: 'sms'
          },
        });
        yield call(handleError, error)
        yield call(NavigationService.navigate, authStack.verify_phone);
      }
    } else {
      yield call(handleError, e)
      yield put({
        type: Actions.SIGN_IN_WITH_EMAIL_ERROR,
        payload: {
          message: e.message,
        },
      });
    }
  } catch (e) {
    yield call(handleError, e)
    yield put({
      type: Actions.SIGN_IN_WITH_EMAIL_ERROR,
      payload: {
        message: e,
      },
    });
  }
}

/**
 * Sign In With OTP
 * @param data
 * @returns {Generator<<"PUT", PutEffectDescriptor<{payload: {message: *}, type: string}>>|<"CALL", CallEffectDescriptor>, void, ?>}
 */
function* signInWithOtpSaga({ payload }) {
  try {
    const { success, data } = yield call(digitsLoginUser, payload.data);
    if (success) {
      const { token, user } = data;
      yield call(doLoginSuccess, token, user);
    } else {
      yield call(handleError, new Error('Something wrong.'));
    }
  } catch (e) {
    yield put({
      type: Actions.SIGN_IN_WITH_OTP_ERROR,
      payload: {
        message: e.message,
      },
    });
  }
}

/**
 * Sign In mobile saga
 * @param tokenId
 * @returns {IterableIterator<*>}
 */
function* signInWithMobileSaga({ tokenId }) {
  try {
    const { token, user } = yield call(loginWithMobile, tokenId);
    yield call(doLoginSuccess, token, user);
  } catch (e) {
    yield call(handleError, e)
    yield put({
      type: Actions.SIGN_IN_WITH_MOBILE_ERROR,
    });
  }
}

/**
 * Sign up with email
 * @param payload
 * @returns {IterableIterator<*>}
 */
function* signUpWithEmailSaga({ payload }) {
  try {
    const { data } = payload;
    const language = yield select(languageSelector);
    const newData = {...data, language}
    const { user, error } = yield call(registerWithEmail, newData);
    if (user) {
      yield call(showMessage, {
        message: languages[language].notifications.text_create_user_success,
        type: 'info',
      });
      yield put({
        type: Actions.SIGN_UP_WITH_EMAIL_SUCCESS,
        payload: {
          user
        }
      });
      globalConfig.setToken(user.token);
      yield call(signUpWithOtplSaga, {});
      yield call(AsyncStorage.setItem, 'user_temp', JSON.stringify(user));
      yield call(AsyncStorage.setItem, 'token_temp', user.token);
    } else {
      yield call(handleError, error);
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({
      type: Actions.SIGN_UP_WITH_EMAIL_ERROR,
      payload: {
        message: e,
      },
    });
  }
}

/**
* Sign up with Otp
* @param payload
* @returns {IterableIterator<*>}
*/
function* signUpWithOtplSaga({ payload }) {
  try {
    const language = yield select(languageSelector);
    const { success } = yield call(digitsCreateUser, {...payload,language });
    if (success) {
      yield call(showMessage, {
        message: languages[language].notifications.text_sent_verification_code,
        type: 'info',
      });
      yield put({
        type: Actions.SIGN_UP_WITH_OTP_SUCCESS,
      })
    } else {
      yield call(handleError, new Error('Something wrong.'));
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({
      type: Actions.SIGN_UP_WITH_EMAIL_ERROR,
      payload: {
        message: e.message,
      },
    });
  }
}

/**
* Sign up with Otp
* @param payload
* @returns {IterableIterator<*>}
*/
function* checkVerificationCodeSaga({ payload }) {
  try {
    const language = yield select(languageSelector);
    const newData = {...payload, language}
    const { user } = yield call(digitsCheckVerificationCode, newData);
    if (user) {
      yield call(showMessage, {
        message: languages[language].notifications.text_verification_otp_success,
        type: 'info',
      });

      yield call(AsyncStorage.setItem, 'user', JSON.stringify(user));
      if (user.token) {
        yield call(AsyncStorage.setItem, 'token', user.token);
        globalConfig.setToken(user.token)
      }

      if (!globalConfig.getForgot()) {
        yield put({
          type: Actions.CHECK_OTP_SUCCESS,
        })
      } else {
        yield put({
          type: Actions.CHECK_OTP_SUCCESS,
          payload: {
            isForgot: true,
          }
        })
        globalConfig.setForgot(false)
      }
    } else {
      yield call(handleError, new Error('Something wrong.'));
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({
      type: Actions.CHECK_OTP_ERROR,
      payload: {
        message: e.message,
      },
    });
  }
}

/**
* Sign up with Otp
* @param payload
* @returns {IterableIterator<*>}
*/
function* checkForgotVerificationCodeSaga({ payload }) {
  try {
    const language = yield select(languageSelector);
    const { token } = yield call(digitsCheckForgotVerificationCode, payload);
    if (token) {
      yield call(showMessage, {
        message: languages[language].notifications.text_verification_otp_success,
        type: 'info',
      });
      globalConfig.setToken(token)
      if (!globalConfig.getForgot()) {
        yield put({
          type: Actions.CHECK_OTP_SUCCESS,
        })
      } else {
        yield put({
          type: Actions.CHECK_VERIFY_RESET_PASSWORD_SUCCESS,
          payload: {
            isForgot: true,
          }
        })
        globalConfig.setForgot(false)
      }
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({
      type: Actions.CHECK_OTP_ERROR,
      payload: {
        message: e.message,
      },
    });
  }
}

/**
 * Sign in with google
 * @param payload
 * @returns {IterableIterator<CallEffect | *>}
 */
function* signInWithGoogleSaga({ payload }) {
  try {
    const { idToken } = payload;
    const { token, user } = yield call(loginWithGoogle, { idToken });
    yield call(doLoginSuccess, token, user);
  } catch (e) {
    yield call(handleError, e);
    yield put({
      type: Actions.SIGN_IN_WITH_GOOGLE_ERROR,
    });
  }
}

/**
 * Sign in with Google
 * @param payload
 * @returns {IterableIterator<CallEffect | *>}
 */
function* signInWithFacebookSaga({ payload }) {
  try {
    const { data } = payload;
    const { token, user } = yield call(loginWithFacebook, data);
    yield call(doLoginSuccess, token, user);
  } catch (e) {
    yield call(handleError, e);
    yield put({
      type: Actions.SIGN_IN_WITH_FACEBOOK_ERROR,
    });
  }
}

/**
 * Sign in with Apple
 * @param payload
 * @returns {IterableIterator<CallEffect | *>}
 */
function* signInWithAppleSaga({ payload }) {
  try {
    const { token, user } = yield call(loginWithApple, payload);
    yield call(doLoginSuccess, token, user);
  } catch (e) {
    yield call(handleError, e);
    yield put({
      type: Actions.SIGN_IN_WITH_FACEBOOK_ERROR,
    });
  }
}

function* forgotPasswordSideEffect({ payload }) {
  try {
    globalConfig.setForgot(true)
    const language = yield select(languageSelector);
    const { success } = yield call(digitsResetPassword, payload);
    if (success) {
      yield call(showMessage, {
        message: languages[language].notifications.text_sent_verification_code,
        type: 'info',
      });
      yield put({
        type: Actions.SIGN_UP_WITH_OTP_SUCCESS,
        payload: {
          isForgot: true
        }
      });
    } else {
      yield put({
        type: Actions.SIGN_UP_WITH_OTP_ERROR,
      });
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({
      type: Actions.FORGOT_PASSWORD_ERROR,
      payload: {
        message: e.message,
      },
    });
  }
}

/**
 * Change Email Saga
 * @param payload
 * @returns {IterableIterator<*>}
 */
function* changeEmailSaga({ payload }) {
  try {
    yield call(changeEmail, payload);
    yield put({ type: Actions.CHANGE_EMAIL_SUCCESS });
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.CHANGE_EMAIL_ERROR });
  }
}

/**
 * Change Password Saga
 * @param payload
 * @returns {IterableIterator<*>}
 */
function* changePasswordSaga({ payload }) {
  try {
    const newPayload = {
      password: payload
    }
    const language = yield select(languageSelector);
    const { success } = yield call(changePassword, newPayload)
    if (success) {
      yield call(showMessage, {
        message: languages[language].notifications.text_change_password_success,
        type: 'info',
      });
      yield put({
        type: Actions.CHANGE_PASSWORD_SUCCESS,
      });
    } else {
      yield put({
        type: Actions.CHANGE_PASSWORD_ERROR,
      });
    }
  } catch (e) {
    yield put({
      type: Actions.CHANGE_PASSWORD_ERROR,
      payload: {
        message: e.message,
      },
    });
  }
}

/**
 * Sign out saga
 * @returns {IterableIterator<*>}
 */
function* signOutSaga() {
  try {
    const success = yield call(signOutApp);
    if (success) {
      globalConfig.clearData()
      setBadgeNumber(0)
      AsyncStorage.getAllKeys()
        .then(keys => AsyncStorage.multiRemove(keys));
      yield put({
        type: Actions.SIGN_OUT_SUCCESS,
      });
      yield call(NavigationService.navigate, authStack.login);
    }
  } catch (e) {
    console.log(e);
  }
}
/**
 * Get shipping address
 * @returns {IterableIterator<*>}
 */
function* getShippingAddressSaga({ payload }) {
  try {
    const customer = yield call(getCustomer, payload);
    yield put({
      type: Actions.GET_SHIPPING_ADDRESS_SUCCESS,
      payload: customer.shipping || shippingAddressInit,
    });
  } catch (e) {
    yield put({
      type: Actions.GET_SHIPPING_ADDRESS_ERROR,
      payload: shippingAddressInit,
    });
  }
}

/**
 * Update customer
 * @returns {IterableIterator<*>}
 */
function* updateCustomerSaga({ payload }) {
  try {
    const { data, cb } = payload;
    const userID = yield select(userIdSelector);
    yield call(updateCustomer, userID, data);
    yield put({
      type: Actions.UPDATE_CUSTOMER_SUCCESS,
    });
    yield call(showMessage, {
      message: 'Update success',
      type: 'success',
    });
    yield call(cb);
  } catch (e) {
    yield put({
      type: Actions.UPDATE_CUSTOMER_ERROR,
    });
    yield call(showMessage, {
      message: e.message,
      type: 'danger',
    });
  }
}

/**
 * get list file of customer
 * @returns {IterableIterator<*>}
 */
function* getFilesDownloadCustomer({ payload }) {
  try {
    const userID = yield select(userIdSelector);
    const files = yield call(getFilesDownload, userID);
    if (files && files.length) {
      yield put({
        type: Actions.GET_LIST_FILE_DOWNLOAD_SUCCESS,
        payload: files,
      });
    } else {
      yield put({
        type: Actions.GET_LIST_FILE_DOWNLOAD_ERROR,
      });
    }
  } catch (e) {
    yield put({
      type: Actions.GET_LIST_FILE_DOWNLOAD_ERROR,
    });
    yield call(showMessage, {
      message: e.message,
      type: 'danger',
    });
  }
}

/**
 * Request permission
 * @returns {IterableIterator<*>}
 */
function* requestPermissionSaga() {
  try {
    const enabled = yield call(requestPermission);
    if (enabled) {
      yield put({
        type: Actions.REQUEST_PERMISSION_SUCCESS,
      });
    } else {
      yield put({
        type: Actions.REQUEST_PERMISSION_FAIL,
      });
    }
  } catch (error) {
    yield put({
      type: Actions.REQUEST_PERMISSION_FAIL,
    });
    yield call(showMessage, {
      message: error,
      type: 'danger',
    });
  }
}

/**
 * Update token
 * @returns {IterableIterator<*>}
 */
function* updateTokenSaga({ data }) {
  try {
    const success = yield call(updateToken, data);
    if (success) {
      yield put({
        type: Actions.UPDATE_TOKEN_SUCCESS,
      });
    }
  } catch (error) {
    yield put({
      type: Actions.UPDATE_TOKEN_FAIL,
    });
    yield call(showMessage, {
      message: error,
      type: 'danger',
    });
  }
}

/**
 * Get FCM token
 * @returns {IterableIterator<*>}
 */
function* getFCMToken() {
  try {
    const enabled = yield call(requestPermission);
    if (enabled) {
      yield put({
        type: Actions.REQUEST_PERMISSION_SUCCESS,
      });
    } else {
      yield put({
        type: Actions.REQUEST_PERMISSION_FAIL,
      });
    }
  } catch (error) {
    yield put({
      type: Actions.REQUEST_PERMISSION_FAIL,
    });
    yield call(showMessage, {
      message: error,
      type: 'danger',
    });
  }
}

/**
 * Navigate to screen
 * @returns {IterableIterator<*>}
 */
function* navigateToScreenSaga({ data }) {
  try {
    yield call(NavigationService.navigate, mainStack.product);
  } catch (error) {
    yield put({
      type: Actions.NAVIGATE_TO_SCREEN_FAIL,
    });
    yield call(showMessage, {
      message: error,
      type: 'danger',
    });
  }
}

export default function* authSaga() {
  yield takeEvery(Actions.SIGN_IN_WITH_EMAIL, signInWithEmailSaga);
  yield takeEvery(Actions.SIGN_IN_WITH_MOBILE, signInWithMobileSaga);
  yield takeEvery(Actions.SIGN_UP_WITH_EMAIL, signUpWithEmailSaga);
  yield takeEvery(Actions.SIGN_IN_WITH_GOOGLE, signInWithGoogleSaga);
  yield takeEvery(Actions.SIGN_IN_WITH_FACEBOOK, signInWithFacebookSaga);
  yield takeEvery(Actions.SIGN_IN_WITH_APPLE, signInWithAppleSaga);
  yield takeEvery(Actions.SIGN_OUT, signOutSaga);
  yield takeEvery(Actions.CHANGE_EMAIL, changeEmailSaga);

  yield takeEvery(Actions.CHANGE_PASSWORD, changePasswordSaga);
  yield takeEvery(Actions.FORGOT_PASSWORD, forgotPasswordSideEffect);
  yield takeEvery(Actions.GET_SHIPPING_ADDRESS, getShippingAddressSaga);
  yield takeEvery(Actions.UPDATE_CUSTOMER, updateCustomerSaga);

  yield takeEvery(Actions.CHECK_OTP, checkVerificationCodeSaga);
  yield takeEvery(Actions.REQUEST_PERMISSION, requestPermissionSaga);
  yield takeEvery(Actions.UPDATE_TOKEN, updateTokenSaga);
  yield takeEvery(Actions.NAVIGATE_TO_SCREEN, navigateToScreenSaga)
  yield takeEvery(Actions.SIGN_IN_FIREBASE, signInFirebaseSaga)

  yield takeEvery(Actions.CHECK_VERIFY_RESET_PASSWORD, checkForgotVerificationCodeSaga)

  yield takeEvery(Actions.SIGN_IN_WITH_OTP, signInWithOtpSaga);
  yield takeEvery(Actions.SIGN_UP_WITH_OTP, signUpWithOtplSaga);
  yield takeEvery(Actions.GET_LIST_FILE_DOWNLOAD, getFilesDownloadCustomer);
}
