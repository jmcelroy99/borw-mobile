import * as Actions from './actionTypes';

/**
 * Create room
 * @returns {{type: string}}
 */
export function createRoom(data) {
  return {
    type: Actions.CREATE_ROOM,
    data
  };
}

/**
 * Check room exist
 * @returns {{type: string}}
 */
export function checkRoom(data) {
  return {
    type: Actions.CHECK_ROOM_EXIST,
    data
  };
}

/**
 * Send message
 * @returns {{type: string}}
 */
export function sendMessage(data) {
  return {
    type: Actions.SEND_MESSAGE,
    data
  };
}

/**
 * Listen message change
 * @returns {{type: string}}
 */
export function listenMessage(data) {
  return {
    type: Actions.LISTEN_MESSAGE_CHANGE,
    data
  };
}

/**
 * Get list rooms
 * @returns {{type: string}}
 */
export function checkUser(data) {
  return {
    type: Actions.CHECK_USER,
    data
  };
}

/**
 * Create user
 * @returns {{type: string}}
 */
export function createUser(data) {
  return {
    type: Actions.CREATE_USER,
    data
  };
}

/**
 * Get rooms
 * @returns {{type: string}}
 */
export function getRooms(data) {
  return {
    type: Actions.GET_LIST_ROOMS,
    data
  };
}

/**
 * Update last message
 * @returns {{type: string}}
 */
export function updateLastMessage(data) {
  return {
    type: Actions.UPDATE_LAST_MESSAGE,
    data
  };
}

/**
 * Update unread message
 * @returns {{type: string}}
 */
export function updateUnread(data) {
  return {
    type: Actions.UPDATE_UNREAD,
    data
  };
}

/**
 * Delete message
 * @returns {{type: string}}
 */
export function deleteMessage(data) {
  return {
    type: Actions.DELETE_MESSAGE,
    data
  };
}

/**
 * Mute room
 * @returns {{type: string}}
 */
export function muteRoom(data) {
  return {
    type: Actions.MUTE_ROOM,
    data
  };
}

/**
 * Check muted
 * @returns {{type: string}}
 */
export function checkMuted(data) {
  return {
    type: Actions.CHECK_MUTED,
    data
  };
}

/**
 * Action get user info
 * @param data
 */
export function getUserInfo(data) {
  return {
    type: Actions.GET_USER_PROFILE,
    data
  };
}

/**
 * Action update message status
 * @param data
 */
export function updateMessageStatus(data) {
  return {
    type: Actions.UPDATE_NOTIFICATION_MESSAGE,
    data
  };
}

/**
 * Action update message status
 * @param data
 */
export function updateMessageNotification(data) {
  return {
    type: Actions.UPDATE_MESSAGE_NOTIFICATION,
    data
  };
}