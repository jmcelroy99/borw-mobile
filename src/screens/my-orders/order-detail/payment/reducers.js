import * as Actions from './actionTypes';

const initState = {
  updateSuccess: null,
  purchaseSuccess: null
};

export default function paymentReducers(state = initState, action = {}) {
  switch (action.type) {
    case Actions.UPDATE_STATUS_ORDER_FOR_PAYMENT:
      return {
        ...state,
        loading: true,
        updateSuccess: null,
        error: null,
      }
    case Actions.UPDATE_STATUS_ORDER_FOR_PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        updateSuccess: true,
      }
    case Actions.UPDATE_STATUS_ORDER_FOR_PAYMENT_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.PURCHASE_ORDER:
      return {
        ...state,
        loading: true,
        purchaseSuccess: false,
        error: null,
      }
    case Actions.PURCHASE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        purchaseSuccess: true,
      }
    case Actions.PURCHASE_ORDER_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    default: return { ...state }
  }
}