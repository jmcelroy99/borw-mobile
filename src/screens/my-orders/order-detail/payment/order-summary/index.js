import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Divider } from 'src/components';
import { margin, padding } from 'src/components/config/spacing';
import * as colors from 'src/components/config/colors';
import * as formula from 'src/utils/formulas';
import { DELIVERY_METHODS } from 'src/modules/common/constants';

export default function OrderSummary({ t, orderDetail, pointsDiscount, currency, _onShowErrorMinimum }) {
  if (orderDetail) {
    const buyOutPrice = orderDetail.transaction != 'donation' ? formula.getFinalPriceForBuyOut(orderDetail.price) : 0
    const rentalPrice = (formula.getFinalPrice(orderDetail.rentalPrice) * orderDetail.durationTime).toFixed(2)
    const deliveryFee = orderDetail.transaction == 'donation' && orderDetail.deliveryType == DELIVERY_METHODS.BY_COURIER ?
      formula.getFinalPriceForDeliveryForDonation(orderDetail.deliveryCost) : formula.getFinalPriceForDelivery(orderDetail.deliveryCost)

    const subTotal = orderDetail.transaction == 'rent' ? parseFloat(rentalPrice) + parseFloat(deliveryFee) :
      parseFloat(buyOutPrice) + parseFloat(deliveryFee)
    const discount = orderDetail.transaction == 'rent' ?
      parseFloat(subTotal) - (((parseFloat(orderDetail.rentalPrice) * orderDetail.durationTime) + parseFloat(deliveryFee * 0.971) + 0.3) / 0.971) : 0
    const total = parseFloat(subTotal) - parseFloat(discount) - parseFloat(pointsDiscount)

    const getTotal = () => {
      if (currency) {
        if (parseFloat(total) < 0) {
          if (parseFloat(total.toFixed(2)) == 0) {
            return `${currency}` + total.toFixed(2).replace('-', '')
          }
          return `-${currency}` + total.toFixed(2).split('-')[1]
        } else {
          return `${currency}` + total.toFixed(2)
        }
      } else return 0
    }

    const getDiscount = () => {
      if (currency) {
        if (parseFloat(discount) < 0) {
          return `-${currency}` + discount.toFixed(2).split('-')[1]
        } else {
          return `-${currency}` + discount.toFixed(2)
        }
      } else return 0
    }

    if (parseFloat(total) < 0.5) {
      _onShowErrorMinimum(!(parseFloat(total).toFixed(2) == 0))
    } else {
      _onShowErrorMinimum(false)
    }

    return (
      <View style={styles.container}>
        <Text h3 colorSecondary bold style={styles.title}>{t('orders:text_order_summary')}</Text>

        {orderDetail.transaction == 'rent' ? <View style={styles.element}>
          <Text h4 colorSecondary style={styles.text}>{t('shop:text_rental_price')}</Text>
          <Text h4 colorSecondary>{currency}{rentalPrice}</Text>
        </View> : orderDetail.transaction == 'buy' ? <View style={styles.element}>
          <Text h4 colorSecondary style={styles.text}>{t('shop:text_buy_out_price')}</Text>
          <Text h4 colorSecondary>{currency}{buyOutPrice}</Text>
        </View> : null}

        <View style={{ flex: 1, marginBottom: margin.big * 2 }}>
          <View style={styles.element}>
            <Text h4 colorSecondary style={styles.text}>{t('product:text_delivery_fee')}</Text>
            <Text h4 colorSecondary>{currency}{deliveryFee}</Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.element}>
            <Text h4 colorSecondary style={styles.text}>{t('orders:text_sub_total')}</Text>
            <Text h4 colorSecondary>{currency}{parseFloat(subTotal).toFixed(2)}</Text>
          </View>

          {!!pointsDiscount && <View style={styles.element}>
            <Text h4 colorSecondary h4Style={styles.textPoints}>{t('orders:text_pay_with_points')}</Text>
            <Text h4 colorSecondary h4Style={{ color: colors.red }}>-{currency}{pointsDiscount.toFixed(2)}</Text>
          </View>}

          {orderDetail.transaction == 'rent' && <View style={styles.element}>
            <Text h4 colorSecondary h4Style={styles.textPoints}>{t('product:text_discount')}</Text>
            <Text h4 colorSecondary h4Style={{ color: colors.red }}>{getDiscount()}</Text>
          </View>}
        </View>

        <View style={styles.element}>
          <Text h3 colorSecondary style={styles.text}>{t('cart:text_total')}</Text>
          <Text h3 colorSecondary>{getTotal()}</Text>
        </View>

      </View>
    )
  } else return null
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.border_color,
    marginHorizontal: margin.base,
    marginBottom: margin.small,
    padding: padding.base
  },
  title: {
    marginBottom: margin.base
  },
  element: {
    flexDirection: 'row'
  },
  containerInsurance: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    flex: 1
  },
  textPoints: {
    flex: 1,
    color: colors.red
  },
  divider: {
    height: 2,
    flex: 1,
    backgroundColor: colors.text_color,
    marginVertical: margin.base
  },
})