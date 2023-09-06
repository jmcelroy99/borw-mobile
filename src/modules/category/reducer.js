import { fromJS } from 'immutable';

import * as Actions from './constants';

const initState = {
  data: [],
  loading: false,
};

export default function categoryReducer(state = initState, action = {}) {
  switch (action.type) {
    case Actions.GET_CATEGORIES:
      // return state.set('loading', true);
      return {
        ...state,
        loading: true,
      }
    case Actions.GET_CATEGORIES_SUCCESS:
      // console.log('payload: ', action.payload)
      return {
        ...state,
        loading: false,
        data: action.payload
      }
    case Actions.GET_CATEGORIES_ERROR:
      // return state.set('loading', false).set('data', initState.get('data'));
      return {
        ...state,
        loading: false,
        data: initState.data,
      }
    case 'UPDATE_DEMO_CONFIG_SUCCESS':
      return initState;
    default:
      return state;
  }
}
