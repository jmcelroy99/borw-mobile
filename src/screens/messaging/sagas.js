import { put, call, takeEvery, take } from 'redux-saga/effects';
import * as Actions from './actionTypes';
import { handleError } from 'src/utils/error';
import {
  createRoom, checkRoom, sendMessage, addRoom, deleteMessage, getUserInfo,
  getListRooms, createUser, checkUser, updateLastMessage, muteRoom, updateMessageNotification
} from './services';
import { eventChannel } from 'redux-saga';
import firestore from '@react-native-firebase/firestore';
import global from 'src/utils/global';

/**
 * Create room
 * @returns {IterableIterator<*>}
 */
function* createRoomSaga({ data }) {
  try {
    const roomName = yield call(createRoom, data);
    if (roomName) {
      yield put({
        type: Actions.CREATE_ROOM_SUCCESS,
        payload: {
          roomName: roomName
        }
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.CREATE_ROOM_FAIL, error: e });
  }
}

/**
 * Check room exist
 * @returns {IterableIterator<*>}
 */
function* checkRoomExistSaga({ data }) {
  try {
    const roomName = data.roomName
    const document = yield call(checkRoom, roomName);
    if (document && document._exists) {
      yield put({
        type: Actions.CHECK_ROOM_EXIST_SUCCESS,
        payload: {
          roomName: roomName,
          isExist: true,
        }
      })
    } else {
      yield put({
        type: Actions.CREATE_ROOM,
        data: {
          sender: data.senderId,
          receiver: data.receiverId,
          roomName: roomName,
          participants: data.participants
        }
      })
      yield put({
        type: Actions.ADD_ROOM_TO_LIST,
        data: {
          sender: data.senderUID,
          receiver: data.receiverUID,
          roomName: roomName,
          participants: data.participants
        }
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.CHECK_ROOM_EXIST_FAIL, error: e });
  }
}

/**
 * Check room exist
 * @returns {IterableIterator<*>}
 */
function* sendMessageSaga({ data }) {
  try {
    const success = yield call(sendMessage, data);
    if (success) {
      if (data.type != 'product') {
        yield put({
          type: Actions.UPDATE_LAST_MESSAGE,
          data: {
            roomName: data.roomName,
            sender: data.user,
            receiver: data.receiverId,
            content: data.text
          }
        })
      }
      yield put({
        type: Actions.UPDATE_MESSAGE_NOTIFICATION,
        data: {
          userUID: data.receiverId,
          update: true
        }
      })
      yield put({
        type: Actions.SEND_MESSAGE_SUCCESS,
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.SEND_MESSAGE_FAIL, error: e });
  }
}

/**
 * Listen message change
 * @returns {IterableIterator<*>}
 */
function* listenMessageSaga({ data }) {
  try {
    yield put({
      type: Actions.LISTEN_MESSAGE_CHANGE_SUCCESS,
      payload: data
    })
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.LISTEN_MESSAGE_CHANGE_FAIL, error: e });
  }
}

/**
 * Check user
 * @returns {IterableIterator<*>}
 */
function* checkUserSaga({ data }) {
  try {
    const document = yield call(checkUser, data);
    if (!document) {
      yield put({
        type: Actions.CREATE_USER,
        data
      });
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.CREATE_USER_FAIL, error: e });
  }
}

/**
 * Create user
 * @returns {IterableIterator<*>}
 */
function* createUserSaga({ data }) {
  try {
    const success = yield call(createUser, data);
    if (success) {
      yield put({
        type: Actions.CREATE_USER_SUCCESS,
      });
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.CREATE_USER_FAIL, error: e });
  }
}

/**
 * Get rooms
 * @returns {IterableIterator<*>}
 */
function* getRoomsSaga({ data }) {
  try {
    const documents = yield call(getListRooms, data);
    if (documents) {
      yield put({
        type: Actions.GET_LIST_ROOMS_SUCCESS,
        payload: documents
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.GET_LIST_ROOMS_FAIL, error: e });
  }
}

/**
 * Add room to list
 * @returns {IterableIterator<*>}
 */
function* addRoomToListSaga({ data }) {
  try {
    const addRoomSuccess = yield call(addRoom, data)
    if (addRoomSuccess) {
      yield put({
        type: Actions.ADD_ROOM_TO_LIST_SUCCESS,
        payload: {
          roomName: data.roomName
        }
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.GET_LIST_ROOMS_FAIL, error: e });
  }
}

/**
 * Add room to list
 * @returns {IterableIterator<*>}
 */
function* updateLastMesageSaga({ data }) {
  try {
    const updateLastMessSuccess = yield call(updateLastMessage, data)
    if (updateLastMessSuccess) {
      yield put({
        type: Actions.UPDATE_LAST_MESSAGE_SUCCESS,
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.UPDATE_LAST_MESSAGE_FAIL, error: e });
  }
}

/**
 * Delete message
 * @returns {IterableIterator<*>}
 */
function* deleteMessageSaga({ data }) {
  try {
    const deleteSuccess = yield call(deleteMessage, data)
    if (deleteSuccess) {
      yield put({
        type: Actions.DELETE_MESSAGE_SUCCESS,
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.DELETE_MESSAGE_FAIL, error: e });
  }
}

/**
 * Mute room
 * @returns {IterableIterator<*>}
 */
function* muteRoomSaga({ data }) {
  try {
    const muteSuccess = yield call(muteRoom, data)
    if (muteSuccess) {
      yield put({
        type: Actions.MUTE_ROOM_SUCCESS,
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.MUTE_ROOM_FAIL, error: e });
  }
}

/**
 * Check muted
 * @returns {IterableIterator<*>}
 */
function createEventChannelRoomMuted(data) {
  const listener = eventChannel(
    emit => {
      firestore()
        .collection('ListRoom')
        .doc(data)
        .onSnapshot(documentSnapshot => {
          if (documentSnapshot && documentSnapshot._data && documentSnapshot._data.isMutedBy) {
            emit(documentSnapshot._data.isMutedBy)
          } else
            emit([])
        })
      return () => listener();
    }
  );
  return listener;
};

function* listenMuteRoomSaga({ data }) {
  try {
    const updateChannel = createEventChannelRoomMuted(data);
    while (true) {
      const isMutedBy = yield take(updateChannel);
      yield put({
        type: Actions.CHECK_MUTED_SUCCESS,
        payload: isMutedBy
      })
    }
  } catch (e) {
    yield put({
      type: Actions.CHECK_MUTED_FAIL,
      error: e
    })
  }
}

/**
 * Event listen messages
 * @returns {IterableIterator<*>}
 */
function createEventChannel(data) {
  const listener = eventChannel(
    emit => {
      firestore()
        .collection('ListRoom')
        .doc(data)
        .collection('Messages')
        .orderBy('createdAt')
        .onSnapshot(documentSnapshot => {
          const messages = []
          if (documentSnapshot.docs.length > 0) {
            documentSnapshot.docs.map(item => {
              if (item._data._id && item._data.createdAt) {
                item._data.createdAt = new Date(item._data.createdAt._seconds * 1000)
                messages.unshift(item._data);
              }
            });
            emit(messages)
          }
        })
      return () => listener();
    }
  );
  return listener;
};

function* updatedItemSaga({ data }) {
  const updateChannel = createEventChannel(data);
  while (true) {
    const item = yield take(updateChannel);
    yield put({
      type: Actions.LISTEN_MESSAGE_CHANGE_SUCCESS,
      payload: item
    })
  }
}

/**
 * Event listen unread update
 * @returns {IterableIterator<*>}
 */
function createChannelUpdateUnRead(data) {
  const listener = eventChannel(
    emit => {
      firestore()
        .collection('UserList')
        .doc(data._id)
        .collection('conversations')
        .doc(data.roomName)
        .onSnapshot(documentSnapshot => {
          if (documentSnapshot && documentSnapshot._data &&
            documentSnapshot._data.unread != 0 &&
            global.getRoomId() == documentSnapshot._data._id) {
            firestore()
              .collection('UserList')
              .doc(data._id.toString())
              .collection('conversations')
              .doc(data.roomName)
              .update({
                unread: 0
              });
          }
          emit(documentSnapshot)
        })
      return () => listener();
    }
  );
  return listener;
};

function* updatedUnReadSaga({ data }) {
  const updateChannel = createChannelUpdateUnRead(data);
  while (true) {
    yield take(updateChannel);
  }
}

/**
 * Get user info
 * @returns {IterableIterator<*>}
 */
function* getUserInfoSaga({ data }) {
  try {
    const { user } = yield call(getUserInfo, data);
    if (user) {
      yield put({
        type: Actions.GET_USER_PROFILE_SUCCESS,
        payload: user
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.GET_USER_PROFILE_FAIL, error: e });
  }
}

/**
 * Get user info
 * @returns {IterableIterator<*>}
 */
function* updateMessageSaga({ data }) {
  try {
    const success = yield call(updateMessageNotification, data);
    if (success) {
      yield put({
        type: Actions.UPDATE_MESSAGE_NOTIFICATION_SUCCESS,
      })
    }
  } catch (e) {
    yield call(handleError, e);
    yield put({ type: Actions.UPDATE_MESSAGE_NOTIFICATION_FAIL, error: e });
  }
}

export default function* messageSaga() {
  yield takeEvery(Actions.CREATE_ROOM, createRoomSaga);
  yield takeEvery(Actions.CHECK_ROOM_EXIST, checkRoomExistSaga);
  yield takeEvery(Actions.SEND_MESSAGE, sendMessageSaga);
  yield takeEvery(Actions.LISTEN_MESSAGE_CHANGE, updatedItemSaga);
  yield takeEvery(Actions.CHECK_USER, checkUserSaga);
  yield takeEvery(Actions.CREATE_USER, createUserSaga);
  yield takeEvery(Actions.GET_LIST_ROOMS, getRoomsSaga);
  yield takeEvery(Actions.ADD_ROOM_TO_LIST, addRoomToListSaga);
  yield takeEvery(Actions.UPDATE_LAST_MESSAGE, updateLastMesageSaga);
  yield takeEvery(Actions.UPDATE_UNREAD, updatedUnReadSaga);
  yield takeEvery(Actions.DELETE_MESSAGE, deleteMessageSaga);
  yield takeEvery(Actions.MUTE_ROOM, muteRoomSaga);
  yield takeEvery(Actions.CHECK_MUTED, listenMuteRoomSaga);
  yield takeEvery(Actions.GET_USER_PROFILE, getUserInfoSaga);
  yield takeEvery(Actions.UPDATE_MESSAGE_NOTIFICATION, updateMessageSaga);
}