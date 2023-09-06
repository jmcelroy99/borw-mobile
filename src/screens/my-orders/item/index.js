import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'src/components';
import FastImage from 'react-native-fast-image';
import { margin, padding } from 'src/components/config/spacing';
import getStatusFromCode from 'src/utils/status-orders';
import moment from 'moment';
import * as colors from 'src/components/config/colors';
import * as formula from 'src/utils/formulas';
import { images } from 'src/utils/images';
import { getCurrencyDisplay } from 'src/utils/string';
import { ORDER_TRANSACTION_TYPES, DELIVERY_METHODS } from 'src/modules/common/constants';
import { ORDER_STATUS } from 'src/utils/status-orders';
import { getTransaction } from 'src/utils/string';
import { isVideo } from 'src/utils/func';
import Video from 'react-native-video';

export default function ItemOrder({ item, t, _onNavigateOrderDetail }) {
  const type = item.type
  if (item.buyer && item.ownerId == item.buyer.id) {
    return null
  }

  const isRent = item.transaction == ORDER_TRANSACTION_TYPES.RENT
  const rentalPrice = parseFloat(formula.getFinalPrice(item.rentalPrice))
  const delivery = item.transaction == ORDER_TRANSACTION_TYPES.DONATION && item.deliveryType == DELIVERY_METHODS.BY_COURIER ?
    parseFloat(formula.getFinalPriceForDeliveryForDonation(item.deliveryCost)) :
    parseFloat(formula.getFinalPriceForDelivery(item.deliveryCost))
  const createdAt = item.createdAt ? moment(item.createdAt).format('ll') : ''
  const currency = item && item.currency ? getCurrencyDisplay(item.currency) : getCurrencyDisplay('')

  let subTotal = 0.00
  if (item && item.product && item.product.rentDuration) {
    const durationTime = parseInt(item.durationTime)
    const rentPref = parseInt(item.product.rentDuration.split('|')[0])
    if (item.transaction != ORDER_TRANSACTION_TYPES.DONATION) {
      if (item.transaction == ORDER_TRANSACTION_TYPES.RENT) {
        if (durationTime % rentPref == 0) {
          const temp = durationTime / rentPref
          subTotal = temp * rentalPrice
        } else {
          subTotal = durationTime * (rentalPrice / rentPref)
        }
      } else {
        subTotal = parseFloat(formula.getFinalPriceForBuyOut(item.price))
      }
    }
  }

  const status = (item) => {
    if (item.cancelled) {
      return 'Order cancelled'
    } else if (item.completed) {
      return 'Order completed'
    } else {
      return getStatusFromCode(item.passedSteps[item.passedSteps.length - 1].split('|')[0], t)
    }
  }

  const name = () => {
    if (type == 'outgoing') {
      return item.buyer ? item.buyer.firstName + ' ' + item.buyer.lastName : ''
    }
    if (type == 'incoming') {
      return item.seller ? item.seller.firstName + ' ' + item.seller.lastName : ''
    }
  }

  const isRequire = () => {
    const lastStep = item.passedSteps[item.passedSteps.length - 1].split('|')[0]
    if (item.cancelled || item.completed) {
      return false
    }
    if (lastStep && item.type == 'incoming') {
      if (lastStep == ORDER_STATUS.SENT_FROM_SELLER) return true
      if (item.transaction == ORDER_TRANSACTION_TYPES.DONATION && item.deliveryType == DELIVERY_METHODS.BY_COURIER && lastStep == ORDER_STATUS.SELLER_CONFIRMED) return true
      if (item.transaction == ORDER_TRANSACTION_TYPES.RENT && (
        lastStep == ORDER_STATUS.SELLER_CONFIRMED ||
        lastStep == ORDER_STATUS.RECEIVED_BY_BUYER ||
        lastStep == ORDER_STATUS.REQUEST_EXTRA_FEE
      )) return true
    } else if (lastStep && item.type == 'outgoing') {
      if (lastStep == ORDER_STATUS.WAITING) return true

      if (item.transaction == ORDER_TRANSACTION_TYPES.DONATION &&
        lastStep == ORDER_STATUS.SELLER_CONFIRMED ||
        (item.deliveryType == DELIVERY_METHODS.BY_COURIER && lastStep == ORDER_STATUS.PAYED_BY_BUYER)) return true

      if (item.transaction == ORDER_TRANSACTION_TYPES.RENT &&
        (lastStep == ORDER_STATUS.PAYED_BY_BUYER ||
          lastStep == ORDER_STATUS.RETURNED_FROM_BUYER ||
          lastStep == ORDER_STATUS.RECEIVED_BY_SELLER)) return true

      if (item.transaction == ORDER_TRANSACTION_TYPES.BUY && lastStep == ORDER_STATUS.SELLER_CONFIRMED) return true
    }
    return false
  }

  if (item) {
    let itemPhotoUrl = item.product && item.product.photos ? item.product.photos[0] : '';
    return (
      <TouchableOpacity style={styles.container} onPress={_onNavigateOrderDetail}>
        <View style={styles.containerHeader}>
          <FastImage
            style={styles.avatar}
            source={item.seller && item.seller.avatar ? { uri: item.seller.avatar, priority: FastImage.priority.normal } :
              item.buyer && item.buyer.avatar ? { uri: item.buyer.avatar, priority: FastImage.priority.normal } :
                images.person}
            resizeMode={FastImage.resizeMode.cover}
          />
          <Text h5 colorSecondary numberOfLines={1} ellipsizeMode="tail" style={styles.name}>{name()}</Text>
          <Text h5
            colorSecondary
            colorThird={isRequire()}
            third={{ color: colors.red }}
            style={{ marginStart: margin.small }}>{status(item)}</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.containerImage}>
            { !isVideo(itemPhotoUrl) ?<FastImage
              style={styles.image}
              source={{
                uri: item.product && item.product.photos ? item.product.photos[0] : '',
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            /> : <Video
              source={{uri: itemPhotoUrl}}
              style={styles.image}
              resizeMode="cover"
              repeat={true}
              muted={true}
              />
            }
          </View>

          <View style={styles.info}>
            <Text h4 colorSecondary bold>{item.product.name}</Text>
            <Text h6 colorSecondary>{t('orders:text_order_created_at')} {createdAt}</Text>
            {isRent && <View style={styles.element}>
              <Text style={{ flex: 1 }} h6 colorSecondary>{t('shop:text_rental_price')}
              </Text>
              <Text h6 colorSecondary>{currency}{subTotal.toFixed(2)}</Text>
            </View>}
            <View style={styles.element}>
              <Text style={{ flex: 1 }} h6 colorSecondary>{t('cart:text_delivery')} {t('common:text_by')} {item.deliveryType}</Text>
              {item.deliveryType == DELIVERY_METHODS.BY_COURIER && <Text h6 colorSecondary>{currency}{delivery}</Text>}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text h4 colorSecondary style={styles.transaction}>{getTransaction(item.transaction, t)}</Text>
          <Text h5 colorSecondary style={{ textAlign: 'right' }}>{currency}{(subTotal + delivery).toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    )
  } else return null
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.border_color,
    marginHorizontal: margin.base,
    marginVertical: margin.small,
    padding: padding.base
  },
  containerImage: {
    width: 100,
    height: 100,
    alignContent: 'center',
    textAlign: 'center'
  },
  containerHeader: {
    flexDirection: 'row',
    marginBottom: margin.base,
    alignItems: 'center'
  },
  info: {
    flex: 1,
    marginStart: margin.base
  },
  transaction: {
    textAlign: 'left',
    flex: 1,
    marginStart: margin.base
  },
  name: {
    textAlign: 'left',
    marginStart: margin.small,
    flex: 1
  },
  body: {
    flexDirection: 'row'
  },
  footer: {
    flexDirection: 'row',
    marginTop: margin.base,
    alignItems: 'center'
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  element: {
    alignSelf: 'stretch',
    flexDirection: 'row'
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8
  }
})