import * as Actions from './actionTypes';

const initState = {
  roomName: '',
  messages: null,
  listRooms: [],
  mutedBy: null,
  sendMessageSucess: false,
  createRoomSuccess: false,
  loadingGetRooms: false,
  deleteSuccess: false,
  muteSuccess: false,
  isExist: false,
  userId: null,
  userInfo: null,
  messageStatus: null,
};

export default function messagingReducers(state = initState, action = {}) {
  switch (action.type) {
    case Actions.CREATE_ROOM:
      return {
        ...state,
        loading: true,
        createRoomSuccess: false,
      }
    case Actions.CREATE_ROOM_SUCCESS:
      return {
        ...state,
        loading: false,
        createRoomSuccess: true,
        isExist: true,
        roomName: action.payload.roomName
      }
    case Actions.CREATE_ROOM_FAIL:
      return {
        ...state,
        loading: false,
        error: false,
      }
    case Actions.CHECK_ROOM_EXIST:
      return {
        ...state,
        loading: true,
        isExist: false,
      }
    case Actions.CHECK_ROOM_EXIST_SUCCESS:
      return {
        ...state,
        loading: false,
        roomName: action.payload.roomName,
        isExist: action.payload.isExist,
        messages: !action.payload.isExist && []
      }
    case Actions.CHECK_ROOM_EXIST_FAIL:
      return {
        ...state,
        loading: false,
        error: false,
      }
    case Actions.SEND_MESSAGE:
      return {
        ...state,
        loading: false,
        message: action.payload,
        sendMessageSucess: false,
      }
    case Actions.SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        sendMessageSucess: true
      }
    case Actions.SEND_MESSAGE_FAIL:
      return {
        ...state,
        loading: false,
        error: false,
      }
    case Actions.LISTEN_MESSAGE_CHANGE:
      return {
        ...state,
        loading: false,
        messages: []
      }
    case Actions.LISTEN_MESSAGE_CHANGE_SUCCESS:
      if (action.payload.length != state.messages.length) {
        return {
          ...state,
          loading: false,
          messages: action.payload
        }
      }
    case Actions.LISTEN_MESSAGE_CHANGE_FAIL:
      return {
        ...state,
        loading: false,
        error: false,
      }
    case Actions.ADD_ROOM_TO_LIST:
      return {
        ...state,
        loading: true,
      }
    case Actions.ADD_ROOM_TO_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        roomName: action.payload.roomName,
      }
    case Actions.ADD_ROOM_TO_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: false,
      }
    case Actions.GET_LIST_ROOMS:
      return {
        ...state,
        loadingGetRooms: true,
      }
    case Actions.GET_LIST_ROOMS_SUCCESS:
      action.payload.forEach(element => {
        element._data.updatedAt.date = new Date(element._data.updatedAt._seconds * 1000)
      });
      action.payload.sort((a, b) => b._data.updatedAt.date - a._data.updatedAt.date);
      return {
        ...state,
        loadingGetRooms: false,
        listRooms: action.payload,
      }
    case Actions.GET_LIST_ROOMS_FAIL:
      return {
        ...state,
        loadingGetRooms: false,
        error: false,
      }
    case Actions.DELETE_MESSAGE:
      return {
        ...state,
        loading: true,
        deleteSuccess: false,
      }
    case Actions.DELETE_MESSAGE_SUCCESS:
      return {
        ...state,
        deleteSuccess: true,
        loading: true,
      }
    case Actions.DELETE_MESSAGE_FAIL:
      return {
        ...state,
        loading: true,
        deleteSuccess: false,
        error: true,
      }
    case Actions.MUTE_ROOM:
      return {
        ...state,
        loading: true,
        muteSuccess: false,
      }
    case Actions.MUTE_ROOM_SUCCESS:
      return {
        ...state,
        muteSuccess: true,
        loading: false,
      }
    case Actions.MUTE_ROOM_FAIL:
      return {
        ...state,
        muteSuccess: false,
        loading: false,
        error: true,
      }
    case Actions.CHECK_MUTED:
      return {
        ...state,
        loading: true,
        mutedBy: null,
      }
    case Actions.CHECK_MUTED_SUCCESS:
      return {
        ...state,
        loading: false,
        mutedBy: action.payload,
      }
    case Actions.CHECK_MUTED_FAIL:
      return {
        ...state,
        mutedBy: null,
        loading: false,
        error: true,
      }
    case Actions.GET_USER_PROFILE:
      return {
        ...state,
        userId: action.data
      }
    case Actions.GET_USER_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        userInfo: action.payload
      }
    case Actions.GET_USER_PROFILE_FAIL:
      return {
        ...state,
        loading: false,
      }
    case Actions.UPDATE_NOTIFICATION_MESSAGE:
      return {
        ...state,
        messageStatus: action.data
      }
    default: return {
      ...state
    }
  }
}