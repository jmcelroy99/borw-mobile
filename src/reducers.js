import { combineReducers } from 'redux';

import authReducer from './modules/auth/reducer';
import categoryReducer from './modules/category/reducer';
import productReducer from './modules/product/reducer';
import commonReducer from './modules/common/reducer';
import cartReducer from './modules/cart/reducer';
import orderReducer from './modules/order/reducer';
import vendorReducer from './modules/vendor/reducer';
import locationReducer from './screens/shop/MapView/reducers';
import addProductReducers from './screens/shop/MyShop/reducers';
import homeReducers from './screens/home-screen/reducers';
import searchReducers from './screens/shop/Search/reducers';
import productDetailReducers from './screens/product/product-detail/reducers';
import myCartReducers from './screens/my-cart/reducers';
import ordersReducers from './screens/my-orders/reducers';
import orderStatusReducers from './screens/my-orders/order-detail/reducers';
import settingReducer from './screens/profile/settings/reducers';
import paymentReducers from './screens/my-orders/order-detail/payment/reducers';
import messagingReducers from './screens/messaging/reducers';
import myRatingsReducers from './screens/my-ratings/reducers';
import myPointsReducers from './screens/my-profile/my-points/reducers';
import editProfileReducers from './screens/edit-profile/reducers';
import userProfileReducers from './screens/user-profile/reducers';
import notificationReducers from './screens/notification/reducers';
import bookmarkReducers from './screens/my_bookmark/reducers';
import contactUsReducers from './screens/profile/settings/contact-us/reducers';

/**
 * Root reducer
 * @type {Reducer<any> | Reducer<any, AnyAction>}
 */
const rootReducers = combineReducers({
  common: commonReducer,
  auth: authReducer,
  category: categoryReducer,
  product: productReducer,
  cart: cartReducer,
  order: orderReducer,
  vendor: vendorReducer,
  location: locationReducer,
  addProduct: addProductReducers,
  home: homeReducers,
  search: searchReducers,
  productDetail: productDetailReducers,
  myCart: myCartReducers,
  orders: ordersReducers,
  orderStatus: orderStatusReducers,
  setting: settingReducer,
  payment: paymentReducers,
  messaging: messagingReducers,
  myRatings: myRatingsReducers,
  myPoints: myPointsReducers,
  editProfile: editProfileReducers,
  userProfile: userProfileReducers,
  notification: notificationReducers,
  bookmark: bookmarkReducers,
  contactUs: contactUsReducers,
});

export default rootReducers;
