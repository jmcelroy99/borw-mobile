import * as Actions from './actionTypes';

const initState = {
  products: [],
  designers: [],
  videos: [],
  nextPage: 0,
  currentPageProduct: null,
  currentPageDesigner: null,
  currentPageVideo: null,
  nextPageDesigners: 0,
  nextPageVideos: 0,
  likeSuccess: false,
  bookmarkSuccess: false,
  productId: null,
  liked: null,
  sendCommentSuccess: null,
  scrollToTop: null,
};

export default function homeReducers(state = initState, action = {}) {
  switch (action.type) {
    case Actions.GET_LIST_PRODUCT:
      return {
        ...state,
        loading: true,
        currentPageProduct: action.data.page,
        products: []
      }
    case Actions.GET_LIST_PRODUCT_SUCCESS:
      if (state.currentPageProduct == 0) {
        return {
          ...state,
          loading: false,
          products: action.payload.products,
          nextPage: action.payload.nextPage
        }
      } else if (state.currentPageProduct > 0) {
        const product = [...state.products, ...action.payload.products]
        return {
          ...state,
          loading: false,
          products: product,
          nextPage: action.payload.nextPage
        }
      }
    case Actions.GET_LIST_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.GET_LIST_DESIGNERS:
      return {
        ...state,
        loading: true,
        currentPageDesigner: action.data.page
      }
    case Actions.GET_LIST_DESIGNERS_SUCCESS:
      if (state.currentPageDesigner == 0) {
        return {
          ...state,
          loading: false,
          designers: action.payload.products,
          nextPageDesigners: action.payload.nextPage
        }
      } else if (state.currentPageDesigner > 0) {
        const data = [...state.designers, ...action.payload.products]
        return {
          ...state,
          loading: false,
          designers: data,
          nextPageDesigners: action.payload.nextPage
        }
      }
    case Actions.GET_LIST_DESIGNERS_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.GET_LIST_VIDEOS:
      return {
        ...state,
        loading: true,
        currentPageVideo: action.data.page
      }
    case Actions.GET_LIST_VIDEOS_SUCCESS:
      if (state.currentPageVideo == 0) {
        return {
          ...state,
          loading: false,
          videos: action.payload.products,
          nextPageVideos: action.payload.nextPage
        }
      } else if (state.currentPageVideo > 0) {
        const data = [...state.videos, ...action.payload.products]
        return {
          ...state,
          loading: false,
          videos: data,
          nextPageVideos: action.payload.nextPage
        }
      }
    case Actions.GET_LIST_VIDEOS_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.LIKE_ITEM:
      const item = state.products.find(product => product.id && product.id == action.data.id)
      if (item) {
        item.liked = action.data.liked
        action.data.liked ? item.likes++ : item.likes--
      } else {
        const item = state.designers.find(product => product.id == action.data.id)
        if (item) {
          item.liked = action.data.liked
          action.data.liked ? item.likes++ : item.likes--
        }
      }
      return {
        ...state,
        likeSuccess: false,
        liked: action.data.liked,
        productId: action.data.id,
      }
    case Actions.LIKE_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        likeSuccess: true,
      }
    case Actions.LIKE_ITEM_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.BOOKMARK_ITEM:
      const product = state.products.find(product => product.id == action.data.id)
      if (product) {
        product.bookmarked = action.data.bookmarked
      } else {
        const product = state.designers.find(product => product.id == action.data.id)
        if (product) {
          product.bookmarked = action.data.bookmarked
        }
      }
      return {
        ...state,
        bookmarkSuccess: false,
        productId: action.data.id,
      }
    case Actions.LIKE_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        bookmarkSuccess: true,
      }
    case Actions.LIKE_ITEM_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case Actions.SEND_COMMENT_SUCCESS:
      const element = state.products.find(i => i.id == action.payload)
      if (element) {
        if (element.comments >= 0) {
          let newCount = element.comments
          newCount++
          element.comments = newCount
        }
      }
      return {
        ...state,
      }
    case Actions.DELETE_COMMENT_SUCCESS:
      const temp = state.products.find(i => i.id == action.payload)
      if (temp) {
        if (temp.comments > 0) {
          let newCount = temp.comments
          newCount--
          temp.comments = newCount
        }
      }
      return {
        ...state,
      }
    case Actions.SCROLL_TO_TOP:
      return {
        ...state,
        scrollToTop: !state.scrollToTop
      }
    default:
      return {
        ...state
      }
  }
}
