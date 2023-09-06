import * as Actions from './actionTypes';

const initState = {
  notifications: [],
  nextPage: null,
  currentPage: null,
  unreadCount: 0,
  notificationId: null,
  loading: false
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

export default function notificationReducers(state = initState, action = {}) {
  switch (action.type) {
    case Actions.GET_NOTIFICATIONS: {
      return {
        ...state,
        loading: true,
        currentPage: action.data.page
      }
    }
    case Actions.GET_NOTIFICATIONS_SUCCESS: {
      if (state.currentPage == 0) {
        return {
          ...state,
          loading: false,
          notifications: uniqueArr(action.payload.notifications),
          nextPage: action.payload.nextPage
        }
      } else {
        const newList = [...state.notifications, ...action.payload.notifications]
        return {
          ...state,
          loading: false,
          notifications: uniqueArr(newList),
          nextPage: action.payload.nextPage
        }
      }
    }
    case Actions.GET_NOTIFICATIONS_FAIL: {
      return {
        ...state,
        loading: false,
        error: true
      }
    }
    case Actions.MARK_AS_READ: {
      const item = state.notifications.find(item => item.id == action.data.notificationId)
      if (item) {
        item.isRead = true
      }
      return {
        ...state,
        unreadSuccess: false,
        notificationId: action.data.notificationId
      }
    }
    case Actions.MARK_AS_READ_SUCCESS: {
      return {
        ...state,
        unreadSuccess: true,
        notificationId: null
      }
    }
    case Actions.MARK_AS_READ_FAIL: {
      return {
        ...state,
        notificationId: null
      }
    }
    case Actions.GET_UNREAD_COUNT: {
      return {
        ...state,
      }
    }
    case Actions.GET_UNREAD_COUNT_SUCCESS: {
      return {
        ...state,
        unreadCount: action.payload.count
      }
    }
    case Actions.GET_UNREAD_COUNT_FAIL: {
      return {
        ...state,
      }
    }
    default: return { ...state }
  }
}