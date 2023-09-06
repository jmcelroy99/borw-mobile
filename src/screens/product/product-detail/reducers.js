import * as Actions from './actionTypes';

const initState = {
  cart: [],
  comments: [],
  likesList: [],
  item: null,
  sendSuccess: null,
  product: null,
  success: null,
  addSuccess: null,
  deleteSuccess: null,
  removeAllSuccess: null
};

export default function productReducers(state = initState, action = {}) {
  switch (action.type) {
    case Actions.ADD_ITEM_TO_CART:
      return {
        ...state,
        loading: true,
        addSuccess: null,
        error: null,
      }
    case Actions.ADD_ITEM_TO_CART_SUCCESS:
      const newCart = [...state.cart]
      newCart.unshift(action.payload)
      return {
        ...state,
        loading: false,
        addSuccess: true,
        cart: newCart
      }
    case Actions.ADD_ITEM_TO_CART_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.REMOVE_PRODUCT_TO_CART:
      return {
        ...state,
        loading: true,
        success: null,
        error: null,
      }
    case Actions.REMOVE_PRODUCT_TO_CART_SUCCESS:
      const temp = [...state.cart]
      const index = temp.findIndex(item => item.id == action.payload)
      if (index != -1) {
        temp.splice(index, 1)
      }
      return {
        ...state,
        loading: false,
        success: true,
        cart: temp
      }
    case Actions.REMOVE_PRODUCT_TO_CART_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
      case Actions.REMOVE_ALL_PRODUCT_TO_CART:
      return {
        ...state,
        loading: true,
        removeAllSuccess: null,
        error: null,
      }
    case Actions.REMOVE_ALL_PRODUCT_TO_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        removeAllSuccess: true,
        cart: []
      }
    case Actions.REMOVE_PRODUCT_TO_CART_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.FETCH_DATA_CART_ASYNC:
      return {
        ...state,
        loading: true,
        success: null,
        error: null
      }
    case Actions.FETCH_DATA_CART_ASYNC_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        cart: action.payload
      }
    case Actions.FETCH_DATA_CART_ASYNC_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.SEND_COMMENT:
      return {
        ...state,
        loading: true,
        sendSuccess: null,
        error: null,
      }
    case Actions.SEND_COMMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        sendSuccess: true
      }
    case Actions.SEND_COMMENT_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.GET_COMMENTS:
      return {
        ...state,
        loading: true,
        error: null,
        comments: [],
      }
    case Actions.GET_COMMENTS_SUCCESS: {
      return {
        ...state,
        loading: false,
        comments: action.payload
      }
    }
    case Actions.GET_COMMENTS_FAIL: {
      return {
        ...state,
        loading: false,
        error: true,
        comments: []
      }
    }
    case Actions.GET_PRODUCT_DETAIL:
      return {
        ...state,
        loading: true,
        success: null,
        error: null,
        product: null
      }
    case Actions.GET_PRODUCT_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        product: action.payload
      }
    case Actions.GET_PRODUCT_DETAIL_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.GET_LIKES_LIST:
      return {
        ...state,
        loading: true,
        success: null,
        likesList: null
      }
    case Actions.GET_LIKES_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        likesList: action.payload
      }
    case Actions.GET_LIKES_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.DELETE_COMMENT:
      return {
        ...state,
        loading: true,
        deleteSuccess: null
      }
    case Actions.DELETE_COMMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        deleteSuccess: true,
      }
    case Actions.DELETE_COMMENT_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    default:
      return state;
  }
}