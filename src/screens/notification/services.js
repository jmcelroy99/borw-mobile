import request2 from 'src/utils/fetch2';

/**
 * API get ratings from sellers
 * @param data
 * @returns {Promise<unknown>}
 */
export const getNotifications = async (data) => {
  return await request2.getNotifications(`/api/v1/notifications?limit=${data.limit}&page=${data.page}`);
}

/**
 * API mark as read
 * @param data
 * @returns {Promise<unknown>}
 */
export const markAsRead = async (data) => {
  return await request2.markAsRead(`/api/v1/notifications/${data.notificationId}/markAsRead`);
}

/**
 * API get unread count
 * @param data
 * @returns {Promise<unknown>}
 */
export const getUnreadCount = async () => {
  return await request2.getUnreadCount(`/api/v1/notifications/unreadCounter`);
}

