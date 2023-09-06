import * as Actions from './actionTypes';

const initState = {
  products: [],
  userInfo: null,
  currentPage: null,
  nextPage: null,
  bookmarkProfileSuccess: false,
};

export default function userProfileReducers(state = initState, action = {}) {
  switch (action.type) {
    case Actions.GET_USER_PROFILE_INFO:
      return {
        ...state,
        loading: true,
        userInfo: null
      }
    case Actions.GET_USER_PROFILE_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        userInfo: action.payload
      }
    case Actions.GET_USER_PROFILE_INFO_FAIL:
      return {
        ...state,
        loading: false,
      }
    case Actions.GET_PRODUCTS:
      return {
        ...state,
        loading: true,
        nextPage: null,
        currentPage: action.data.page
      }
    case Actions.GET_PRODUCTS_SUCCESS:
      if (state.currentPage == 0) {
        return {
          ...state,
          loading: false,
          products: action.payload.products,
          nextPage: action.payload.nextPage
        }
      } else {
        const newProducts = [...state.products, ...action.payload.products]
        return {
          ...state,
          loading: false,
          products: newProducts,
          nextPage: action.payload.nextPage
        }
      }
    case Actions.GET_PRODUCTS_FAIL:
      return {
        ...state,
        loading: false,
      }
    case Actions.BOOKMARK_PROFILE:
      if (state.userInfo) {
        state.userInfo.bookmarked = action.data.bookmarked
      }
      return {
        ...state,
      }
    case Actions.BOOKMARK_PROFILE_SUCCESS:
      return {
        ...state,
        bookmarkProfileSuccess: true
      }
    case Actions.BOOKMARK_PROFILE_FAIL:
      return {
        ...state,
        bookmarkProfileSuccess: false
      }
    default:
      return state;
  }
}