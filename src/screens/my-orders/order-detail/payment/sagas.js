import { put, call, takeEvery } from 'redux-saga/effects';
import * as Actions from './actionTypes';
import { handleError } from 'src/utils/error';
import { updateStatusOrder, purchaseOrder } from '../services';

/**
 * Update order
 * @returns {IterableIterator<*>}
 */
function* updateStatusOrderSaga({ data }) {
  try {
    const { success } = yield call(updateStatusOrder, data)
    if (success) {
      yield put({
        type: Actions.UPDATE_STATUS_ORDER_FOR_PAYMENT_SUCCESS,
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.UPDATE_STATUS_ORDER_FOR_PAYMENT_FAIL, error: e });
  }
}

/**
 * Purchase order
 * @returns {IterableIterator<*>}
 */
function* purchaseOrderSaga({ data }) {
  try {
    const { success } = yield call(purchaseOrder, data)
    if (success) {
      yield put({
        type: Actions.PURCHASE_ORDER_SUCCESS,
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.PURCHASE_ORDER_FAIL, error: e });
  }
}

export default function* paymentSaga() {
  yield takeEvery(Actions.UPDATE_STATUS_ORDER_FOR_PAYMENT, updateStatusOrderSaga);
  yield takeEvery(Actions.PURCHASE_ORDER, purchaseOrderSaga);
}