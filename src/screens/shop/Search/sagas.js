import { put, call, takeEvery } from 'redux-saga/effects';
import * as Actions from './actionTypes';

import {
  getListSearch,
  getListFilter
} from './services';

import { handleError } from 'src/utils/error';

/**
 * Get List Product
 * @returns {IterableIterator<*>}
 */
function* getListSearchSaga({ data }) {
  try {
    const { products } = yield call(getListSearch, data);
    if (products) {
      yield put({
        type: Actions.SEARCH_PRODUCT_SUCCESS,
        payload: {
          products,
        }
      });
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.SEARCH_PRODUCT_FAIL, error: e });
  }
}

/**
 * Get List Product
 * @returns {IterableIterator<*>}
 */
function* getListFilterSaga({ data }) {
  try {
    const { products } = yield call(getListFilter, data);
    if (products) {
      yield put({
        type: Actions.FILTER_PRODUCT_SUCCESS,
        payload: {
          products,
        }
      });
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.FILTER_PRODUCT_FAIL, error: e });
  }
}

export default function* homeSaga() {
  yield takeEvery(Actions.SEARCH_PRODUCT, getListSearchSaga);
  yield takeEvery(Actions.FILTER_PRODUCT, getListFilterSaga);
}
