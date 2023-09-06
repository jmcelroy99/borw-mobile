import * as Actions from './actionTypes';

const initState = {
  orders: null,
  order: null,
  nextPage: null,
};

export default function ordersReducers(state = initState, action = {}) {
  switch (action.type) {
    case Actions.GET_LIST_ORDERS:
      return {
        ...state,
        loading: true,
        success: null,
        error: null,
        orders: []
      }
    case Actions.GET_LIST_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        orders: action.payload.orders,
        nextPage: action.payload.nextPage
      }
    case Actions.GET_LIST_ORDERS_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.GET_ORDER_DETAIL:
      return {
        ...state,
        isLoading: true,
        success: null,
        error: null,
        order: null
      }
    case Actions.GET_ORDER_DETAIL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        success: true,
        order: action.payload,
      }
    case Actions.GET_ORDER_DETAIL_FAIL:
      return {
        ...state,
        isLoading: false,
        error: true,
      }
    default:
      return state;
  }
}