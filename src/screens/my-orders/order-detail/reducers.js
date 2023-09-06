import * as Actions from './actionTypes';

const initState = {
  cancelSuccess: null,
  completeSuccess: null,
  loading: null,
  ratingSuccess: null,
  archiveSuccess: null,
  purchaseExtraSuccess: null
};

export default function orderStatusReducers(state = initState, action = {}) {
  switch (action.type) {
    case Actions.CANCEL_ORDER:
      return {
        ...state,
        loading: true,
        success: null,
        error: null,
      }
    case Actions.CANCEL_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        cancelSuccess: true,
      }
    case Actions.CANCEL_ORDER_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.UPDATE_STATUS_ORDER:
      return {
        ...state,
        loading: true,
        updateSuccess: null,
        error: null,
      }
    case Actions.UPDATE_STATUS_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        updateSuccess: true,
      }
    case Actions.UPDATE_STATUS_ORDER_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.ADD_ORDER_PHOTO:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case Actions.ADD_ORDER_PHOTO_SUCCESS:
      return {
        ...state,
        loading: false,
        orderPhotos: action.payload,
      }
    case Actions.ADD_ORDER_PHOTO_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.GET_ORDER_PHOTOS:
      return {
        ...state,
        loading: false,
        error: null,
        orderPhotos: null
      }
    case Actions.GET_ORDER_PHOTOS_SUCCESS:
      if (action.payload.sellerPhotos) {
        return {
          ...state,
          loading: false,
          sellerPhotos: action.payload.sellerPhotos,
        }
      } else if (action.payload.buyerPhotos) {
        return {
          ...state,
          loading: false,
          buyerPhotos: action.payload.buyerPhotos,
        }
      }
    case Actions.GET_ORDER_PHOTOS_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.DELETE_ORDER_PHOTOS:
      return {
        ...state,
        loading: true,
        error: null,
        deleteSuccess: null
      }
    case Actions.DELETE_ORDER_PHOTOS_SUCCESS:
      return {
        ...state,
        loading: false,
        deleteSuccess: true,
      }
    case Actions.DELETE_ORDER_PHOTOS_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.COMPLETE_ORDER:
      return {
        ...state,
        loading: true,
        error: null,
        completeSuccess: null
      }
    case Actions.COMPLETE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        completeSuccess: true,
      }
    case Actions.COMPLETE_ORDER_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.RATING_USER:
      return {
        ...state,
        loading: true,
        error: null,
        ratingSuccess: null,
        valueRating: null
      }
    case Actions.RATING_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        ratingSuccess: true,
        valueRating: action.payload.value
      }
    case Actions.RATING_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.ARCHIVE_ORDER:
      return {
        ...state,
        loading: true,
        error: null,
        archiveSuccess: null,
      }
    case Actions.ARCHIVE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        archiveSuccess: true,
      }
    case Actions.ARCHIVE_ORDER_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.PURCHASE_EXTRA_FEE:
      return {
        ...state,
        loading: true,
        error: null,
        purchaseExtraSuccess: null,
      }
    case Actions.PURCHASE_EXTRA_FEE_SUCCESS:
      return {
        ...state,
        loading: false,
        purchaseExtraSuccess: true,
      }
    case Actions.PURCHASE_EXTRA_FEE_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    default:
      return state;
  }
}