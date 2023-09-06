import { put, call, takeEvery, take, select } from 'redux-saga/effects';
import * as Actions from './actionTypes';
import { UPDATE_NOTIFICATION_MESSAGE } from 'src/screens/messaging/actionTypes';
import {
  getListProduct,
  getListDesigners,
  getListVideos,
  likeItem,
  bookmarkItem,
} from './services';
import { eventChannel } from 'redux-saga';
import { handleError } from 'src/utils/error';
import firestore from '@react-native-firebase/firestore';
import { languageSelector } from 'src/modules/common/selectors';

/**
 * Get List Product
 * @returns {IterableIterator<*>}
 */
function* getListProductSaga({ data }) {
  try {
    const language = yield select(languageSelector);
    const newData = {...data, language}
    const { products, nextPage } = yield call(getListProduct, newData);
    if (products) {
      yield put({
        type: Actions.GET_LIST_PRODUCT_SUCCESS,
        payload: {
          products,
          nextPage
        }
      });
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.GET_LIST_PRODUCT_FAIL, error: e });
  }
}

/**
 * Get List Product
 * @returns {IterableIterator<*>}
 */
function* getListDesginersSaga({ data }) {
  try {
    const { products, nextPage } = yield call(getListDesigners, data);
    if (products) {
      yield put({
        type: Actions.GET_LIST_DESIGNERS_SUCCESS,
        payload: {
          products,
          nextPage
        }
      });
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.GET_LIST_DESIGNERS_FAIL, error: e });
  }
}

/**
 * Get List Product
 * @param {IterableIterator<*>}
 */
function* getListVideosSaga({ data }) {
  try {
    const { products, nextPage } = yield call(getListVideos, data);
    if (products) {
      yield put({
        type: Actions.GET_LIST_VIDEOS_SUCCESS,
        payload: {
          products,
          nextPage
        }
      });
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.GET_LIST_VIDEOS_FAIL, error: e });
  }
}
/**
 * Like item
 * @returns {IterableIterator<*>}
 */
function* likeItemSaga({ data }) {
  try {
    const { success } = yield call(likeItem, data);
    if (success) {
      yield put({
        type: Actions.LIKE_ITEM_SUCCESS,
      });
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.LIKE_ITEM_FAIL, error: e });
  }
}

/**
 * Like item
 * @returns {IterableIterator<*>}
 */
function* bookmarkItemSaga({ data }) {
  try {
    const { success } = yield call(bookmarkItem, data);
    if (success) {
      yield put({
        type: Actions.BOOKMARK_ITEM_SUCCESS,
      });
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.BOOKMARK_ITEM_FAIL, error: e });
  }
}

/**
 * Check messaging
 * @returns {IterableIterator<*>}
 */
function* checkMessagingSaga({ data }) {
  const updateChannel = checkMessaging(data);
  while (true) {
    const item = yield take(updateChannel);
    yield put({
      type: UPDATE_NOTIFICATION_MESSAGE,
      data: item.newMessage
    })
  }
}

/**
 * API check messaging notification
 * @param data
 * @returns {Promise<unknown>}
 */
function checkMessaging(data) {
  const listener = eventChannel(
    emit => {
      firestore()
        .collection('UserList')
        .doc(data.userUID)
        .onSnapshot(documentSnapshot => {
          if (documentSnapshot && documentSnapshot._data) {
            emit(documentSnapshot._data)
          }
        })
      return () => listener();
    }
  );
  return listener;
}

export default function* homeSaga() {
  yield takeEvery(Actions.GET_LIST_PRODUCT, getListProductSaga);
  yield takeEvery(Actions.GET_LIST_DESIGNERS, getListDesginersSaga);
  yield takeEvery(Actions.GET_LIST_VIDEOS, getListVideosSaga);
  yield takeEvery(Actions.LIKE_ITEM, likeItemSaga);
  yield takeEvery(Actions.CHECK_MESSAGING, checkMessagingSaga);
  yield takeEvery(Actions.BOOKMARK_ITEM, bookmarkItemSaga);
}
