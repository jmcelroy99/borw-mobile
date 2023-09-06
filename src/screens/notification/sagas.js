import { put, call, takeEvery } from 'redux-saga/effects';
import * as Actions from './actionTypes';
import { handleError } from 'src/utils/error';
import { markAsRead, getNotifications, getUnreadCount } from './services';
import { setBadgeNumber } from 'src/utils/func';

/**
 * Get notifications
 * @returns {IterableIterator<*>}
 */
function* getNotificationSaga({ data }) {
  try {
    const { notifications, nextPage } = yield call(getNotifications, data)
    if (notifications) {
      yield put({
        type: Actions.GET_NOTIFICATIONS_SUCCESS,
        payload: {
          notifications,
          nextPage
        }
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.GET_NOTIFICATIONS_FAIL, error: e });
  }
}

/**
 * Mark as read
 * @returns {IterableIterator<*>}
 */
function* markAsReadSaga({ data }) {
  try {
    const { success } = yield call(markAsRead, data)
    if (success) {
      yield put({
        type: Actions.GET_UNREAD_COUNT,
      })
      yield put({
        type: Actions.MARK_AS_READ_SUCCESS,
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.MARK_AS_READ_FAIL, error: e });
  }
}

/**
 * Get unread count
 * @returns {IterableIterator<*>}
 */
function* getUnreadCountSaga() {
  try {
    const { count } = yield call(getUnreadCount)
    if (count) {
      setBadgeNumber(parseInt(count))
      yield put({
        type: Actions.GET_UNREAD_COUNT_SUCCESS,
        payload: {
          count
        }
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.GET_UNREAD_COUNT_FAIL, error: e });
  }
}

export default function* notificationSaga() {
  yield takeEvery(Actions.GET_NOTIFICATIONS, getNotificationSaga);
  yield takeEvery(Actions.MARK_AS_READ, markAsReadSaga);
  yield takeEvery(Actions.GET_UNREAD_COUNT, getUnreadCountSaga);
}