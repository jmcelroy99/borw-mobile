import * as Actions from './actionTypes';

const initState = {
  listPoints: null,
  count: null,
  nextPage: null,
  currentPage: null,
  redeemSuccess: null,
  userInfo: null,
};

export default function myPointsReducers(state = initState, action = {}) {
  switch (action.type) {
    case Actions.REDEEM_CODE:
      return {
        ...state,
        loading: true,
        redeemSuccess: false,
      }
    case Actions.REDEEM_CODE_SUCCESS:
      return {
        ...state,
        loading: false,
        redeemSuccess: true
      }
    case Actions.REDEEM_CODE_FAIL:
      return {
        ...state,
        redeemSuccess: false,
        loading: false,
      }
    case Actions.GET_LIST_POINTS:

      return {
        ...state,
        loading: true,
        listPoints: [],
        currentPage: action.data.page
      }
    case Actions.GET_LIST_POINTS_SUCCESS:
      if (state.currentPage == 0) {
        return {
          ...state,
          loading: false,
          listPoints: action.payload.points,
          count: action.payload.count,
          nextPage: action.payload.nextPage
        }
      } else {
        const newList = [...state.listPoints, ...action.payload.points]
        return {
          ...state,
          loading: false,
          listPoints: newList,
          count: action.payload.count,
          nextPage: action.payload.nextPage
        }
      }
    case Actions.GET_LIST_POINTS_FAIL:
      return {
        ...state,
        loading: false,
      }
    case Actions.GET_USER_INFO:
      return {
        ...state,
        loading: true,
        userInfo: null
      }
    case Actions.GET_USER_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        userInfo: action.payload
      }
    case Actions.GET_USER_INFO_FAIL:
      return {
        ...state,
        loading: false,
      }
    default:
      return state;
  }
}