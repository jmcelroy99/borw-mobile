import { put, call, takeEvery, select } from 'redux-saga/effects';
import * as Actions from './actionTypes';
import { handleError } from 'src/utils/error';
import AsyncStorage from '@react-native-community/async-storage';
import { showMessage } from 'react-native-flash-message';
import { languageSelector } from 'src/modules/common/selectors';
import { getProductDetail, getLikesList } from './services';
import languages from 'src/locales';
import { sendComment, getComments, deleteComment } from './services';

const addItemToCart = async (item) => {
  const myCart = await AsyncStorage.getItem('myCart')

  if (myCart) {
    const cart = JSON.parse(myCart)
    cart.push(item)
    await AsyncStorage.setItem('myCart', JSON.stringify(cart))
  } else {
    const newCart = []
    newCart.push(item)
    await AsyncStorage.setItem('myCart', JSON.stringify(newCart))
  }
}

const removeItemToCart = async (item) => {
  const myCart = await AsyncStorage.getItem('myCart')

  if (myCart) {
    const cart = JSON.parse(myCart)
    const index = cart.findIndex(product => product.id == item)
    if (index > -1) {
      cart.splice(index, 1)
      AsyncStorage.setItem('myCart', JSON.stringify(cart))
    }
  }
}

const removeAllItemToCart = async () => {
  const myCart = await AsyncStorage.getItem('myCart')

  if (myCart) {
    let cart = JSON.parse(myCart)
    cart = []
    AsyncStorage.setItem('myCart', JSON.stringify(cart))
  }
}

/**
 * Add item to cart
 * @returns {IterableIterator<*>}
 */
function* addItemToCartSaga({ data }) {
  try {
    const language = yield select(languageSelector);
    yield call(addItemToCart, data)
    yield call(showMessage, {
      message: languages[language].notifications.text_add_product_to_cart_success,
      type: 'info',
    });
    yield put({
      type: Actions.ADD_ITEM_TO_CART_SUCCESS,
      payload: data
    })
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.ADD_ITEM_TO_CART_FAIL, error: e });
  }
}

/**
 * Remove item from cart
 * @returns {IterableIterator<*>}
 */
function* removeItemToCartSaga({ data }) {
  try {
    yield call(removeItemToCart, data)
    yield put({
      type: Actions.REMOVE_PRODUCT_TO_CART_SUCCESS,
      payload: data
    })
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.REMOVE_PRODUCT_TO_CART_FAIL, error: e });
  }
}

/**
 * Remove all item from cart
 * @returns {IterableIterator<*>}
 */
function* removeAllItemToCartSaga({ data }) {
  try {
    yield call(removeAllItemToCart)
    yield put({
      type: Actions.REMOVE_ALL_PRODUCT_TO_CART_SUCCESS,
    })
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.REMOVE_ALL_PRODUCT_TO_CART_FAIL, error: e });
  }
}

/**
 * Get cart from async
 * @returns {IterableIterator<*>}
 */
function* fetchCartFromAsync({ data }) {
  try {
    yield put({
      type: Actions.FETCH_DATA_CART_ASYNC_SUCCESS,
      payload: data
    })
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.FETCH_DATA_CART_ASYNC_FAIL, error: e });
  }
}

/**
 * Send comment
 * @returns {IterableIterator<*>}
 */
function* sendCommentSaga({ data }) {
  try {
    const language = yield select(languageSelector);
    const { success } = yield call(sendComment, data)
    if (success) {
      yield call(showMessage, {
        message: languages[language].notifications.text_add_comment_success,
        type: 'info',
      });
      yield put({
        type: Actions.SEND_COMMENT_SUCCESS,
        payload: data.productId
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.SEND_COMMENT_FAIL, error: e });
  }
}

/**
 * Get comments
 * @returns {IterableIterator<*>}
 */
function* getCommentsSaga({ data }) {
  try {
    const { comments } = yield call(getComments, data)
    if (comments) {
      yield put({
        type: Actions.GET_COMMENTS_SUCCESS,
        payload: comments
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.GET_COMMENTS_FAIL, error: e });
  }
}

/** Get product detail
 * @returns {IterableIterator<*>}
 */
function* getProductDetailSaga({ data }) {
  try {
    const { product } = yield call(getProductDetail, data)
    yield put({
      type: Actions.GET_PRODUCT_DETAIL_SUCCESS,
      payload: product
    })
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.GET_PRODUCT_DETAIL_FAIL, error: e });
  }
}

/**
 * Get likes list
 * @returns {IterableIterator<*>}
 */
function* getLikesListSaga({ data }) {
  try {
    const { likes } = yield call(getLikesList, data)
    if (likes) {
      yield put({
        type: Actions.GET_LIKES_LIST_SUCCESS,
        payload: likes
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.GET_LIKES_LIST_FAIL, error: e });
  }
}

/**
 * Delete comment
 * @returns {IterableIterator<*>}
 */
function* deleteCommentSaga({ data }) {
  try {
    const language = yield select(languageSelector);
    const { success } = yield call(deleteComment, data.id)
    if (success) {
      yield call(showMessage, {
        message: languages[language].notifications.text_delete_comment_success,
        type: 'info',
      });
      yield put({
        type: Actions.DELETE_COMMENT_SUCCESS,
        payload: data.productId
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.DELETE_COMMENT_FAIL, error: e });
  }
}

export default function* productDetailSaga() {
  yield takeEvery(Actions.ADD_ITEM_TO_CART, addItemToCartSaga);
  yield takeEvery(Actions.FETCH_DATA_CART_ASYNC, fetchCartFromAsync);
  yield takeEvery(Actions.REMOVE_PRODUCT_TO_CART, removeItemToCartSaga)
  yield takeEvery(Actions.REMOVE_ALL_PRODUCT_TO_CART, removeAllItemToCartSaga)
  yield takeEvery(Actions.SEND_COMMENT, sendCommentSaga)
  yield takeEvery(Actions.GET_COMMENTS, getCommentsSaga)
  yield takeEvery(Actions.GET_PRODUCT_DETAIL, getProductDetailSaga)
  yield takeEvery(Actions.GET_LIKES_LIST, getLikesListSaga)
  yield takeEvery(Actions.DELETE_COMMENT, deleteCommentSaga)
}
