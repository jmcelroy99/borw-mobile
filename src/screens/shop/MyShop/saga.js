import * as Actions from './actionTypes';
import { put, call, select, takeEvery } from 'redux-saga/effects';
import { handleError } from 'src/utils/error';
import { showMessage } from 'react-native-flash-message';
import languages from 'src/locales';
import {
  addNewProduct,
  getAllMyProducts,
  updateProduct,
  deleteProduct,
  cloneProduct,
} from './services';
import { languageSelector } from 'src/modules/common/selectors';

/**
* Do add new product
* @param data
* @returns {IterableIterator<*>}
*/
function* doAddNewProduct({ data }) {
  try {
    const language = yield select(languageSelector);
    const { product } = yield call(addNewProduct, data);
    if (product) {
      yield call(showMessage, {
        message: languages[language].notifications.text_add_product_success,
        type: 'info',
      });
      yield put({
        type: Actions.ADD_NEW_PRODUCT_SUCCESS,
      });
      yield put({
        type: Actions.GET_MY_PRODUCTS,
        data: {
          page: 0,
          limit: 8,
          shouldReload: true
        }
      })
    } else {
      yield put({
        type: Actions.ADD_NEW_PRODUCT_ERROR,
      });
    }
  } catch (e) {
    yield call(handleError, e)
    yield put({
      type: Actions.ADD_NEW_PRODUCT_ERROR,
    });
  }
}

/**
* Do add new product
* @param data
* @returns {IterableIterator<*>}
*/
function* doUpdateProduct({ data }) {
  try {
    const language = yield select(languageSelector);
    const newData = { ...data, language }
    const { success } = yield call(updateProduct, newData);
    if (success) {
      yield call(showMessage, {
        message: languages[language].notifications.text_update_product_success,
        type: 'info',
      });
      yield put({
        type: Actions.UPDATE_PRODUCT_SUCCESS,
      });
      yield put({
        type: Actions.GET_MY_PRODUCTS,
        data: {
          page: 0,
          limit: 8,
          shouldReload: true
        }
      })
    } else {
      yield put({
        type: Actions.UPDATE_PRODUCT_FAIL,
      });
    }
  } catch (e) {
    yield call(handleError, e)
    yield put({
      type: Actions.UPDATE_PRODUCT_FAIL,
    });
  }
}

/**
* Do get all my products
* @param data
* @returns {IterableIterator<*>}
*/
function* doGetAllMyProducts({ data }) {
  try {
    const { products, nextPage } = yield call(getAllMyProducts, data);
    if (products) {
      yield put({
        type: Actions.GET_MY_PRODUCTS_SUCCESS,
        payload: {
          products,
          nextPage
        }
      });
    } else {
      yield put({
        type: Actions.GET_MY_PRODUCTS_FAIL,
      });
    }
  } catch (e) {
    yield call(handleError, e)
    yield put({
      type: Actions.GET_MY_PRODUCTS_FAIL,
    });
  }
}

/**
* Do delete product
* @param data
* @returns {IterableIterator<*>}
*/
function* doDeleteProducts({ data }) {
  try {
    const language = yield select(languageSelector);
    const { success } = yield call(deleteProduct, data, { language });
    if (success) {
      yield call(showMessage, {
        message: languages[language].notifications.text_delete_product_success,
        type: 'info',
      });
      yield put({
        type: Actions.DELETE_PRODUCT_SUCCESS,
      });
      yield put({
        type: Actions.GET_MY_PRODUCTS,
        data: {
          page: 0,
          limit: 8,
          shouldReload: true
        }
      })
    } else {
      yield put({
        type: Actions.DELETE_PRODUCT_FAIL,
      });
    }
  } catch (e) {
    yield call(handleError, e)
    yield put({
      type: Actions.DELETE_PRODUCT_FAIL,
    });
  }
}

/**
* Do clone product
* @param data
* @returns {IterableIterator<*>}
*/
function* doCloneProducts({ data }) {
  try {
    const language = yield select(languageSelector);
    const { product, code } = yield call(cloneProduct, data);
    if (product) {
      yield call(showMessage, {
        message: languages[language].notifications.text_copy_product_success,
        type: 'info',
      });
      yield put({
        type: Actions.CLONE_PRODUCT_SUCCESS,
      });
      yield put({
        type: Actions.GET_MY_PRODUCTS,
        data: {
          page: 0,
          limit: 8,
          shouldReload: true
        }
      })
    } else {
      yield call(handleError, code)
      yield put({
        type: Actions.CLONE_PRODUCT_FAIL,
        payload: error
      });
    }
  } catch (e) {
    yield call(handleError, e)
  }
}

export default function* shopSaga() {
  yield takeEvery(Actions.ADD_NEW_PRODUCT, doAddNewProduct)
  yield takeEvery(Actions.UPDATE_PRODUCT, doUpdateProduct)
  yield takeEvery(Actions.GET_MY_PRODUCTS, doGetAllMyProducts)
  yield takeEvery(Actions.DELETE_PRODUCT, doDeleteProducts)
  yield takeEvery(Actions.CLONE_PRODUCT, doCloneProducts)
}