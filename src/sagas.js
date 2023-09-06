import { all } from 'redux-saga/effects';

import authSaga from './modules/auth/saga';
import categorySaga from './modules/category/saga';
import cartSaga from './modules/cart/saga';
import productSaga from './modules/product/saga';
import commonSaga from './modules/common/saga';
import orderSaga from './modules/order/saga';
import vendorSaga from './modules/vendor/saga';
import shopSaga from './screens/shop/MyShop/saga';
import locationSaga from './screens/shop/MapView/sagas';
import homeSaga from './screens/home-screen/saga';
import searchSaga from './screens/shop/Search/sagas';
import productDetailSaga from './screens/product/product-detail/sagas';
import myCartSaga from './screens/my-cart/sagas';
import myOrdersSaga from './screens/my-orders/sagas';
import orderStatusSaga from './screens/my-orders/order-detail/sagas';
import settingSaga from './screens/profile/settings/sagas';
import paymentSaga from './screens/my-orders/order-detail/payment/sagas';
import messageSaga from './screens/messaging/sagas';
import myRatingsSagas from './screens/my-ratings/sagas';
import myPointsSaga from './screens/my-profile/my-points/sagas';
import editProfileSaga from './screens/edit-profile/sagas';
import userProfileSaga from './screens/user-profile/sagas';
import notificationSaga from './screens/notification/sagas';
import myBookmarkSaga from './screens/my_bookmark/sagas';
import contactUsSaga from './screens/profile/settings/contact-us/sagas';

/**
 * Root saga
 * @returns {IterableIterator<AllEffect | GenericAllEffect<any> | *>}
 */
export default function* rootSagas() {
  yield all([commonSaga(), authSaga(), cartSaga(), categorySaga(), productSaga(), orderSaga(), vendorSaga(), shopSaga(), contactUsSaga(),
    locationSaga(), homeSaga(), searchSaga(), productDetailSaga(), myCartSaga(), myOrdersSaga(), editProfileSaga(), myBookmarkSaga(),
    orderStatusSaga(), settingSaga(), paymentSaga(), messageSaga(), myRatingsSagas(), myPointsSaga(), userProfileSaga(), notificationSaga()]);
}
