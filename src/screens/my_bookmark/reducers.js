import * as Actions from './actionTypes';

const initState = {
  bookmarkedProducts: [],
  bookmarkedProfiles: [],
  nextPageProfiles: null,
  nextPageProducts: null,
  currentPageProducts: null,
  currentPageProfiles: null,
  loading: false,
};

export default function bookmarkReducers(state = initState, action = {}) {
  switch (action.type) {
    case Actions.GET_BOOKMARKED_PRODUCTS:
      return {
        ...state,
        loading: true,
        currentPageProducts: action.data.page
      }
    case Actions.GET_BOOKMARKED_PRODUCTS_SUCCESS:
      if (state.currentPageProducts == 0) {
        return {
          ...state,
          loading: false,
          bookmarkedProducts: action.payload.bookmarks,
          nextPageProducts: action.payload.nextPage
        }
      } else {
        const newArray = [...state.bookmarkedProducts, ...action.payload.bookmarks]
        return {
          ...state,
          loading: false,
          bookmarkedProducts: newArray,
          nextPageProducts: action.payload.nextPage
        }
      }
    case Actions.GET_BOOKMARKED_PRODUCTS_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.GET_BOOKMARKED_PROFILES:
      return {
        ...state,
        loading: true,
        currentPageProfiles: action.data.page
      }
    case Actions.GET_BOOKMARKED_PROFILES_SUCCESS:
      if (state.currentPageProfiles == 0) {
        return {
          ...state,
          loading: false,
          bookmarkedProfiles: action.payload.bookmarks,
          nextPageProfiles: action.payload.nextPage
        }
      } else {
        const newArray = [...state.bookmarkedProfiles, ...action.payload.bookmarks]
        return {
          ...state,
          loading: false,
          bookmarkedProfiles: newArray,
          nextPageProfiles: action.payload.nextPage
        }
      }
    case Actions.GET_BOOKMARKED_PROFILES_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    default:
      return state;
  }
}