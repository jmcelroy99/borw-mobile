import * as Actions from './actionTypes';

const initState = {
  products: []
};

export default function searchReducers(state = initState, action = {}) {
  switch (action.type) {
    case Actions.SEARCH_PRODUCT:
      return {
        ...state,
        loading: true,
      }
    case Actions.SEARCH_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload.products
      }
    case Actions.SEARCH_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.FILTER_PRODUCT:
      return {
        ...state,
        loading: true,
      }
    case Actions.FILTER_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload.products
      }
    case Actions.FILTER_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    default:
      return state;
  }
}