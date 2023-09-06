import { put, call, takeEvery } from 'redux-saga/effects';
import * as Actions from './actionTypes';
import { handleError } from 'src/utils/error';
import { getRatingsFromBuyers, getRatingsFromSellers } from './services';

/**
 * Get ratings from sellers
 * @returns {IterableIterator<*>}
 */
function* getRatingsFromSellersSaga({ data }) {
  try {
    const { ratings, nextPage, count, average } = yield call(getRatingsFromSellers, data)
    if (ratings) {
      yield put({
        type: Actions.GET_RATING_FROM_SELLERS_SUCCESS,
        payload: {
          ratings,
          nextPage,
          count,
          average
        }
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.GET_RATING_FROM_SELLERS_FAIL, error: e });
  }
}

/**
 * Get ratings from buyers
 * @returns {IterableIterator<*>}
 */
function* getRatingsFromBuyersSaga({ data }) {
  try {
    const { ratings, nextPage, count, average } = yield call(getRatingsFromBuyers, data)
    if (ratings) {
      yield put({
        type: Actions.GET_RATING_FROM_BUYERS_SUCCESS,
        payload: {
          ratings,
          nextPage,
          count,
          average
        }
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.GET_RATING_FROM_BUYERS_FAIL, error: e });
  }
}

export default function* myRatingsSagas() {
  yield takeEvery(Actions.GET_RATING_FROM_SELLERS, getRatingsFromSellersSaga);
  yield takeEvery(Actions.GET_RATING_FROM_BUYERS, getRatingsFromBuyersSaga);
}