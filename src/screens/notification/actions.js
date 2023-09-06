import * as Actions from './actionTypes';

/**
 * Action get notifications
 * @param data
 */
export function getNotifications(data) {
  return {
    type: Actions.GET_NOTIFICATIONS,
    data
  };
}

/**
 * Action mark as read
 * @param data
 */
export function markAsRead(data) {
  return {
    type: Actions.MARK_AS_READ,
    data
  };
}

/**
 * Action get unread count
 * @param data
 */
export function getUnreadCount() {
  return {
    type: Actions.GET_UNREAD_COUNT,
  };
}