import { GOOGLE_API_KEYS } from 'src/config/api';

let _token = '';
let deviceToken = '';
let isForgot = false;
let roomId = '';
let location = [];
let GoogleAPIKeys = GOOGLE_API_KEYS;
let user = {};

export default class Global {
  static setToken = (token) => {
    _token = token;
  };

  static getToken = () => {
    return _token;
  };

  static setDeviceToken = (deviceTok) => {
    deviceToken = deviceTok;
  };

  static getDeviceToken = () => {
    return deviceToken;
  };

  static setForgot = (value) => {
    isForgot = value;
  };

  static getForgot = () => {
    return isForgot;
  };

  static setUser= (value) => {
    user = value;
  };

  static getUser = () => {
    return user;
  };

  static getGoogleAPIKey = () => {
    return GoogleAPIKeys;
  }

  static setRoomId = (value) => {
    roomId = value
  }

  static getRoomId = () => {
    return roomId;
  }

  static setLocation = (value) => {
    location = value
  }

  static getLocation = () => {
    return location;
  }

  static clearData = () => {
    this.setForgot(false)
    this.setUser({})
  }
}
