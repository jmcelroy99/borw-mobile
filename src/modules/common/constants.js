export const DARK = 'dark';
export const LIGHT = 'light';
export const DEFAULT_LANGUAGE_CODE = 'en';
export const DEFAULT_CURRENCY = 'USD';
export const PRODUCT_VIEW_STYLE_1 = 'style1';
export const PRODUCT_VIEW_STYLE_2 = 'style2';

export const LIST_SWITCH_PRODUCT = [
  {
    icon: 'grid',
    view: PRODUCT_VIEW_STYLE_1,
    col: 2,
  },
  {
    icon: 'square',
    view: PRODUCT_VIEW_STYLE_2,
    col: 1,
  },
];

// [Final payment] - [Stripe fee] = [Amount needed]
// => [Final payment] - 2.9% x  [Amount Buyer pay]  - 0.3 = [Amount needed]
// => [Final payment] x (1 -2.9%) = [Amount needed] + 0.3
// => [Final payment] x 0.971 = [Amount needed] + 0.3
// => [Final payment] = ( [Amount needed] + 0.3 ) / 0.971

export const FORMULAS_CONSTANTS = {
  STRIPE_FEE_PERCENTAGE: 0.029,
  STRIPE_FEE_AMOUNT: 0.3,
  STRIPE_CONSTANCE: 0.971,
  PERCENTAGE_FOR_SELLER: 0.9,                   //For every transactions, seller will get 90% of the order value.
  DELIVERY_FEE: 1.1                             //Borw will take 10% for any transaction, so we need to markup delivery fee by 10%.
}

export const DISTANCE_CONSTANTS = {
  DISTANCE_FEE: 2,                              //Delivery fee for each distance unit
  MINIMUM_DELIVERY_FEE: 5,
  MAXIMUM_DELIVERY_FEE: 12,
}

export const DELIVERY_METHODS = {
  BY_HAND: 'hand',
  BY_COURIER: 'courier'
}

export const ORDER_TRANSACTION_TYPES = {
  BUY: 'buy',
  RENT: 'rent',
  DONATION: 'donation',
}

export const MAXIMUM_REDEEM_CODE = 6

export const SWITCH_MODE = 'common/SWITCH_MODE';
export const SWITCH_PRODUCT_VIEW = 'common/SWITCH_PRODUCT_VIEW';
export const CHANGE_CURRENCY = 'common/CHANGE_CURRENCY';
export const CHANGE_LANGUAGE = 'common/CHANGE_LANGUAGE';
export const CHANGE_TEMPLATE = 'common/CHANGE_TEMPLATE';

export const FETCH_SETTING_SUCCESS = 'common/FETCH_SETTING_SUCCESS';

export const FETCH_COUNTRY = 'common/FETCH_COUNTRY';
export const FETCH_COUNTRY_SUCCESS = 'common/FETCH_COUNTRY_SUCCESS';
export const FETCH_COUNTRY_ERROR = 'common/FETCH_COUNTRY_ERROR';

export const FETCH_PAYMENT_GATEWAYS = 'common/FETCH_PAYMENT_GATEWAYS';
export const FETCH_PAYMENT_GATEWAYS_SUCCESS = 'common/FETCH_PAYMENT_GATEWAYS_SUCCESS';
export const FETCH_PAYMENT_GATEWAYS_ERROR = 'common/FETCH_PAYMENT_GATEWAYS_ERROR';

export const FETCH_SHIPPING_METHOD_NOT_COVER_BY_ZONE = 'common/FETCH_SHIPPING_METHOD_NOT_COVER_BY_ZONE';
export const FETCH_SHIPPING_METHOD_NOT_COVER_BY_ZONE_SUCCESS = 'common/FETCH_SHIPPING_METHOD_NOT_COVER_BY_ZONE_SUCCESS';
export const FETCH_SHIPPING_METHOD_NOT_COVER_BY_ZONE_ERROR = 'common/FETCH_SHIPPING_METHOD_NOT_COVER_BY_ZONE_ERROR';

export const ADD_WISHLIST = 'product/ADD_WISHLIST';
export const REMOVE_WISHLIST = 'product/REMOVE_WISHLIST';

export const CLOSE_GETTING_STARTED = 'common/CLOSE_GETTING_STARTED';


export const AVATAR_DEFAULT = 'https://placeimg.com/140/140/any'

export const NOTIFICATION_TYPES = {
  LIKE_PRODUCT: "like_product",
  COMMENT_PRODUCT: "comment_product",
  BOOKMARK_PRODUCT: "bookmark_product",
  BOOKMARK_PROFILE: "bookmark_profile",
  RENT_REQUEST: "rent_request",
  RENT_REQUEST_CONFIRMED: "rent_request_confirmed",
  RENT_SELLER_CANCELLED: "rent_seller_cancelled",
  RENT_BUYER_CANCELLED: "rent_buyer_cancelled",
  RENT_BUYER_PAID: "rent_buyer_paid",
  RENT_SELLER_SENT_ITEM: "rent_seller_sent_item",
  RENT_BUYER_RECEIVED_ITEM: "rent_buyer_received_item",
  RENTAL_PERIOD_STARTS: "rental_period_starts",
  RENTAL_PERIOD_ENDS: "rental_period_ends",
  RENT_BUYER_RETURN_ITEM: "rent_buyer_return_item",
  RENT_SELLER_RECEIVED_ITEM: "rent_seller_received_item",
  RENT_REQUEST_EXTRA_FEE: "rent_request_extra_fee",
  RENT_BUYER_PAID_EXTRA_FEE: "rent_buyer_paid_extra_fee",
  RATE_USER: "rate_user",

  DONATION_REQUEST: "donation_request",
  DONATION_REQUEST_CONFIRMED: "donation_request_confirmed",
  DONATION_SELLER_CANCELLED: "donation_seller_cancelled",
  DONATION_BUYER_CANCELLED: "donation_buyer_cancelled",
  DONATION_BUYER_PAID: "donation_buyer_paid",
  DONATION_SELLER_SENT_ITEM: "donation_seller_sent_item",
  DONATION_BUYER_RECEIVED_ITEM: "donation_buyer_received_item",

  BUY_REQUEST: "buy_request",
  BUY_REQUEST_CONFIRMED: "buy_request_confirmed",
  BUY_SELLER_CANCELLED: "buy_seller_cancelled",
  BUY_BUYER_CANCELLED: "buy_buyer_cancelled",
  BUY_BUYER_PAID: "buy_buyer_paid",
  BUY_SELLER_SENT_ITEM: "buy_seller_sent_item",
  BUY_BUYER_RECEIVED_ITEM: "buy_buyer_received_item",

  ORDER_COMPLETED: "order_completed",
}