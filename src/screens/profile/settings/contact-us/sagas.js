import { put, call, takeEvery, select } from 'redux-saga/effects';
import * as Actions from './actionTypes';
import { sendContact } from './services';
import { handleError } from 'src/utils/error';
import { languageSelector } from 'src/modules/common/selectors';
import NavigationService from 'src/utils/navigation';
import { homeTabs } from 'src/config/navigator';
import { showMessage } from 'react-native-flash-message';
import languages from 'src/locales';

/**
 * Send contact us
 * @returns {IterableIterator<*>}
 */
function* sendContactSaga({ data }) {
  try {
    const language = yield select(languageSelector);
    const newData = { ...data, language }
    const response = yield call(sendContact, newData);

    if (response.success) {
      yield call(showMessage, {
        message: languages[language].notifications.text_send_contact_success,
        type: 'info',
      });
      yield call(NavigationService.navigate, homeTabs.me);
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.SEND_CONTACT_FAIL, error: e });
  }
}

export default function* contactUsSaga() {
  yield takeEvery(Actions.SEND_CONTACT, sendContactSaga);
}