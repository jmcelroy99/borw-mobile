import { put, call, takeEvery, select, all } from 'redux-saga/effects';
import * as Actions from './actionTypes';
import { handleError } from 'src/utils/error';
import { orderProduct, getBookmarkedProducts, getBookmarkedProfiles } from './services';
import { showMessage } from 'react-native-flash-message';

/**
 * Get bookmark profiles
 * @returns {IterableIterator<*>}
 */
function* getBookmarkedProfilesSaga({ data }) {
  try {
    const { bookmarks, nextPage } = yield call(getBookmarkedProfiles, data)
    if (bookmarks) {
      yield put({
        type: Actions.GET_BOOKMARKED_PROFILES_SUCCESS,
        payload: {
          bookmarks,
          nextPage
        }
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.GET_BOOKMARKED_PROFILES_FAIL, error: e });
  }
}

/**
 * Get bookmark products
 * @returns {IterableIterator<*>}
 */
function* getBookmarkedProductsSaga({ data }) {
  try {
    const { bookmarks, nextPage } = yield call(getBookmarkedProducts, data)
    if (bookmarks) {
      yield put({
        type: Actions.GET_BOOKMARKED_PRODUCTS_SUCCESS,
        payload: {
          bookmarks,
          nextPage
        }
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.GET_BOOKMARKED_PRODUCTS_FAIL, error: e });
  }
}

export default function* myBookmarkSaga() {
  yield takeEvery(Actions.GET_BOOKMARKED_PRODUCTS, getBookmarkedProductsSaga);
  yield takeEvery(Actions.GET_BOOKMARKED_PROFILES, getBookmarkedProfilesSaga);
}
