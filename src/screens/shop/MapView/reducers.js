import * as Actions from './actionTypes';

const initState = {
  location: [],
  formattedAddress: null
};

export default function locationReducer(state = initState, action = {}) {
  switch (action.type) {
    case Actions.GET_LOCATION:
      return {
        ...state,
        loading: true,
        location: null,
      }
    case Actions.GET_LOCATION_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload
      }
    case Actions.GET_LOCATION_FAIL:
      return {
        ...state,
        loading: false,
        data: initState.data,
      }
    case Actions.GET_ADDRESS:
      return {
        ...state,
        loading: true,
        formattedAddress: ''
      }
    case Actions.GET_ADDRESS_SUCCESS:
      return {
        ...state,
        loading: false,
        formattedAddress: action.payload
      }
    case Actions.GET_ADDRESS_FAIL:
      return {
        ...state,
        loading: false,
        data: initState.data,
        formattedAddress: null
      }
    default:
      return state;
  }
}