import { mainStack } from 'src/config/navigator';

import { createStackNavigator } from 'react-navigation-stack';

import HomeDrawer from './home-drawer';

import Products from 'src/screens/shop/products';
import Search from 'src/screens/shop/Search/search';
import NewProduct from 'src/screens/shop/MyShop/NewProduct/new-product';
import CategoryScreen from 'src/screens/shop/categories/CategoryScreen';

import Product from 'src/screens/shop/product';
import ProductReview from 'src/screens/shop/product-review';
import ProductReviewForm from 'src/screens/shop/product-review-form';
import ProductDescription from 'src/screens/shop/product-description';
import ProductAttribute from 'src/screens/shop/product-attribute';
import ProductDetail from 'src/screens/product/product-detail';
import CompleteOrder from 'src/screens/product/product-detail/complete-order';
import Payment from 'src/screens/my-orders/order-detail/payment';
import MyPoints from 'src/screens/my-profile/my-points';
import InviteFriend from 'src/screens/my-profile/my-points/invite-friend';
import Conversation from 'src/screens/messaging/conversation';
import MyRatings from 'src/screens/my-ratings';
import EditProfile from 'src/screens/edit-profile';
import UserProfile from 'src/screens/user-profile';
import ContactUs from 'src/screens/profile/settings/contact-us';
import MyBookmark from 'src/screens/my_bookmark';

import Refine from 'src/screens/shop/refine';
import FilterCategory from 'src/screens/shop/filter-category';
import FilterAttribute from 'src/screens/shop/filter-attribute';
import FilterTag from 'src/screens/shop/filter-tag';
import FilterPrice from 'src/screens/shop/filter-price';
import MyCart from 'src/screens/my-cart';
import OrderDetailScreen from 'src/screens/my-orders/order-detail';
import ShowAllDesigners from 'src/screens/home-screen/Designer/show-all';
import ShowAllVideos from 'src/screens/home-screen/Videos/show-all';

import Checkout from 'src/screens/cart/checkout';

import Stores from 'src/screens/shop/stores';
import StoreDetail from 'src/screens/shop/store-detail';
import StoreReview from 'src/screens/shop/store-review';

import LinkingWebview from 'src/screens/linking-webview';
import MyOrders from 'src/screens/my-orders';

export default createStackNavigator(
  {
    [mainStack.home_drawer]: HomeDrawer,
    [mainStack.products]: Products,
    [mainStack.search]: Search,
    [mainStack.new_product]: NewProduct,
    [mainStack.category]: CategoryScreen,

    [mainStack.product]: Product,
    [mainStack.product_review]: ProductReview,
    [mainStack.product_review_form]: ProductReviewForm,
    [mainStack.product_attribute]: ProductAttribute,
    [mainStack.product_description]: ProductDescription,
    [mainStack.product_detail]: ProductDetail,
    [mainStack.complete_order]: CompleteOrder,
    [mainStack.my_cart]: MyCart,
    [mainStack.my_orders]: MyOrders,
    [mainStack.order_detail]: OrderDetailScreen,
    [mainStack.show_all_designers]: ShowAllDesigners,
    [mainStack.show_all_videos]: ShowAllVideos,
    [mainStack.payment]: Payment,
    [mainStack.my_points]: MyPoints,
    [mainStack.invite_friend]: InviteFriend,
    [mainStack.conversation]: Conversation,
    [mainStack.my_ratings]: MyRatings,
    [mainStack.edit_profile]: EditProfile,
    [mainStack.user_profile]: UserProfile,
    [mainStack.contact_us]: ContactUs,
    [mainStack.my_bookmark]: MyBookmark,

    [mainStack.refine]: Refine,
    [mainStack.filter_category]: FilterCategory,
    [mainStack.filter_attribute]: FilterAttribute,
    [mainStack.filter_tag]: FilterTag,
    [mainStack.filter_price]: FilterPrice,

    [mainStack.checkout]: Checkout,

    [mainStack.store_detail]: StoreDetail,
    [mainStack.stores]: Stores,
    [mainStack.store_review]: StoreReview,

    [mainStack.linking_webview]: LinkingWebview,
  },
  {
    defaultNavigationOptions: {
      headerShown: false,
    },
  }
);
