import * as Actions from './actionTypes';

/**
 * Action get lcoation by address
 * @param address
 */
export function getLocationByAddress(address) {
  return {
    type: Actions.GET_LOCATION,
    address
  };
}

/**
 * Action get address by location
 * @param location
 */
export function getAddressByLocation(location) {
  return {
    type: Actions.GET_ADDRESS,
    location
  };
}