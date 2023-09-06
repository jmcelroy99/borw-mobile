import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'src/components';
import { padding, margin } from 'src/components/config/spacing';
import * as colors from 'src/components/config/colors';
import Icon from 'src/components/icons/Icon';
import Button from 'src/containers/Button';
import { ORDER_STATUS_CODES } from 'src/utils/status-orders';
import { useOrderActionsFacade } from './hooks';
import { sizes } from 'src/components/config/fonts';
import { icon } from 'src/utils/images';
import { DELIVERY_METHODS } from 'src/modules/common/constants';

export default function OrderActions({ orderDetail, shouldPropose, t, _onCancelOrder,
  _onUpdateStatusOrder, isSeller, _onNavigatePayment, _onPurchaseExtraFee, currency,
  _onCompleteOrder, _onUploadImages, _onGetImagesOrderForSeller, _onNavigateMessage,
  _onGetImagesOrderForBuyer, _onRating, _onProposeExtraFee, _onShowMoreDesc }) {

  const { seller, buyer, lastAction,
    transaction, isCompleted, countDownTimer } = useOrderActionsFacade(orderDetail, _onGetImagesOrderForSeller, _onGetImagesOrderForBuyer, t);

  const remainInsurance = orderDetail.product.price - orderDetail.extraFees
  const deliveryType = orderDetail.deliveryType

  if (orderDetail.cancelled) {
    return (
      <View style={[styles.container, { flexDirection: 'row' }]}>
        <Text h4 colorSecondary>{t('orders:text_cancelled_order')}</Text>
      </View>
    )
  }

  if (isCompleted) {
    if (isSeller && isCompleted) {
      if (transaction == 'rent') {
        return (
          <View style={styles.container}>
            <View style={[styles.title, { marginBottom: 0 }]}>
              <Icon containerStyle={{ marginEnd: margin.small }} name='check-circle-outline' type='material-community' size={28} color={colors.text_color} />
              <Text h3 colorSecondary bold>{t('actions:text_order_completed')}</Text>
            </View>

            <View style={{ alignItems: 'flex-start', alignSelf: 'stretch', paddingStart: padding.big * 2 }}>
              <Text colorSecondary h4>. {t('orders:text_extra_fee')} : {currency}{orderDetail.extraFees}</Text>
              <Text colorSecondary h4>. {t('orders:text_refund_insurance')} : {currency}{remainInsurance}</Text>
            </View>

            {!orderDetail.rated && <View style={styles.buttons}>
              <Button
                buttonStyle={{ backgroundColor: colors.selIcon }}
                titleStyle={{ color: colors.black }}
                onPress={() => _onRating(orderDetail.id, ORDER_STATUS_CODES[9])}
                size='normal' containerStyle={{ flex: 1, }} title={t('actions:text_rate_partner')} />
            </View>}
          </View>
        )
      } else return (
        <View style={styles.container}>
          <View style={[styles.title, { marginBottom: 0 }]}>
            <Icon containerStyle={{ marginEnd: margin.small }} name='check-circle-outline' type='material-community' size={28} color={colors.text_color} />
            <Text h3 colorSecondary bold>{t('actions:text_order_completed')}</Text>
          </View>
        </View>
      )
    } else if (!isSeller && isCompleted) {
      return (
        <View style={styles.container}>
          <View style={[styles.title, { marginBottom: 0 }]}>
            <Icon containerStyle={{ marginEnd: margin.small }} name='check-circle-outline' type='material-community' size={28} color={colors.text_color} />
            <Text h3 colorSecondary bold>{t('actions:text_order_completed')}</Text>
          </View>

          {transaction == 'rent' && <View style={{ alignItems: 'flex-start', alignSelf: 'stretch', paddingStart: padding.big * 2 }}>
            <Text colorSecondary h4>. {t('orders:text_extra_fee')} : {currency}{orderDetail.extraFees}</Text>
            <Text colorSecondary h4>. {t('orders:text_refund_insurance')} {currency}{remainInsurance}</Text>
          </View>}

          {!orderDetail.rated && <View style={styles.buttons}>
            <Button
              buttonStyle={{ backgroundColor: colors.selIcon }}
              titleStyle={{ color: colors.black }}
              onPress={() => _onRating(orderDetail.id, ORDER_STATUS_CODES[8])}
              size='normal' containerStyle={{ flex: 1, }} title={t('actions:text_rate_partner')} />
          </View>}
        </View>
      )
    }
  }

  if (!isSeller) {
    if (lastAction == 'waiting') {
      return (
        <View style={[styles.container, { flexDirection: 'row' }]}>
          <Image source={icon.waiting} style={styles.waiting} resizeMode='cover' />
          <Text h4 colorSecondary>{t('actions:text_waiting_seller_confirm')}</Text>
        </View>
      )
    } else if (lastAction == 'seller_confirmed' || lastAction == 'payed_by_buyer') {
      if (transaction == 'donation' && lastAction == 'seller_confirmed' && deliveryType == 'hand') {
        return (
          <View style={[styles.container, { flexDirection: 'row' }]}>
            <Image source={icon.waiting} style={styles.waiting} resizeMode='cover' />
            <Text h4 colorSecondary>{t('actions:text_waiting_seller_sent', { seller: seller.firstName })}</Text>
          </View>
        )
      } else if (transaction == 'donation' && lastAction == 'seller_confirmed' && deliveryType == DELIVERY_METHODS.BY_COURIER) {
        return (
          <View style={styles.container}>
            <View style={styles.title}>
              <Text h4 colorSecondary>{t('actions:text_action_payment', { seller: seller.firstName })}</Text>
            </View>
            <View style={styles.buttons}>
              <Button
                buttonStyle={{ backgroundColor: colors.selIcon }}
                titleStyle={{ color: colors.black }}
                onPress={() => _onNavigatePayment()}
                size='normal' containerStyle={{ flex: 1, }} title={t('actions:text_proceed_payment')} />
            </View>
          </View>
        )
      } else if (lastAction == 'payed_by_buyer') {
        return (
          <View style={[styles.container, { flexDirection: 'row' }]}>
            <Image source={icon.waiting} style={styles.waiting} resizeMode='cover' />
            <Text h4 colorSecondary>{t('actions:text_waiting_seller_sent_for_rent')}</Text>
          </View>
        )
      } else {
        return (
          <View style={styles.container}>
            <View style={styles.title}>
              <Text h4 colorSecondary>{t('actions:text_action_payment', { seller: seller.firstName })}</Text>
            </View>
            <View style={styles.buttons}>
              <Button
                buttonStyle={{ backgroundColor: colors.selIcon }}
                titleStyle={{ color: colors.black }}
                onPress={() => _onNavigatePayment()}
                size='normal' containerStyle={{ flex: 1, }} title={t('actions:text_proceed_payment')} />
            </View>
          </View>
        )
      }
    } else if (lastAction == 'waiting' && transaction == 'donation') {
      return (
        <View style={[styles.container, { flexDirection: 'row' }]}>
          <Image source={icon.waiting} style={styles.waiting} resizeMode='cover' />
          <Text>{t('actions:text_waiting_seller_confirm')}</Text>
        </View>
      )
    } else if (lastAction == 'sent_from_seller') {
      return (
        <View style={styles.container}>
          <View style={styles.title}>
            <View>
              <Text h4 colorSecondary>{t('actions:text_ask_confirm_receive', { seller: seller.firstName })}</Text>
            </View>

          </View>
          <View style={styles.buttons}>
            <Button
              buttonStyle={{ backgroundColor: colors.selIcon }}
              titleStyle={{ color: colors.black }}
              onPress={() => _onUploadImages(orderDetail.id, ORDER_STATUS_CODES[3])}
              size='normal' containerStyle={{ flex: 1, }} title={t('actions:text_confirm_receive')} />
          </View>
        </View>
      )
    } else if (lastAction == 'received_by_buyer' && transaction == 'rent') {
      if (countDownTimer) {
        return (
          <View style={styles.container}>
            <View style={styles.title}>
              <Text h4 colorSecondary>{t('actions:text_time_left')} {countDownTimer}</Text>
            </View>
          </View>
        )
      } else {
        return (
          <View style={styles.container}>
            <View style={styles.title}>
              <View>
                <Text h4 colorSecondary>{t('actions:text_ask_confirm_returned')}</Text>
              </View>
            </View>
            <View style={styles.buttons}>
              <Button
                buttonStyle={{ backgroundColor: colors.selIcon }}
                titleStyle={{ color: colors.black }}
                onPress={() => _onUploadImages(orderDetail.id, ORDER_STATUS_CODES[4])}
                size='normal' containerStyle={{ flex: 1, }} title={t('actions:text_confirm_returned')} />
            </View>
          </View>
        )
      }
    } else if (lastAction == 'received_by_buyer' && transaction == 'buy') {
      return (
        <View style={[styles.container, { flexDirection: 'row' }]}>
          <Image source={icon.waiting} style={styles.waiting} resizeMode='cover' />
          <Text h4 colorSecondary>{t('actions:text_waiting_seller_completed')}</Text>
        </View>
      )
    }
    else if (lastAction == 'returned_from_buyer') {
      return (
        <View style={[styles.container, { flexDirection: 'row' }]}>
          <Image source={icon.waiting} style={styles.waiting} resizeMode='cover' />
          <Text>{t('actions:text_waiting_seller_received', { seller: seller.firstName })}</Text>
        </View>
      )
    } else if (lastAction == 'received_by_seller' && !isCompleted) {
      return (
        <View style={[styles.container, { flexDirection: 'row' }]}>
          <Image source={icon.waiting} style={styles.waiting} resizeMode='cover' />
          <Text h4 colorSecondary>{t('actions:text_waiting_seller_completed')}</Text>
        </View>
      )
    } else if (lastAction == 'request_extra_fee') {
      return (
        <View style={[styles.container, { alignItems: 'flex-start' }]}>
          <View style={{ alignSelf: 'stretch' }}>
            <Text h4 colorSecondary>{t('actions:text_seller_requested_extra_fee_1', { seller: seller.firstName })}</Text>
            <Text h4 colorSecondary>     . {t('actions:text_amount')}{currency}{orderDetail.extraFees}</Text>
            {orderDetail && !!orderDetail.extraFeeNotes && orderDetail.extraFeeNotes != '' && <View style={{ flexDirection: 'row', marginEnd: margin.big * 2.5 }}>
              <Text h4 colorSecondary numberOfLines={1} ellipsizeMode='tail'>     . {t('actions:text_reason')}{orderDetail.extraFeeNotes}</Text>
              <Text style={{ textDecorationLine: 'underline', color: colors.selIcon, marginStart: margin.small, fontSize: sizes.h5 }} onPress={() => _onShowMoreDesc()}>
                {t('product:text_view_more')}</Text>
            </View>}
          </View>

          <View style={styles.buttons}>
            <Button
              buttonStyle={{ backgroundColor: colors.selIcon }}
              titleStyle={{ color: colors.black }}
              onPress={() => _onPurchaseExtraFee()}
              size='normal' containerStyle={{ flex: 0.45, }} title={t('actions:text_accept')} />
            <Button
              buttonStyle={{ backgroundColor: colors.selIcon }}
              titleStyle={{ color: colors.black }}
              onPress={() => _onNavigateMessage()}
              size='normal' containerStyle={{ flex: 0.45, }} title={t('actions:text_message')} />
          </View>
        </View >
      )
    } else return null
  } else {
    if (lastAction == 'waiting') {
      return (
        <View style={styles.container}>
          <View style={styles.title}>
            <View>
              <Text h4 colorSecondary>{t('actions:text_ask_for_order', { buyer: buyer.firstName })}</Text>
            </View>

          </View>
          <View style={styles.buttons}>
            <Button
              buttonStyle={{ backgroundColor: colors.selIcon }}
              titleStyle={{ color: colors.black }}
              onPress={() => _onUpdateStatusOrder(ORDER_STATUS_CODES[0], orderDetail.id)}
              size='normal' containerStyle={styles.button} title={t('actions:text_confirm_order')} />
            <Button
              buttonStyle={{ backgroundColor: colors.selIcon }}
              titleStyle={{ color: colors.black }}
              onPress={() => _onCancelOrder(orderDetail.id)}
              containerStyle={styles.button}
              title={t('actions:text_cancel_order')} />
          </View>
        </View>
      )
    } else if (lastAction == 'seller_confirmed' || lastAction == 'payed_by_buyer') {
      if ((transaction == 'donation' && lastAction == 'seller_confirmed' && deliveryType == DELIVERY_METHODS.BY_HAND) ||
        (transaction == 'donation' && lastAction == 'payed_by_buyer' && deliveryType == DELIVERY_METHODS.BY_COURIER) ||
        ((transaction == 'rent' || transaction == 'buy') && lastAction == 'payed_by_buyer')) {
        return (
          <View style={styles.container}>
            <View style={styles.title}>
              <View>
                <Text h4 colorSecondary>{t('actions:text_ask_confirm_send')}</Text>
              </View>
            </View>
            <View style={styles.buttons}>
              <Button
                buttonStyle={{ backgroundColor: colors.selIcon }}
                titleStyle={{ color: colors.black }}
                onPress={() => _onUploadImages(orderDetail.id, ORDER_STATUS_CODES[2])}
                size='normal' containerStyle={{ flex: 1, }} title={t('actions:text_confirm_send')} />
            </View>
          </View>
        )
      } else {
        return (
          <View style={[styles.container, { flexDirection: 'row' }]}>
            <Image source={icon.waiting} style={styles.waiting} resizeMode='cover' />
            <Text h4 colorSecondary>{t('actions:text_waiting_buyer_paid', { buyer: buyer.firstName })}</Text>
          </View>
        )
      }
    } else if (lastAction == 'sent_from_seller') {
      return (
        <View style={styles.container}>
          <View style={styles.title}>
            <Image source={icon.waiting} style={styles.waiting} resizeMode='cover' />
            <Text h4 colorSecondary h4Style={{ color: colors.white }} >{t('actions:text_waiting_buyer_confirm')}</Text>
          </View>
        </View>
      )
    } else if (lastAction == 'received_by_buyer') {
      if (transaction == 'donation') {
        return (
          <View style={styles.container}>
            <View style={styles.title}>
              <View style={{ flexDirection: 'row' }}>
                <Icon containerStyle={{ marginEnd: margin.base }} name='check-circle-outline' type='material-community' size={28} color={colors.text_color} />
                <Text h4 colorSecondary h4Style={{ color: colors.white }}>{t('actions:text_order_completed')}</Text>
              </View>
            </View>
          </View>
        )
      } else if (countDownTimer) {
        return (
          <View style={styles.container}>
            <View style={styles.title}>
              <Text h4 colorSecondary>{t('actions:text_time_left')} {countDownTimer}</Text>
            </View>
          </View>
        )
      } else {
        return (
          <View style={styles.container}>
            <View style={styles.title}>
              <Image source={icon.waiting} style={styles.waiting} resizeMode='cover' />
              <Text h4 colorSecondary>{t('actions:text_waiting_buyer_return', { buyer: buyer.firstName })}</Text>
            </View>
          </View>
        )
      }
    } else if (lastAction == 'returned_from_buyer') {
      return (
        <View style={styles.container}>
          <View style={styles.title}>
            <View>
              <Text h4 colorSecondary>{t('actions:text_ask_confirm_receive_1', { buyer: buyer.firstName })}</Text>
            </View>
          </View>
          <View style={styles.buttons}>
            <Button
              buttonStyle={{ backgroundColor: colors.selIcon }}
              titleStyle={{ color: colors.black }}
              onPress={() => _onUploadImages(orderDetail.id, ORDER_STATUS_CODES[5])}
              size='normal' containerStyle={{ flex: 1, }} title={t('actions:text_confirm_receive')} />
          </View>
        </View>
      )
    } else if (lastAction == 'received_by_seller' && !isCompleted) {
      if (shouldPropose) {
        return null
      }
      return (
        <View style={styles.container}>
          <View style={styles.title}>
            <Text h4 colorSecondary>{t('actions:text_ask_propose_extra_fee')}</Text>
          </View>
          <View style={styles.buttons}>
            <Button
              buttonStyle={{ backgroundColor: colors.selIcon }}
              titleStyle={{ color: colors.black }}
              onPress={() => _onCompleteOrder()}
              size='normal' containerStyle={{ flex: 0.45 }} title={t('actions:text_no_order_completed')} />
            <Button
              buttonStyle={{ backgroundColor: colors.selIcon }}
              titleStyle={{ color: colors.black }}
              onPress={() => _onProposeExtraFee()}
              size='normal' containerStyle={{ flex: 0.45 }} title={t('actions:text_yes')} />
          </View>
        </View>
      )
    } else if (lastAction == 'request_extra_fee') {
      return (
        <View style={styles.container}>
          <View style={styles.title}>
            <View style={{ flexDirection: 'row' }}>
              <Image source={icon.waiting} style={styles.waiting} resizeMode='cover' />
              <Text h4 colorSecondary>{t('actions:text_waiting_buyer_paid_extra', { buyer: buyer.firstName })}</Text>
            </View>
          </View>
        </View>
      )
    } else return null
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: padding.big,
    paddingHorizontal: padding.big,
    alignItems: 'center',
    backgroundColor: colors.gray_modal,
  },
  title: {
    flexDirection: 'row',
    marginBottom: margin.base,
    alignItems: 'flex-start',
    alignSelf: 'stretch'
  },
  buttons: {
    alignSelf: 'stretch',
    marginTop: margin.small,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    flex: 0.45,
  },
  waiting: {
    width: 64,
    height: 64,
    margin: - margin.base * 1,
    marginStart: - margin.base * 2
  }
})