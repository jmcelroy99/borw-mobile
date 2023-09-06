import * as Actions from './actionTypes';

const initState = {
  ratingsFromSellers: [],
  ratingsFromBuyers: [],
  currentSellerPage: 0,
  currentBuyerPage: 0,
  nextSellerPage: 0,
  nextBuyerPage: 0,
  sellersAverage: null,
  buyersAverage: null,
  totalSellers: null,
  totalBuyers: null,
  loading: null,
};

const uniqueArr = (data) => {
  const filteredArr = data.reduce((acc, current) => {
    const x = acc.find(item => item.id == current.id);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
  return filteredArr;
}

export default function myRatingsReducers(state = initState, action = {}) {
  switch (action.type) {
    case Actions.GET_RATING_FROM_SELLERS: {
      return {
        ...state,
        loading: true,
        currentSellerPage: action.data.page,
        ratingsFromSellers: []
      }
    }
    case Actions.GET_RATING_FROM_SELLERS_SUCCESS: {
      const newRatings = [...state.ratingsFromSellers, ...action.payload.ratings]
      return {
        ...state,
        loading: false,
        ratingsFromSellers: uniqueArr(newRatings),
        nextSellerPage: action.payload.nextPage,
        sellersAverage: action.payload.average,
        totalSellers: action.payload.count,
      }
    }
    case Actions.GET_RATING_FROM_SELLERS_FAIL: {
      return {
        ...state,
        loading: false,
        error: true
      }
    }
    case Actions.GET_RATING_FROM_BUYERS: {
      return {
        ...state,
        loading: true,
        currentBuyerPage: action.data.page,
        ratingsFromBuyers: [],
      }
    }
    case Actions.GET_RATING_FROM_BUYERS_SUCCESS: {
      const newRatings = [...state.ratingsFromBuyers, ...action.payload.ratings]
      return {
        ...state,
        loading: false,
        ratingsFromBuyers: uniqueArr(newRatings),
        nextBuyerPage: action.payload.nextPage,
        buyersAverage: action.payload.average,
        totalBuyers: action.payload.count,
      }
    }
    case Actions.GET_RATING_FROM_BUYERS_FAIL: {
      return {
        ...state,
        loading: false,
        error: true
      }
    }
    default: return { ...state }
  }
}