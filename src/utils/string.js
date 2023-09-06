import React from 'react';
import { Text } from 'src/components';
import { NOTIFICATION_TYPES } from 'src/modules/common/constants';

export function fromCharCode(str) {
  if (str) {
    return str.replace(/&#(\d+);/g, (m, d) => String.fromCharCode(d));
  }
  return str;
}

export function isValidPassword(password) {
  const regEx = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
  return regEx.test(password)
}

export function isNotContainNumber(string) {
  const regEx = new RegExp('^([^0-9]*)$');
  return regEx.test(string)
}

export function isValidName(string) {
  const regEx = new RegExp(/^([^\s0-9]*)$/g);
  return regEx.test(string)
}

export function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function isNumber(string) {
  const pattern = /^\d+$/;
  return pattern.test(string)
}

export function isEqual(string1, string2) {
  return String(string1) === String(string2)
}

export function getCurrencyDisplay(currency) {
  switch (currency) {
    case 'usd':
      return '\u0024'
    case 'gbp':
      return '\u00A3'
    case 'eur':
      return '\u20AC'
    default:
      return ''
  }
}

export function getNotificationType(type) {
  if (type == 'like_product' || type == 'comment_product') {
    return 'product'
  } else if (type == 'bookmark_product' || type == 'bookmark_profile') {
    return 'profile'
  } else if (type == 'rate_user') {
    return 'rating'
  } else if (type == 'chat') {
    return 'chat'
  } else return 'order'
}

const DisplayText = ({ data }) => {
  return (<Text h4Style={{ flex: 1, }}>
    {data.map(item => <Text h4 colorSecondary bold={item.bold}>{item.text}</Text>)}
  </Text>)
}


export function getNotificationContent(t, data) {

  let displayData = []
  switch (data.type) {
    case NOTIFICATION_TYPES.LIKE_PRODUCT:
      displayData = [{ text: data.user.firstName, bold: true },
      { text: t('notifications:text_like'), bold: false },
      { text: data.product.name, bold: true }]
      break
    case NOTIFICATION_TYPES.COMMENT_PRODUCT:
      displayData = [{ text: data.user.firstName, bold: true },
      { text: t('notifications:text_comment'), bold: false },
      { text: data.product.name, bold: true }]
      break
    case NOTIFICATION_TYPES.BOOKMARK_PRODUCT:
      displayData = [{ text: data.user.firstName, bold: true },
      { text: t('notifications:text_bookmark'), bold: false },
      { text: data.product.name, bold: true }]
      break
    case NOTIFICATION_TYPES.BOOKMARK_PROFILE:
      displayData = [{ text: data.user.firstName, bold: true },
      { text: t('notifications:text_bookmark_profile'), bold: false }]
      break
    case NOTIFICATION_TYPES.RENT_REQUEST:
    case NOTIFICATION_TYPES.DONATION_REQUEST:
    case NOTIFICATION_TYPES.BUY_REQUEST:
      displayData = [{ text: data.user.firstName, bold: true },
      { text: t('notifications:text_transaction_request'), bold: false },
      { text: data.product.name, bold: true },
      { text: t('notifications:text_view_details'), bold: false },]
      break
    case NOTIFICATION_TYPES.RENT_REQUEST_CONFIRMED:
    case NOTIFICATION_TYPES.DONATION_REQUEST_CONFIRMED:
    case NOTIFICATION_TYPES.BUY_REQUEST_CONFIRMED:
      displayData = [{ text: t('notifications:text_transaction_confirmed_1'), bold: false },
      { text: data.product.name, bold: true },
      { text: t('notifications:text_transaction_confirmed_2'), bold: false },
      { text: t('notifications:text_view_details'), bold: false },]
      break
    case NOTIFICATION_TYPES.RENT_SELLER_CANCELLED:
    case NOTIFICATION_TYPES.DONATION_SELLER_CANCELLED:
    case NOTIFICATION_TYPES.BUY_SELLER_CANCELLED:
      displayData = [
        { text: data.user.firstName, bold: true },
        { text: t('notifications:text_transaction_cancelled_seller'), bold: false },
        { text: data.product.name, bold: true },]
      break
    case NOTIFICATION_TYPES.RENT_BUYER_CANCELLED:
    case NOTIFICATION_TYPES.DONATION_BUYER_CANCELLED:
    case NOTIFICATION_TYPES.BUY_BUYER_CANCELLED:
      displayData = [
        { text: data.user.firstName, bold: true },
        { text: t('notifications:text_transaction_cancelled_buyer'), bold: false },
        { text: data.product.name, bold: true },]
      break
    case NOTIFICATION_TYPES.RENT_BUYER_PAID:
    case NOTIFICATION_TYPES.DONATION_BUYER_PAID:
    case NOTIFICATION_TYPES.BUY_BUYER_PAID:
      displayData = [
        { text: data.user.firstName, bold: true },
        { text: t('notifications:text_transaction_paid_1'), bold: false },
        { text: data.product.name, bold: true },
        { text: t('notifications:text_view_details'), bold: false },]
      break
    case NOTIFICATION_TYPES.RENT_SELLER_SENT_ITEM:
    case NOTIFICATION_TYPES.DONATION_SELLER_SENT_ITEM:
    case NOTIFICATION_TYPES.BUY_SELLER_SENT_ITEM:
      displayData = [
        { text: data.product.name, bold: true },
        { text: t('notifications:text_transaction_sent'), bold: false },
        { text: data.user.firstName, bold: true },
        { text: t('notifications:text_view_details'), bold: false },]
      break
    case NOTIFICATION_TYPES.DONATION_BUYER_RECEIVED_ITEM:
    case NOTIFICATION_TYPES.BUY_BUYER_RECEIVED_ITEM:
      displayData = [{ text: data.product.name, bold: true },
      { text: t('notifications:text_transaction_received'), bold: false },
      { text: data.user.firstName, bold: true },
      { text: t('notifications:text_view_details'), bold: false },]
      break
    case NOTIFICATION_TYPES.RENT_BUYER_RECEIVED_ITEM:
      displayData = [
        { text: t('notifications:text_transaction_rental_1'), bold: false },
        { text: data.product.name, bold: true },
        { text: t('notifications:text_transaction_received_2'), bold: false },
        { text: t('notifications:text_view_details'), bold: false },]
      break
    case NOTIFICATION_TYPES.RENTAL_PERIOD_ENDS:
      displayData = [
        { text: t('notifications:text_transaction_rental_1'), bold: false },
        { text: data.product.name, bold: true },
        { text: t('notifications:text_transaction_rental_2'), bold: false },
        { text: t('notifications:text_view_details'), bold: false },]
      break
    case NOTIFICATION_TYPES.RENT_BUYER_RETURN_ITEM:
      displayData = [{ text: data.product.name, bold: true },
      { text: t('notifications:text_transaction_return'), bold: false },
      { text: data.user.firstName, bold: true },
      { text: t('notifications:text_view_details'), bold: false },]
      break
    case NOTIFICATION_TYPES.RENT_SELLER_RECEIVED_ITEM:
      displayData = [{ text: data.product.name, bold: true },
      { text: t('notifications:text_transaction_received'), bold: false },
      { text: data.user.firstName, bold: true },
      { text: t('notifications:text_view_details'), bold: false },]
      break
    case NOTIFICATION_TYPES.RENT_REQUEST_EXTRA_FEE:
      displayData = [{ text: t('notifications:text_transaction_extra_fee'), bold: false },
      { text: data.product.name, bold: true },
      { text: t('notifications:text_view_details'), bold: false },]
      break
    case NOTIFICATION_TYPES.ORDER_COMPLETED:
      displayData = [{ text: t('notifications:text_transaction_completed'), bold: false },
      { text: data.user.firstName, bold: true },]
      break
    case NOTIFICATION_TYPES.RATE_USER:
      displayData = [{ text: data.user.firstName, bold: true },
      { text: t('notifications:text_transaction_rated'), bold: false },
      ]
  }
  return <DisplayText data={displayData} />
}

export const getTransaction = (type, t) => {
  switch (type) {
    case 'Rent':
    case 'rent':
      return t('shop:text_rent')
    case 'Buy-out':
    case 'Buy':
    case 'buy':
      return t('shop:text_buy_out')
    case 'Donation':
    case 'donation':
      return t('shop:text_donation')
    default:
      break;
  }
}

export const getDeliveryType = (type, t) => {
  switch (type) {
    case 'hand':
    case 'By hand':
    case 'by hand':
      return t('setting:text_hand')
    case 'courier':
    case 'By courier':
    case 'by courier':
      return t('setting:text_courier')
    default:
      break;
  }
}

export const getParent = (name, t) => {
  switch (name) {
    case 'Clothing':
      return t('categories:text_clothing')
    case 'Accessories':
      return t('categories:text_accessories')
    case 'Shoes':
      return t('categories:text_shoes')
    case 'Women':
      return t('categories:text_women')
    case 'Men':
      return t('categories:text_men')
    case 'Kids':
      return t('categories:text_kids')
    case 'Girls':
      return t('categories:text_girls')
    case 'Boys':
      return t('categories:text_boys')
    case 'Baby':
      return t('categories:text_baby')
    case 'Seasonal':
      return t('categories:text_seasonal')
    case 'Designer Only':
      return t('home:text_designer_only')
    default:
      break;
  }
}

export const getDurationPref = (pref, t) => {
  switch (pref) {
    case 'day(s)':
      return t('orders:text_days')
    case 'week(s)':
      return t('orders:text_weeks')
    case 'month(s)':
      return t('orders:text_months')
  }
}

export const getTitle = (name, t) => {
  switch (name) {
    case 'Accessories':
      return t('categories:text_accessories')
    case 'Wedding Dress':
      return t('categories:text_wedding_dress')
    case 'Dress':
      return t('categories:text_dress')
    case 'Suits':
      return t('categories:text_suits')
    case 'Jeans':
      return t('categories:text_jeans')
    case 'Tops':
      return t('categories:text_tops')
    case 'Coats':
      return t('categories:text_coats')
    case 'Hoodies':
      return t('categories:text_hoodies')
    case 'Jumpers':
      return t('categories:text_jumpers')
    case 'Shorts':
      return t('categories:text_shorts')
    case 'Skirts':
      return t('categories:text_skirts')
    case 'Jumpsuits':
      return t('categories:text_jumpsuits')
    case 'Lingerie':
      return t('categories:text_lingerie')
    case 'Trousers':
      return t('categories:text_trousers')
    case 'Socks':
      return t('categories:text_socks')
    case 'Pyjamas':
      return t('categories:text_pyjamas')
    case 'Sportwear':
      return t('categories:text_sportwears')
    case 'Swimwear':
      return t('categories:text_swimwear')
    case 'Maternity':
      return t('categories:text_maternity')
    case 'Sunglasses':
      return t('categories:text_sunglasses')
    case 'Bags & Purses':
      return t('categories:text_bags_and_purse')
    case 'Belts':
      return t('categories:text_belts')
    case 'Hats':
      return t('categories:text_hats')
    case 'Gloves':
      return t('categories:text_gloves')
    case 'Jewellery':
      return t('categories:text_jewellery')
    case 'Boots':
      return t('categories:text_boots')
    case 'Heels':
      return t('categories:text_heels')
    case 'Sandals':
      return t('categories:text_sandals')
    case 'Sneakers':
      return t('categories:text_sneakers')
    case 'Ballerinas':
      return t('categories:text_ballerinas')
    case 'Slippers':
      return t('categories:text_slippers')
    case 'Tshirts':
      return t('categories:text_tshirts')
    case 'Shirts':
      return t('categories:text_shirts')
    case 'Sports':
      return t('categories:text_sports')
    case 'Grooming':
      return t('categories:text_grooming')
    case 'Hats, Gloves and Scarves':
      return t('categories:text_hats_gloves_scarves')
    case 'Watches':
      return t('categories:text_watches')
    case 'Bags':
      return t('categories:text_bags')
    case 'Oxford':
      return t('categories:text_oxford')
    case 'Espadrilles':
      return t('categories:text_espadrilles')
    case 'Slip-Ons':
      return t('categories:text_slip_ons')
    case 'Trainers':
      return t('categories:text_trainers')
    case '2 to 7 Boyswear':
      return t('categories:text_2_to_7_boyswear')
    case '2 to 7 Girlswear':
      return t('categories:text_2_to_7_girlswear')
    case 'Baby Boy':
      return t('categories:text_baby_boy')
    case 'Baby Girl':
      return t('categories:text_baby_girl')
    case 'Boys Over 7':
      return t('categories:text_boys_over_7')
    case 'Boys Over 12':
      return t('categories:text_boys_over_12')
    case 'Boys Shoes':
      return t('categories:text_boys_shoes')
    case 'Girls Over 7':
      return t('categories:text_girls_over_7')
    case 'Girls Over 12':
      return t('categories:text_girls_over_12')
    case 'Girls Shoes':
      return t('categories:text_girls_shoes')
    case 'Kids Accessories':
      return t('categories:text_kidsccessories')
    default:
      break;
  }
}