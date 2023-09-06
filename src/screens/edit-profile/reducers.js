import * as Actions from './actionTypes';

const initState = {
  userInfo: null,
  updateProfileSuccess: null,
  accountGoogle: null,
  accountFacebook: null,
  verifyEmailSuccess: null,
  disconnectGoogleSuccess: null,
};

export default function editProfileReducers(state = initState, action = {}) {
  switch (action.type) {
    case Actions.GET_EDIT_USER_INFO:
      return {
        ...state,
        loading: true,
        userInfo: null,
      }
    case Actions.GET_EDIT_USER_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        userInfo: action.payload
      }
    case Actions.GET_EDIT_USER_INFO_FAIL:
      return {
        ...state,
        loading: false,
      }
    case Actions.CONNECT_GOOGLE:
      return {
        ...state,
      }
    case Actions.CONNECT_GOOGLE_SUCCESS:
      return {
        ...state,
        loading: false,
        accountGoogle: action.payload
      }
    case Actions.CONNECT_GOOGLE_FAIL:
      return {
        ...state,
        loading: false,
      }
    case Actions.DISCONNECT_GOOGLE:
      return {
        ...state,
      }
    case Actions.DISCONNECT_GOOGLE_SUCCESS:
      return {
        ...state,
        loading: false,
        accountGoogle: null
      }
    case Actions.DISCONNECT_GOOGLE_FAIL:
      return {
        ...state,
        loading: false,
      }
    case Actions.CONNECT_FACEBOOK:
      return {
        ...state,
      }
    case Actions.CONNECT_FACEBOOK_SUCCESS:
      return {
        ...state,
        loading: false,
        accountFacebook: action.payload
      }
    case Actions.CONNECT_FACEBOOK_FAIL:
      return {
        ...state,
        loading: false,
      }
    case Actions.UPDATE_USER_PROFILE:
      return {
        ...state,
        loading: true,
        updateProfileSuccess: null
      }
    case Actions.UPDATE_USER_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        updateProfileSuccess: true
      }
    case Actions.UPDATE_USER_PROFILE_FAIL:
      return {
        ...state,
        loading: false,
      }
    case Actions.DISCONNECT_FACEBOOK:
      return {
        ...state,
        loading: true,
      }
    case Actions.DISCONNECT_FACEBOOK_SUCCESS:
      return {
        ...state,
        loading: false,
        accountFacebook: null
      }
    case Actions.DISCONNECT_FACEBOOK_FAIL:
      return {
        ...state,
        loading: false,
      }
    case Actions.UPDATE_GOOGLE_ACCOUNT:
      return {
        ...state,
        accountGoogle: action.data
      }
    case Actions.UPDATE_FACEBOOK_ACCOUNT:
      return {
        ...state,
        accountFacebook: action.data
      }
    case Actions.REMOVE_SOCIAL_ACCOUNT: {
      return {
        ...state,
        accountFacebook: null,
        accountGoogle: null
      }
    }
    case Actions.VERIFY_EMAIL:
      return {
        ...state,
        loading: true,
        verifyEmailSuccess: null
      }
    case Actions.VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        verifyEmailSuccess: true
      }
    case Actions.VERIFY_EMAIL_FAIL: {
      return {
        ...state,
        verifyEmailSuccess: null,
        loading: false,
      }
    }
    default:
      return state;
  }
}