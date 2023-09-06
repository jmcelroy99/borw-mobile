import * as Actions from './actionTypes';

const initState = {
  orders: null,
  orderSuccess: null
};

export default function myCartReducers(state = initState, action = {}) {
  switch (action.type) {
    case Actions.ORDER_PRODUCT:
      return {
        ...state,
        loading: true,
        success: null,
        error: null,
        orders: null,
        orderSuccess: false
      }
    case Actions.ORDER_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        orders: action.payload,
        orderSuccess: true
      }
    case Actions.ORDER_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
        orderSuccess: false
      }
    default:
      return state;
  }
}