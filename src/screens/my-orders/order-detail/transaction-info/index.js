import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { Icon, Text } from 'src/components';
import { padding, margin, borderRadius } from 'src/components/config/spacing';
import * as colors from 'src/components/config/colors';
import moment from 'moment';
import * as formula from 'src/utils/formulas';
import { getTransaction } from 'src/utils/string';
import { icon } from 'src/utils/images';
import { DELIVERY_METHODS } from 'src/modules/common/constants';

export default function TransactionInfo({ item, currency, t }) {
  const date = moment(item.createdAt).format('MMM DD, YYYY HH:MM')
  const buyOutPrice = formula.getFinalPriceForBuyOut(item.price)
  const delivery = formula.getFinalPriceForDelivery(item.deliveryCost)
  const rental = formula.getFinalPrice(item.rentalPrice) * item.durationTime
  const transaction = item.transaction;
  const total = transaction == 'rent' ? parseFloat(delivery) + parseFloat(rental) : 
  transaction == 'donation' && item.deliveryType == DELIVERY_METHODS.BY_HAND ? 0 : transaction == 'donation' && item.deliveryType == DELIVERY_METHODS.BY_COURIER ? 
  formula.getFinalPriceForDeliveryForDonation(item.deliveryCost) : parseFloat(buyOutPrice) + parseFloat(delivery)

  return (
    <View style={styles.container}>
      {transaction == 'donation' && <Image source={icon.donation} style={styles.imageIcon} resizeMode='contain'/>}
      {transaction == 'rent' && <Icon name='exchange' type='font-awesome' size={32} color={colors.selIcon} />}
      {transaction == 'buy' && <Icon name='long-arrow-right' type='font-awesome' size={32} color={colors.selIcon} />}
      <Text style={{ flex: 0.6, marginStart: margin.small }} h4 colorSecondary>{getTransaction(transaction.charAt(0).toUpperCase() + transaction.slice(1), t)}</Text>
      <Text style={{ flex: 0.55, marginStart: margin.base }} h4 colorSecondary>{currency}{parseFloat(total).toFixed(2)}</Text>
      <Text style={{ marginStart: margin.base }} h5 colorSecondary>{date}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: margin.base,
    marginVertical: margin.small,
    borderWidth: 1,
    borderRadius: borderRadius.large,
    borderColor: colors.border_color,
    padding: padding.base,
    alignItems: 'center'
  },
  imageIcon: {
    width: 64,
    height: 64,
    marginVertical: - margin.base * 1.2,
    marginHorizontal: - margin.base * 1.2
  },
})