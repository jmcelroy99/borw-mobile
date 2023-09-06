import * as Actions from './actionTypes';

/**
 * Action get list search
 * @param data
 */
export function getListSearch(data) {
  return {
    type: Actions.SEARCH_PRODUCT,
    data
  };
}

/**
 * Action get list filter
 * @param data
 */
export function getListFilter(data) {
  return {
    type: Actions.FILTER_PRODUCT,
    data
  };
}