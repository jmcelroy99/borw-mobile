import * as Actions from './actionTypes';

const initState = {
  loading: false
};

export default function contactUsReducers(state = initState, action = {}) {
  switch (action.type) {
    case Actions.SEND_CONTACT:
      return {
        ...state,
        loading: true,
      }
    case Actions.SEND_CONTACT_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case Actions.SEND_CONTACT_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    default:
      return {
        ...state
      }
  }
}