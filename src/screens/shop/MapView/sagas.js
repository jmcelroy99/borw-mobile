import * as Actions from './actionTypes';
import { put, call, select, takeEvery } from 'redux-saga/effects';
import { handleError } from 'src/utils/error';
import { showMessage } from 'react-native-flash-message';
import languages from 'src/locales';
import {
  getLocationByAddress,
  getAddressByLocation
} from './services';
import { languageSelector } from 'src/modules/common/selectors';

/**
* Do add new product
* @param data
* @returns {IterableIterator<*>}
*/
function* doGetLocationByAddress({ address }) {
  try {
    const language = yield select(languageSelector);
    const { results } = yield call(getLocationByAddress, address);
    if (results && results.length > 0) {
      yield put({
        type: Actions.GET_LOCATION_SUCCESS,
        payload: results[0].geometry.location
      });
      const location = [results[0].geometry.location.lat, results[0].geometry.location.lng]
      yield put({
        type: Actions.GET_ADDRESS,
        location
      })
    } else {
      yield call(handleError, languages[language].error.text_address_invalid)
      yield put({
        type: Actions.GET_LOCATION_FAIL,
      });
    }
  } catch (e) {
    yield call(handleError, e)
    yield put({
      type: Actions.GET_LOCATION_FAIL,
    });
  }
}

/**
* Do add new product
* @param data
* @returns {IterableIterator<*>}
*/
function* doGetAddressByLocation({ location }) {
  try {
    const language = yield select(languageSelector);
    const { results } = yield call(getAddressByLocation, location);
    if (results && results.length > 0) {
      yield put({
        type: Actions.GET_ADDRESS_SUCCESS,
        payload: results[0].formatted_address
      });
    } else {
      yield call(handleError, languages[language].error.text_location_invalid)
      yield put({
        type: Actions.GET_ADDRESS_FAIL,
      });
    }
  } catch (e) {
    yield call(handleError, e)
    yield put({
      type: Actions.GET_ADDRESS_FAIL,
    });
  }
}

export default function* shopSaga() {
  yield takeEvery(Actions.GET_LOCATION, doGetLocationByAddress);
  yield takeEvery(Actions.GET_ADDRESS, doGetAddressByLocation);
}