import { put, call, takeEvery, select } from 'redux-saga/effects';
import * as Actions from './actionTypes';
import { handleError } from 'src/utils/error';
import { getErrorNameFromCode } from 'src/utils/error';
import { languageSelector } from 'src/modules/common/selectors';
import languages from 'src/locales';
import { showMessage } from 'react-native-flash-message';
import globalConfig from 'src/utils/global';
import AsyncStorage from '@react-native-community/async-storage';
import {
  getGoogleAccount, disconnectGoogle, disconnectFacebook,
  getFacebookAccount, getEditUserInfo, updateUserProfile, verifyEmail
} from './services';

async function updateFacebookUserProfileAsync(data) {
  try {
    AsyncStorage.setItem('facebookAccount', JSON.stringify(data));
  } catch (error) {
    console.log('Has error while store token: ', error)
  }
}

async function updateGoogleUserProfileAsync(data) {
  try {
    AsyncStorage.setItem('googleAccount', JSON.stringify(data));
  } catch (error) {
    console.log('Has error while store token: ', error)
  }
}

/**
 * Connect google
 * @returns {IterableIterator<*>}
 */
function* connectGoogleSaga() {
  try {
    const data = yield call(getGoogleAccount)
    if (data) {
      yield put({
        type: Actions.CONNECT_GOOGLE_SUCCESS,
        payload: data
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.CONNECT_GOOGLE_FAIL, error: e });
  }
}

/**
 * Disconnect google
 * @returns {IterableIterator<*>}
 */
function* disconnectGoogleSaga() {
  try {
    const success = yield call(disconnectGoogle)
    if (success) {
      AsyncStorage.removeItem('googleAccount')
      yield put({
        type: Actions.DISCONNECT_GOOGLE_SUCCESS,
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.DISCONNECT_GOOGLE_FAIL, error: e });
  }
}

/**
 * Connect facebook
 * @returns {IterableIterator<*>}
 */
function* connectFacebookSaga() {
  try {
    const data = yield call(getFacebookAccount)
    if (data) {
      yield put({
        type: Actions.CONNECT_FACEBOOK_SUCCESS,
        payload: data
      })
    }
  } catch (e) {
    if (e != getErrorNameFromCode(7999)) {
      yield call(handleError, e);
    }
    yield put({ type: Actions.CONNECT_FACEBOOK_FAIL, error: e });
  }
}

/**
 * Disconnect facebook
 * @returns {IterableIterator<*>}
 */
function* disconnectFacebookSaga() {
  try {
    const success = yield call(disconnectFacebook)
    if (success) {
      AsyncStorage.removeItem('facebookAccount')
      yield put({
        type: Actions.DISCONNECT_FACEBOOK_SUCCESS,
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.DISCONNECT_FACEBOOK_FAIL, error: e });
  }
}

/**
 * Get edit user info
 * @returns {IterableIterator<*>}
 */
function* getEditUserInfoSaga() {
  try {
    const { user } = yield call(getEditUserInfo);
    if (user) {
      yield put({
        type: Actions.GET_EDIT_USER_INFO_SUCCESS,
        payload: user
      });
      globalConfig.setUser(user)
      yield call(AsyncStorage.setItem, 'user', JSON.stringify(user));
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.GET_EDIT_USER_INFO_FAIL, error: e });
  }
}

/**
 * Verify email
 * @returns {IterableIterator<*>}
 */
function* verifyEmailSaga() {
  try {
    const success = yield call(verifyEmail)
    if (success) {
      yield put({
        type: Actions.VERIFY_EMAIL_SUCCESS,
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.DISCONNECT_FACEBOOK_FAIL, error: e });
  }
}

/**
 * Update user profile
 * @returns {IterableIterator<*>}
 */
function* updateUserProfileSaga({ data }) {
  try {
    const accountFacebook = data.accountFacebook
    const accountGoogle = data.accountGoogle

    const language = yield select(languageSelector);
    data.language = language
    const { success } = yield call(updateUserProfile, data);

    if (success) {
      accountFacebook && updateFacebookUserProfileAsync(accountFacebook)
      accountGoogle && updateGoogleUserProfileAsync(accountGoogle)

      yield call(showMessage, {
        message: languages[language].notifications.text_update_profile_success,
        type: 'info',
      });
      yield put({
        type: Actions.UPDATE_USER_PROFILE_SUCCESS,
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.UPDATE_USER_PROFILE_FAIL, error: e });
  }
}

export default function* editProfileSaga() {
  yield takeEvery(Actions.CONNECT_GOOGLE, connectGoogleSaga);
  yield takeEvery(Actions.DISCONNECT_GOOGLE, disconnectGoogleSaga);
  yield takeEvery(Actions.CONNECT_FACEBOOK, connectFacebookSaga);
  yield takeEvery(Actions.DISCONNECT_FACEBOOK, disconnectFacebookSaga);
  yield takeEvery(Actions.GET_EDIT_USER_INFO, getEditUserInfoSaga);
  yield takeEvery(Actions.UPDATE_USER_PROFILE, updateUserProfileSaga);
  yield takeEvery(Actions.VERIFY_EMAIL, verifyEmailSaga);
}
