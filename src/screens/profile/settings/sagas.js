import { put, call, takeEvery, select } from 'redux-saga/effects';
import * as Actions from './actionTypes';
import { checkStripeToken, updateSetting, deleteAccount } from './services';
import { handleError } from 'src/utils/error';
import globalConfig from 'src/utils/global';
import AsyncStorage from '@react-native-community/async-storage';
import { languageSelector } from 'src/modules/common/selectors';
import NavigationService from 'src/utils/navigation';
import { authStack } from 'src/config/navigator';

async function setUserConnected() {
  try {
    const jsonValue = await AsyncStorage.getItem('user')

    if (jsonValue != null) {
      let temp = JSON.parse(jsonValue)
      temp.isStripeConnected = true
      AsyncStorage.setItem('user', JSON.stringify(temp));
    }
  } catch (error) {
    console.log('Has error while store token: ', error)
  }
}

async function setUserSetting(data) {
  try {
    AsyncStorage.setItem('setting', JSON.stringify(data));
  } catch (error) {
    console.log('Has error while store token: ', error)
  }
}

/**
 * Connect Stripe to account
 * @returns {IterableIterator<*>}
 */
function* connectStripeSaga({ data }) {
  try {
    const { status } = yield call(checkStripeToken, data);
    if (status == 'ok') {
      const user = globalConfig.getUser();
      if (user) {
        user.isStripeConnected = true
        globalConfig.setUser(user)
      }
      setUserConnected()
      yield put({
        type: Actions.VERIFY_TOKEN_STRIPE_SUCCESS,
      });
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.VERIFY_TOKEN_STRIPE_FAIL, error: e });
  }
}

/*
 * Update setting
 * @returns {IterableIterator<*>}
 */
function* updateSettingSaga({ data }) {
  try {
    const success = yield call(updateSetting, data);
    if (success) {
      setUserSetting(data)
      yield put({
        type: Actions.UPDATE_SETTING_SUCCESS,
      });
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.UPDATE_SETTING_FAIL, error: e });
  }
}

/**
 * Delete account
 * @returns {IterableIterator<*>}
 */
function* deleteAccountSaga({ data }) {
  try {
    const language = yield select(languageSelector);
    const newData = { ...data, language }
    const response = yield call(deleteAccount, newData);
    if (response.success) {
      globalConfig.clearData()
      AsyncStorage.getAllKeys()
        .then(keys => AsyncStorage.multiRemove(keys));
      yield call(NavigationService.navigate, authStack.login);
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.DELETE_ACCOUNT_FAIL, error: e });
  }
}

export default function* settingSaga() {
  yield takeEvery(Actions.DELETE_ACCOUNT, deleteAccountSaga);
  yield takeEvery(Actions.VERIFY_TOKEN_STRIPE, connectStripeSaga);
  yield takeEvery(Actions.UPDATE_SETTING, updateSettingSaga);
}