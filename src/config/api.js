export const API = 'https://wc.rnlab.io';
//export const API_NUS = 'http://10.10.10.174:5000'; // develope_env
export const API_NUS = 'http://18.132.252.76'; //staging_env

export const API_PHONGTH = 'http://192.168.1.127:5000'
export const API_THUYNTX = 'http://192.168.1.180:5000'
export const API_ERROR = 'http://192.168.1.180:9999'

export const INVITE_LINK = 'https://onelink.to/borwapp'

export const GOOGLE_API_KEYS = 'AIzaSyCXQV4FpKYoFva5dmQkqTBFgZ2Ce81I204'

export const CONSUMER_KEY = 'ck_9a40d82e47c124bc1be422682dd93eb25bdb5e3a';
export const CONSUMER_SECRET = 'cs_01bd2047d4ea33bdb4b6d8f6f034e0e072abdf4a';

export const STRIPE_CLIENT_ID = 'ca_GYd0wYhvfxh9TJv1kxzIG0R0lhXecqyh';
export const PUBLISHABLE_KEY = 'pk_test_WUMJzpnFoNxT4ubYIPOPnlZ400xLcaL8Du';

export const linkSocialNetwork = {
  linkedIn: 'https://www.linkedin.com/company/borώ/',
  facebook: 'https://www.facebook.com/borwapp',
  twitter: 'https://twitter.com/OfficialBorw',
  youtube: 'https://www.youtube.com/channel/UCAsEfE9ykZd2o2ixTCNqVhA',
  instagram: 'https://www.instagram.com/borwofficial/?hl=el'
}

export const legalLink = {
  termsConditions: 'https://www.borw.app/terms-conditions',
  privacyPolicy: 'https://www.borw.app/privacy-policy',
  borwMembership: 'https://www.borw.app/borώ-membership',
  faqs: 'https://www.borw.app/faqs',
  ourStory: 'https://www.borw.app/aboutborwapp',
  sizingGuide: 'https://www.borw.app/store-policies',
  howItWorks: 'https://www.youtube.com/watch?v=QZOZ6IUFyAw&feature=youtu.be'
}

const randomString = (length) => {
  return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

export const STRIPE = (userprofile) => {
  return `https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=ca_GYd0wYhvfxh9TJv1kxzIG0R0lhXecqyh&stripe_user[country]=GB
  &stripe_user[email]=${userprofile.email}
  &stripe_user[phoneNumber]=${userprofile.phoneNumber && userprofile.phoneNumber.substring(3)}
  &stripe_user[businessName]=${userprofile.companyname ? userprofile.companyname : ''}
  &stripe_user[firstName]=${userprofile.firstName}
  &stripe_user[lastName]=${userprofile.lastName}
  &scope=read_write`
}

export default {
  API_ENDPOINT: API,
  API_ENDPOINT_NUS: API_NUS,
  CONSUMER_KEY,
  CONSUMER_SECRET
};
