import * as Actions from './actionTypes';

const initState = {
  products: [],
  nextPage: null,
  currentPage: null,
  shouldReload: null
};

export default function addProductReducers(state = initState, action = {}) {
  switch (action.type) {
    case Actions.ADD_NEW_PRODUCT:
      return {
        ...state,
        loading: true,
        success: null,
        error: null
      }
    case Actions.ADD_NEW_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true
      }
    case Actions.ADD_NEW_PRODUCT_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.GET_MY_PRODUCTS:
      if (action.data.shouldReload) {
        return {
          ...state,
          loading: true,
          products: [],
          currentPage: action.data.page,
          shouldReload: true
        }
      } else {
        return {
          ...state,
          loading: true,
          currentPage: action.data.page,
          shouldReload: null
        }
      }
    case Actions.GET_MY_PRODUCTS_SUCCESS: {
      if (!state.shouldReload) {
        const tempProducts = [...state.products, ...action.payload.products]
        tempProducts.sort((a, b) => b.updatedAt - a.updatedAt)
        return {
          ...state,
          loading: false,
          products: tempProducts,
          nextPage: action.payload.nextPage,
        }
      } else {
        return {
          ...state,
          loading: false,
          products: action.payload.products,
          nextPage: action.payload.nextPage,
        }
      }
    }
    case Actions.GET_MY_PRODUCTS_FAIL: {
      return {
        ...state,
        loading: false,
      }
    }
    case Actions.DELETE_PRODUCT: {
      return {
        ...state,
      }
    }
    case Actions.DELETE_PRODUCT_SUCCESS: {
      return {
        ...state,
      }
    }
    case Actions.DELETE_PRODUCT_FAIL: {
      return {
        ...state,
      }
    }
    case Actions.CLONE_PRODUCT: {
      return {
        ...state,
      }
    }
    case Actions.CLONE_PRODUCT_SUCCESS: {
      return {
        ...state,
      }
    }
    case Actions.CLONE_PRODUCT_FAIL: {
      return {
        ...state,
      }
    }
    case Actions.UPDATE_PRODUCT: {
      return {
        ...state,
        loading: true,
        updateSuccess: null,
        success: null,
      }
    }
    case Actions.UPDATE_PRODUCT_SUCCESS: {
      return {
        ...state,
        loading: false,
        updateSuccess: true
      }
    }
    case Actions.UPDATE_PRODUCT_FAIL: {
      return {
        ...state,
        loading: false,
        updateSuccess: false
      }
    }
    default:
      return state;
  }
}