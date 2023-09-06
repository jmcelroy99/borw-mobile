import { put, call, takeEvery, select } from 'redux-saga/effects';
import * as Actions from './actionTypes';
import { handleError } from 'src/utils/error';
import {
  cancelOrder, updateStatusOrder, addOrderPhotos, purchaseExtraFee,
  getOrderPhotos, deleteOrderPhoto, completeOrder, ratingUser, archiveOrder
} from './services';
import { showMessage } from 'react-native-flash-message';
import languages from 'src/locales';
import { languageSelector } from 'src/modules/common/selectors';
import NavigationService from 'src/utils/navigation';
import { mainStack } from 'src/config/navigator';

/**
 * Cancel order
 * @returns {IterableIterator<*>}
 */
function* cancelOrderSaga({ data }) {
  try {
    const language = yield select(languageSelector);
    const { success } = yield call(cancelOrder, data)
    if (success) {
      yield call(showMessage, {
        message: languages[language].notifications.text_cancel_order_success,
        type: 'info',
      });
      yield call(NavigationService.navigate, mainStack.my_orders);
      yield put({
        type: Actions.CANCEL_ORDER_SUCCESS,
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.CANCEL_ORDER_FAIL, error: e });
  }
}

/**
 * Update order
 * @returns {IterableIterator<*>}
 */
function* updateStatusOrderSaga({ data }) {
  try {
    const language = yield select(languageSelector);
    const { success } = yield call(updateStatusOrder, data)
    if (success) {
      yield call(showMessage, {
        message: languages[language].notifications.text_update_status_order_success,
        type: 'info',
      });
      yield put({
        type: Actions.UPDATE_STATUS_ORDER_SUCCESS,
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.UPDATE_STATUS_ORDER_FAIL, error: e });
  }
}

/**
 * Add order photos
 * @returns {IterableIterator<*>}
 */
function* addOrderPhotosSaga({ data }) {
  try {
    const language = yield select(languageSelector);
    const { orderPhotos } = yield call(addOrderPhotos, data)
    if (orderPhotos) {
      yield call(showMessage, {
        message: languages[language].notifications.text_add_order_photos_success,
        type: 'info',
      });
      if (data.step == 'sent_from_seller' || data.step == 'received_by_seller') {
        yield put({
          type: Actions.GET_ORDER_PHOTOS_SUCCESS,
          payload: {
            sellerPhotos: orderPhotos,
            step: data.step
          }
        })
      } else if (data.step == 'received_by_buyer' || data.step == 'returned_from_buyer') {
        yield put({
          type: Actions.GET_ORDER_PHOTOS_SUCCESS,
          payload: {
            buyerPhotos: orderPhotos,
            step: data.step
          }
        })
      }
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.ADD_ORDER_PHOTO_FAIL, error: e });
  }
}

/**
 * Get order photos
 * @returns {IterableIterator<*>}
 */
function* getOrderPhotosSaga({ data }) {
  try {
    const transaction = data.transaction
    const orderId = data.orderId
    const step = data.step
    const { orderPhotos } = yield call(getOrderPhotos, data)
    if (orderPhotos) {
      switch (step) {
        case 'sent_from_seller':
          yield put({
            type: Actions.GET_ORDER_PHOTOS_SUCCESS,
            payload: {
              sellerPhotos: orderPhotos,
              step: step
            }
          })
          const data = {
            orderId: orderId,
            step: "received_by_buyer",
            transaction: transaction
          }
          yield put({
            type: Actions.GET_ORDER_PHOTOS,
            data
          })
          break;
        case 'received_by_buyer':
          yield put({
            type: Actions.GET_ORDER_PHOTOS_SUCCESS,
            payload: {
              buyerPhotos: orderPhotos,
              step: step,
            }
          })
          if (transaction != 'donation') {
            const data = {
              orderId: orderId,
              step: "returned_from_buyer",
              transaction: transaction
            }
            yield put({
              type: Actions.GET_ORDER_PHOTOS,
              data,
            })
          }
          break;
        case 'returned_from_buyer':
          yield put({
            type: Actions.GET_ORDER_PHOTOS_SUCCESS,
            payload: {
              buyerPhotos: orderPhotos,
              step: step,
            }
          })
          if (transaction != 'donation') {
            const data = {
              orderId: orderId,
              step: "received_by_seller",
              transaction: transaction
            }
            yield put({
              type: Actions.GET_ORDER_PHOTOS,
              data
            })
          }
          break;
        case 'received_by_seller':
          yield put({
            type: Actions.GET_ORDER_PHOTOS_SUCCESS,
            payload: {
              sellerPhotos: orderPhotos,
              step: step,
              transaction: transaction
            }
          })
          break;
          default: return
      }
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.GET_ORDER_PHOTOS_FAIL, error: e });
  }
}

/**
 * Delete order photo
 * @returns {IterableIterator<*>}
 */
function* deleteOrderPhotoSaga({ data }) {
  try {
    const language = yield select(languageSelector);
    const { success } = yield call(deleteOrderPhoto, data)
    if (success) {
      yield call(showMessage, {
        message: languages[language].notifications.text_delete_order_photo_success,
        type: 'info',
      });
      yield put({
        type: Actions.DELETE_ORDER_PHOTOS_SUCCESS,
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.DELETE_ORDER_PHOTOS_FAIL, error: e });
  }
}

/**
 * Complete order
 * @returns {IterableIterator<*>}
 */
function* completeOrderSaga({ data }) {
  try {
    const language = yield select(languageSelector);
    const { success } = yield call(completeOrder, data)
    if (success) {
      yield call(showMessage, {
        message: languages[language].notifications.text_update_status_order_success,
        type: 'info',
      });
      yield put({
        type: Actions.COMPLETE_ORDER_SUCCESS,
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.COMPLETE_ORDER_FAIL, error: e });
  }
}

/**
 * Rating user
 * @returns {IterableIterator<*>}
 */
function* ratingUserSaga({ data }) {
  try {
    const language = yield select(languageSelector);
    const { success } = yield call(ratingUser, data)
    if (success) {
      yield call(showMessage, {
        message: languages[language].notifications.text_rating_partner_success,
        type: 'info',
      });
      yield put({
        type: Actions.RATING_USER_SUCCESS,
        payload: {
          value: data.value
        }
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.RATING_USER_FAIL, error: e });
  }
}

/**
 * Rating user
 * @returns {IterableIterator<*>}
 */
function* archiveOrderSaga({ data }) {
  try {
    const language = yield select(languageSelector);
    const { success } = yield call(archiveOrder, data)
    if (success) {
      yield call(showMessage, {
        message: languages[language].notifications.text_archive_order_success,
        type: 'info',
      });
      yield put({
        type: Actions.ARCHIVE_ORDER_SUCCESS,
        payload: {
          value: data.value
        }
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.ARCHIVE_ORDER_FAIL, error: e });
  }
}

/**
 * Purchase extra fee
 * @returns {IterableIterator<*>}
 */
function* purchaseExtraFeeSaga({ data }) {
  try {
    const language = yield select(languageSelector);
    const { success } = yield call(purchaseExtraFee, data)
    if (success) {
      yield call(showMessage, {
        message: languages[language].notifications.text_extra_fee_accepted,
        type: 'info',
      });
      yield put({
        type: Actions.PURCHASE_EXTRA_FEE_SUCCESS,
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.PURCHASE_EXTRA_FEE_FAIL, error: e });
  }
}

export default function* orderStatusSaga() {
  yield takeEvery(Actions.CANCEL_ORDER, cancelOrderSaga);
  yield takeEvery(Actions.UPDATE_STATUS_ORDER, updateStatusOrderSaga);
  yield takeEvery(Actions.ADD_ORDER_PHOTO, addOrderPhotosSaga);
  yield takeEvery(Actions.GET_ORDER_PHOTOS, getOrderPhotosSaga);
  yield takeEvery(Actions.DELETE_ORDER_PHOTOS, deleteOrderPhotoSaga);
  yield takeEvery(Actions.COMPLETE_ORDER, completeOrderSaga);
  yield takeEvery(Actions.RATING_USER, ratingUserSaga);
  yield takeEvery(Actions.ARCHIVE_ORDER, archiveOrderSaga);
  yield takeEvery(Actions.PURCHASE_EXTRA_FEE, purchaseExtraFeeSaga);
}
