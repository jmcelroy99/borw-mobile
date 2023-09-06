import { fromJS } from 'immutable';

import { REHYDRATE } from 'redux-persist/lib/constants';
import * as Actions from './constants';
import { notificationMessage } from 'src/utils/error';
import { shippingAddressInit, errorInit as initError } from './config';

const initState = fromJS({
  isLogin: false,
  pending: false,
  pendingMobile: false,
  pendingGoogle: false,
  pendingFacebook: false,
  pendingApple: false,
  notificationBadge: {
    shouldUpdate: false
  },
  user: {},
  token: '',
  shippingAddress: shippingAddressInit,
  loginError: initError,
  signUpError: initError,
  changeMailError: {
    message: '',
    errors: {},
  },
  changePasswordError: initError,
  forgotPasswordError: initError,
  updateShippingAddressError: initError,
  pendingChangeEmail: false,
  pendingChangePassword: false,
  pendingForgotPassword: false,
  pendingUpdateCustomer: false,
  requestPermissionSuccess: false,
  files: {
    data: [],
    loading: true,
    error: true,
    refreshing: false,
  },
});

export default function authReducer(state = initState, action = {}) {
  switch (action.type) {

    case Actions.SIGN_IN_WITH_EMAIL:
      return state.set('pending', true).set('loginError', fromJS(initError));

    case Actions.GET_EDIT_USER_INFO_SUCCESS: {
      return state
        .set('user', fromJS(action.payload))
    }

    case Actions.SIGN_IN_WITH_EMAIL_SUCCESS:
      return state
        .set('pending', false)
        .set('user', fromJS(action.payload.user))
        .set('isLogin', true)
        .set('token', fromJS(action.payload.token));

    case Actions.SIGN_IN_WITH_EMAIL_ERROR:
      const errorSignIn = notificationMessage(action.payload);
      return state.set('pending', false).set('loginError', fromJS(errorSignIn));

    case Actions.REQUEST_PERMISSION:
      return state;

    case Actions.REQUEST_PERMISSION_SUCCESS:
      return state.set('requestPermissionSuccess', true);

    case Actions.REQUEST_PERMISSION_FAIL:
      return state;

    case Actions.UPDATE_NOTIFICATION_BADGE:
      const badge = {
        shouldUpdate: action.data.shouldUpdate
      }
      return state.set('notificationBadge', badge);

    case Actions.UPDATE_NOTIFICATION_BADGE_SUCCESS:
      return state

    case Actions.UPDATE_NOTIFICATION_BADGE_FAI:
      return state;

    case Actions.SIGN_UP_WITH_OTP:
      return state.set('pending', true);
    case Actions.SIGN_UP_WITH_OTP_SUCCESS:
      if (action.payload) {
        return state.set('pending', false).set('getOTPSuccess', true).set('isForgot', action.payload.isForgot);
      } else {
        return state.set('pending', false).set('getOTPSuccess', true);
      }
    case Actions.SIGN_UP_WITH_OTP_ERROR:
      return state.set('pending', false).set('signUpError', fromJS(initError));

    case Actions.CHECK_OTP:
      return state.set('pending', true);
    case Actions.CHECK_OTP_SUCCESS:
      if (action.payload && action.payload.isForgot) {
        return state.set('pending', false).set('checkOTPSuccess', true).set('isForgot', action.payload.isForgot);
      } else {
        return state.set('pending', false).set('checkOTPSuccess', true);
      }
    case Actions.CHECK_OTP_ERROR:
      return state.set('pending', false);

    case Actions.CHECK_VERIFY_RESET_PASSWORD:
      return state.set('pending', true);
    case Actions.CHECK_VERIFY_RESET_PASSWORD_SUCCESS:
      return state.set('pending', false).set('checkOTPForgotSuccess', true).set('isForgot', true);
    case Actions.CHECK_VERIFY_RESET_PASSWORD_ERROR:
      return state.set('pending', false);

    case Actions.SIGN_UP_WITH_EMAIL:
      return state.set('pending', true).set('signUpError', fromJS(initError));
    case Actions.SIGN_UP_WITH_EMAIL_SUCCESS:
      const data = {
        ...action.payload,
      };
      return state.set('pending', false).set('userCreated', fromJS(data));
    case Actions.SIGN_UP_WITH_EMAIL_ERROR:
      return state
        .set('pending', false)
        .set('signUpError', action.payload.message);

    case Actions.SIGN_OUT_SUCCESS:
      return initState;
    case Actions.CHANGE_EMAIL:
      return state.set('pendingChangeEmail', true).set('changeMailError', {
        message: '',
        errors: {},
      });
    case Actions.CHANGE_EMAIL_SUCCESS:
      return state.set('pendingChangeEmail', false);

    case Actions.CHANGE_PASSWORD:
      return state
        .set('pendingChangePassword', true)
        .set('changePasswordError', fromJS(initError));
    case Actions.CHANGE_PASSWORD_SUCCESS:
      return state.set('pendingChangePassword', false).set('changePasswordSuccess', true);
    case Actions.CHANGE_PASSWORD_ERROR:
      // const errorChangePass = notificationMessage(action.payload);
      return state
        .set('pendingChangePassword', false);
    // .set('changePasswordError', fromJS(errorChangePass));

    case Actions.CHANGE_EMAIL_ERROR:
      return state.set('pendingChangePassword', false);

    case Actions.FORGOT_PASSWORD:
      return state
        .set('pendingForgotPassword', true)
        .set('forgotPasswordError', fromJS(initError));

    case Actions.FORGOT_PASSWORD_SUCCESS:
      return state.set('pendingForgotPassword', false);
    case Actions.FORGOT_PASSWORD_ERROR:
      const errorForgotPass = notificationMessage(action.payload);
      return state
        .set('pendingForgotPassword', false)
        .set('forgotPasswordError', fromJS(errorForgotPass));

    case Actions.GET_SHIPPING_ADDRESS_SUCCESS:
    case Actions.GET_SHIPPING_ADDRESS_ERROR:
      return state.set('shippingAddress', fromJS(action.payload));
    case Actions.UPDATE_CUSTOMER:
      return state.set('pendingUpdateCustomer', true);

    case Actions.UPDATE_CUSTOMER_SUCCESS:
    case Actions.UPDATE_CUSTOMER_ERROR:
      return state.set('pendingUpdateCustomer', false);
    case Actions.UPDATE_USER_SUCCESS:
      const userOld = state.get('user');
      const user = {
        ...userOld.toJS(),
        ...action.payload,
      };
      return state.set('user', fromJS(user));
    case Actions.UPDATE_SHIPPING_ADDRESS_SUCCESS:
      return state.set('shippingAddress', fromJS(action.payload));
    case REHYDRATE:
      if (action.payload && action.payload.auth) {
        // Restore only user and isLogin state
        const { auth } = action.payload;
        return initState.merge(
          fromJS({
            user: auth.get('user'),
            token: auth.get('token'),
            isLogin: auth.get('isLogin'),
            shippingAddress:
              auth.get('shippingAddress') || fromJS(shippingAddressInit),
          }),
        );
      } else {
        return state;
      }
    case 'UPDATE_DEMO_CONFIG_SUCCESS':
      return initState;
    case Actions.GET_LIST_FILE_DOWNLOAD:
      return state.set('files', {
        data: [],
        loading: true,
        error: true,
        refreshing: false,
      });
    case Actions.GET_LIST_FILE_DOWNLOAD_SUCCESS:
      return state.set('files', {
        data: fromJS(action.payload),
        loading: false,
        error: false,
        refreshing: false,
      });
    case Actions.GET_LIST_FILE_DOWNLOAD_ERROR:
      return state.set('files', {
        data: [],
        loading: false,
        error: false,
        refreshing: false,
      });
    default:
      return state;
  }
}
