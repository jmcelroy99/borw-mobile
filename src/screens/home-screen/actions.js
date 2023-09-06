import * as Actions from './actionTypes';

/**
 * Action get list product
 * @param data
 */
export function getListProduct(data) {
  return {
    type: Actions.GET_LIST_PRODUCT,
    data
  };
}

/**
 * Action get list designers
 * @param data
 */
export function getListDesigners(data) {
  return {
    type: Actions.GET_LIST_DESIGNERS,
    data
  };
}

/**
 * Action get list videos
 * @param  data 
 */
export function getListVideos(data) {
  return {
    type: Actions.GET_LIST_VIDEOS,
    data
  }
}

/**
 * Action like item
 * @param data
 */
export function likeItem(data) {
  return {
    type: Actions.LIKE_ITEM,
    data
  };
}

/**
 * Action bookmark item
 * @param data
 */
export function bookmarkItem(data) {
  return {
    type: Actions.BOOKMARK_ITEM,
    data
  };
}

/**
 * Action scroll to top
 */
export function scrollToTop() {
  return {
    type: Actions.SCROLL_TO_TOP,
  };
}

/**
 * Action request permission
 */
export function requestPermission() {
  return {
    type: Actions.REQUEST_PERMISSION,
  };
}

/**
 * Action get FCM token
 */
export function getFCMToken() {
  return {
    type: Actions.GET_FCM_TOKEN,
  };
}

/**
 * Action check notification messaging
 */
export function checkMessaging(data) {
  return {
    type: Actions.CHECK_MESSAGING,
    data
  };
}

