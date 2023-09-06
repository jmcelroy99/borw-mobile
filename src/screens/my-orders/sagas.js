import { put, call, takeEvery, select } from 'redux-saga/effects';
import * as Actions from './actionTypes';
import { handleError } from 'src/utils/error';
import { getListOrders, getOrderDetail } from './services';

/**
 * Get list orders 
 * @returns {IterableIterator<*>}
 */
function* getListOrdersSaga({ data }) {
  try {
    const { orders, nextPage } = yield call(getListOrders, data)
    if (orders) {
      yield put({
        type: Actions.GET_LIST_ORDERS_SUCCESS,
        payload: {
          orders,
          nextPage
        }
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.GET_LIST_ORDERS_FAIL, error: e });
  }
}

/**
 * Get order detail
 * @returns {IterableIterator<*>}
 */
function* getOrderDetailSaga({ data }) {
  try {
    const { order } = yield call(getOrderDetail, data)
    if (order) {
      yield put({
        type: Actions.GET_ORDER_DETAIL_SUCCESS,
        payload: order
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.GET_ORDER_DETAIL_FAIL, error: e });
  }
}

export default function* myOrdersSaga() {
  yield takeEvery(Actions.GET_LIST_ORDERS, getListOrdersSaga);
  yield takeEvery(Actions.GET_ORDER_DETAIL, getOrderDetailSaga);
}
