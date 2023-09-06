import queryString from 'query-string';
import request from 'src/utils/fetch';
import request2 from 'src/utils/fetch2';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';

/**
 * API login with email and password
 * @param username
 * @param password
 * @returns {Promise<unknown>}
 */
export const loginWithEmail = ({ username, password, language }) =>
  request2.post('/api/v1/auth/login', { username, password, language });

/**
 * Login with Firebase
 * @param idToken Firebase user id token
 * @returns {Promise<unknown>}
 */

export const signInFirebase = async (firebaseToken) => {
  return await auth().signInWithCustomToken(firebaseToken)
}

export const loginWithMobile = idToken =>
  request.post('/rnlab-app-control/v1/login-otp', { idToken });

export const loginWithFacebook = token =>
  request.post('/rnlab-app-control/v1/facebook', { token });

export const loginWithGoogle = user =>
  request.post('/rnlab-app-control/v1/google', user);

export const loginWithApple = data =>
  request.post('/rnlab-app-control/v1/apple', data);

export const registerWithEmail = data =>
  request2.post('/api/v1/auth/register', data);

export const forgotPassword = user_login =>
  request.post('/rnlab-app-control/v1/lost-password', { user_login });

export const changePassword = data =>
  request2.post('/api/v1/auth/resetPassword/updatePassword', data);

export const changeEmail = ({ u_password, u_email }) =>
  request.patch('users/change-email', { u_password, u_email });

export const updateCustomer = (user_id, data) =>
  request.put(`/rnlab-app-control/v1/customers/${user_id}`, data);

export const getCustomer = user_id =>
  request.get(`/wc/v3/customers/${user_id}`);

export const logout = () => request.get('users/logout');

export const signOutApp = async () => {
  return await request2.signOut('/api/v1/users/logout');
}

export const isLogin = () => request.get('users/is-login');

export const checkPhoneNumber = data =>
  request.post('/rnlab-app-control/v1/check-phone-number', data);

export const checkInfo = data => request.post('/rnlab-app-control/v1/check-info', data);

export const requestPermission = async () => {
  const authStatus = await messaging().requestPermission();
  return authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
}

export const updateToken = async (data) => {
  return await request2.updateDeviceToken('/api/v1/users/updateDeviceToken', data)
}

// Digits API

// export const digitsCreateUser = data => request.post('/digits/v1/create_user', queryString.stringify(data));

export const digitsCreateUser = data => request2.post('/api/v1/auth/sendVerificationCode', data);

export const digitsCheckVerificationCode = data => request2.post('/api/v1/auth/checkVerificationCode', data);

export const digitsCheckForgotVerificationCode = data => request2.post('/api/v1/auth/resetPassword/checkCode', data);

export const digitsResetPassword = data => request2.post('/api/v1/auth/resetPassword/sendCode', data);

export const digitsLoginUser = data => request.post('/digits/v1/login_user', queryString.stringify(data));

export const digitsRecoveryUser = data => request.post('/digits/v1/recovery', queryString.stringify(data));

export const digitsLogoutUser = () => request.post('/digits/v1/logout');

export const digitsUpdatePhone = data => request.post('/digits/v1/update_phone', queryString.stringify(data));

export const digitsSendOtp = data => request.post('/digits/v1/send_otp', queryString.stringify(data));

export const sendOtp = data => request.post('/digits/v1/send_otp', queryString.stringify(data));

export const digitsReSendOtp = data => request.post('/digits/v1/resend_otp', queryString.stringify(data));

export const digitsVerifyOtp = data => request.post('/digits/v1/verify_otp', queryString.stringify(data));

export const getFilesDownload = user_id => request.get(`/wc/v3/customers/${user_id}/downloads`);