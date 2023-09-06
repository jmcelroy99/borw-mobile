import { put, call, takeEvery, select } from 'redux-saga/effects';
import * as Actions from './actionTypes';
import { handleError } from 'src/utils/error';
import { redeemCode, getListPoints, getUserInfo } from './services';
import { languageSelector } from 'src/modules/common/selectors';

/**
 * Get list points
 * @returns {IterableIterator<*>}
 */
function* getListPointsSaga({ data }) {
  try {
    const { points, count, nextPage } = yield call(getListPoints, data)
    if (points) {
      yield put({
        type: Actions.GET_LIST_POINTS_SUCCESS,
        payload: {
          points,
          count,
          nextPage
        }
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.GET_LIST_POINTS_FAIL, error: e });
  }
}

/**
 * Redeem code
 * @returns {IterableIterator<*>}
 */
function* redeemCodeSaga({ data }) {
  try {
    const language = yield select(languageSelector);
    const newData = {...data, language}
    const { success } = yield call(redeemCode, newData);
    if (success) {
      const data = {
        limit: 30,
        page: 0
      }
      yield put({
        type: Actions.GET_LIST_POINTS,
        data
      })
      yield put({
        type: Actions.REDEEM_CODE_SUCCESS,
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.REDEEM_CODE_FAIL, error: e });
  }
}

/**
 * Get user info
 * @returns {IterableIterator<*>}
 */
function* getUserInfoSaga() {
  try {
    const { user } = yield call(getUserInfo);
    if (user) {
      yield put({
        type: Actions.GET_USER_INFO_SUCCESS,
        payload: user
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.GET_USER_INFO_FAIL, error: e });
  }
}

export default function* myPointsSaga() {
  yield takeEvery(Actions.GET_LIST_POINTS, getListPointsSaga);
  yield takeEvery(Actions.REDEEM_CODE, redeemCodeSaga);
  yield takeEvery(Actions.GET_USER_INFO, getUserInfoSaga);
}
