import { put, call, takeEvery } from 'redux-saga/effects';
import * as Actions from './actionTypes';
import { handleError } from 'src/utils/error';
import { FETCH_SETTING } from 'src/screens/profile/settings/actionTypes';
import { getUserInfo, getProductOfUser, bookmarkProfile } from './services';

/**
 * Get user info
 * @returns {IterableIterator<*>}
 */
function* getUserInfoSaga({ data }) {
  try {
    const { user } = yield call(getUserInfo, data);
    if (user) {
      if (data.me) {
        yield put({
          type: FETCH_SETTING,
          data: user.settings
        })
      }
      yield put({
        type: Actions.GET_USER_PROFILE_INFO_SUCCESS,
        payload: user
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.GET_USER_PROFILE_INFO_FAIL, error: e });
  }
}

/**
 * Get user info
 * @returns {IterableIterator<*>}
 */
function* getProductsSaga({ data }) {
  try {
    const { products, nextPage } = yield call(getProductOfUser, data);
    if (products) {
      yield put({
        type: Actions.GET_PRODUCTS_SUCCESS,
        payload: {
          products,
          nextPage
        }
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.GET_PRODUCTS_FAIL, error: e });
  }
}

/**
 * Bookmark profile
 * @returns {IterableIterator<*>}
 */
function* bookmarkProfileSaga({ data }) {
  try {
    const { success } = yield call(bookmarkProfile, data);
    if (success) {
      yield put({
        type: Actions.BOOKMARK_PROFILE_SUCCESS,
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.BOOKMARK_PROFILE_FAIL, error: e });
  }
}

export default function* userProfileSaga() {
  yield takeEvery(Actions.GET_USER_PROFILE_INFO, getUserInfoSaga);
  yield takeEvery(Actions.GET_PRODUCTS, getProductsSaga);
  yield takeEvery(Actions.BOOKMARK_PROFILE, bookmarkProfileSaga);
}
