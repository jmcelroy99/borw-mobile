import * as Actions from './actionTypes';
import * as Action from 'src/modules/auth/constants';

const initState = {
  connectStripeSuccess: null,
  updateSettingSuccess: null,
  appSetting: null,
  loading: false,
};

export default function settingReducer(state = initState, action = {}) {
  switch (action.type) {
    case Actions.VERIFY_TOKEN_STRIPE:
      return {
        ...state,
        loading: true,
        error: null,
        connectStripeSuccess: false
      }
    case Actions.VERIFY_TOKEN_STRIPE_SUCCESS:
      return {
        ...state,
        loading: false,
        connectStripeSuccess: true
      }
    case Actions.VERIFY_TOKEN_STRIPE_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.DELETE_ACCOUNT:
      return {
        ...state,
        loading: true,
      }
    case Actions.DELETE_ACCOUNT_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case Actions.DELETE_ACCOUNT_FAIL:
      return {
        ...state,
        loading: false,
      }
    case Actions.UPDATE_SETTING:
      return {
        ...state,
        loading: true,
        updateSettingSuccess: false,
        appSetting: action.data
      }
    case Actions.UPDATE_SETTING_SUCCESS:
      return {
        ...state,
        loading: false,
        updateSettingSuccess: true,
      }
    case Actions.UPDATE_SETTING_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.FETCH_SETTING:
      return {
        ...state,
        appSetting: action.data
      }
    case Actions.FETCH_SETTING_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case Actions.FETCH_SETTING_FAIL:
      return {
        ...state,
        error: true,
        loading: false,
      }
    case Actions.DELETE_ACCOUNT:
      return {
        ...state,
        loading: true
      }
    case Actions.DELETE_ACCOUNT_FAIL:
      return {
        ...state,
        error: true,
        loading: false
      }
    case Action.SIGN_OUT:
      return {
        ...state,
        loading: true
      }
    case Action.SIGN_OUT_SUCCESS:
      return {
        ...state,
        loading: false
      }
    case Action.SIGN_OUT_FAIL:
      return {
        ...state,
        error: true,
        loading: false
      }
    default:
      return {
        ...state
      }
  }
}