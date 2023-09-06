import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'src/components';
import { padding, margin } from 'src/components/config/spacing';
import * as colors from 'src/components/config/colors';
import FastImage from 'react-native-fast-image';
import * as formula from 'src/utils/formulas';
import { images } from 'src/utils/images';
import { getCurrencyDisplay, getDeliveryType } from 'src/utils/string';
import { DELIVERY_METHODS } from 'src/modules/common/constants';

export default function Delivery({ item, t, _onNavigateMessage }) {
  const buyer = item.buyer
  const seller = item.seller
  const currency = item && item.currency ? getCurrencyDisplay(item.currency) : getCurrencyDisplay('')
  const deliveryFee = item.transaction == 'donation' && item.deliveryType == DELIVERY_METHODS.BY_COURIER ?
    formula.getFinalPriceForDeliveryForDonation(item.deliveryCost) : formula.getFinalPriceForDelivery(item.deliveryCost)
  const deliveryType = getDeliveryType(item.deliveryType, t)
  return (
    <View style={styles.container}>
      <Text h5 colorSecondary>{t('orders:text_delivery_by')} {deliveryType} ({currency}{deliveryFee})</Text>

      <View style={styles.element}>
        <Text h5 colorSecondary>{t('common:text_from')}: </Text>
        <FastImage
          style={styles.image}
          source={item.seller && item.seller.avatar ? { uri: item.seller.avatar, priority: FastImage.priority.normal } : images.person}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={{ flex: 1 }}>
          <Text h5 colorSecondary>{seller.firstName} {seller.lastName}</Text>
          <Text h6 colorSecondary>{item.product.address ? item.product.address : seller.address}</Text>
        </View>
      </View>

      <View style={[styles.element, { marginBottom: margin.big }]}>
        <Text h5 colorSecondary>{t('common:text_to')}: </Text>
        <FastImage
          style={[styles.image, { marginStart: margin.big }]}
          source={item.buyer && item.buyer.avatar ? { uri: item.buyer.avatar, priority: FastImage.priority.normal } : images.person}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={{ flex: 1 }}>
          <Text h5 colorSecondary>{buyer.firstName} {buyer.lastName}</Text>
          <Text h6 colorSecondary>{item.address ? item.address : buyer.address}</Text>
        </View>
      </View>

      <Button
        buttonStyle={{ backgroundColor: colors.selIcon }}
        titleStyle={{ color: colors.black }}
        onPress={() => _onNavigateMessage()}
        title={t('orders:text_send_message')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: margin.base,
    marginVertical: margin.small,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.border_color,
    padding: padding.base,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginStart: margin.base,
    marginEnd: margin.small
  },
  element: {
    marginTop: margin.base,
    flexDirection: 'row'
  }
})