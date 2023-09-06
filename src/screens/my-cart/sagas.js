import { put, call, takeEvery, select, all, delay} from 'redux-saga/effects';
import * as Actions from './actionTypes';
import { REMOVE_ALL_PRODUCT_TO_CART } from 'src/screens/product/product-detail/actionTypes';
import { handleError, getErrorNameFromCode } from 'src/utils/error';
import { orderProduct } from './services';
import { showMessage } from 'react-native-flash-message';
import { languageSelector } from 'src/modules/common/selectors';
import languages from 'src/locales';

function* reflect(saga, item) {
  try {
    return {
      object: yield call(saga, item),
      status: 'fulfilled'
    }
  } catch (err) {
    return {
      e: err,
      status: 'rejected'
    }
  }
}

/**
 * Order product
 * @returns {IterableIterator<*>}
 */
function* orderProductSaga(item) {
  try {
    const language = yield select(languageSelector);
    const { order } = yield call(orderProduct, item, language)
    if (order) {
      return order
    }
  } catch (e) {
    yield call(handleError, e.msg ?? "");
    yield put({ type: Actions.ORDER_PRODUCT_FAIL, error: e });
  }
}

/**
 * Order product
 * @returns {IterableIterator<*>}
 */
function* orderAllProductSaga({ data }) {
  try {
    const language = yield select(languageSelector);
    const result = yield all(data.map(item => reflect(orderProductSaga, item)));
    
    if (result) {      
      yield delay(500); // for error message     
      yield call(showMessage, {
        message: languages[language].notifications.text_order_product_success,
        type: 'info',
      });
      yield put({
        type: Actions.ORDER_PRODUCT_SUCCESS,
        payload: result
      })
      yield put({
        type: REMOVE_ALL_PRODUCT_TO_CART
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.ORDER_PRODUCT_FAIL, error: e });
  }
}

export default function* myCartSaga() {
  yield takeEvery(Actions.ORDER_PRODUCT, orderAllProductSaga);
}
