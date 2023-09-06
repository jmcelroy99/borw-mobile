import React from 'react';
import { Icon, Text, Divider } from 'src/components';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import * as colors from 'src/components/config/colors';
import { margin } from 'src/components/config/spacing';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import * as formula from 'src/utils/formulas';
import { images, icon } from 'src/utils/images';
import { getCurrencyDisplay } from 'src/utils/string';
import { isVideo } from 'src/utils/func';
import Video from 'react-native-video';

export default function ItemCart({ item, t, _onRemoveToCart, orderResult, total }) {
  const purchaseAt = moment(item.pickUpDate).format('MMM DD, YYYY')
  const error = orderResult && orderResult.status == 'rejected' ? t('error:text_order_fail') : null
  const currency = getCurrencyDisplay(item && item.currency ? item.currency : '')

  
  return (
    <View>
      <View style={styles.container}>
        { !isVideo(item.image) ? <FastImage
          style={styles.image}
          source={item.image ? { uri: item.image, priority: FastImage.priority.normal } : images.person}
          resizeMode={FastImage.resizeMode.cover}
        /> : <Video
        source={{uri: item.image}}
        style={styles.image}
        resizeMode="cover"
        repeat={true}
        muted={true}
        />
        }
        <View style={styles.body}>
          {error && <Text>{error}</Text>}
          <View style={styles.title}>
            {item.transaction == 'donation' && <Image source={icon.donation} style={styles.imageIcon} resizeMode='cover' />}
            {item.transaction == 'rent' && <Icon containerStyle={{ marginEnd: margin.small }} name='exchange' type='font-awesome' size={24} color={colors.selIcon} />}
            {item.transaction == 'buy' && <Icon containerStyle={{ marginEnd: margin.small }} name='long-arrow-right' type='font-awesome' size={24} color={colors.selIcon} />}

            <Text style={{ marginTop: 2, flex: 1 }} h4 bold colorSecondary numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
            {!!total && <Text style={{ flex: 0.3, textAlign: 'right' }} h4 colorSecondary>{currency}{total}</Text>}
          </View>

        {item.transaction == 'rent' && <Text h6 colorSecondary>{t('cart:text_for')} {item.durationTime} {t('orders:text_days')}</Text>}
          {!item.isDonation && <Text h6 colorSecondary>{t('cart:text_purchase_from')} {purchaseAt}</Text>}
          {!item.isDonation && <Text h6 colorSecondary>{t('cart:text_delivery')} {item.deliveryMethod} ({currency}{formula.getFinalPriceForDelivery(item.deliveryFee)})</Text>}

          <View style={styles.footer}>
            <FastImage
              style={styles.avatar}
              source={item.ownerAvatar ? { uri: item.ownerAvatar, priority: FastImage.priority.normal } :images.person}
              resizeMode={FastImage.resizeMode.cover} />
            <Text style={{ flex: 1, marginEnd: margin.base }} numberOfLines={2} ellipsizeMode="tail" h6 colorSecondary>{item.address}</Text>
            <TouchableOpacity onPress={() => _onRemoveToCart(item.id)}>
              <Icon name='trash-can-outline' type='material-community' size={24} color={colors.unSelIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Divider style={styles.divider} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: margin.base,
    paddingVertical: margin.small,
  },
  body: {
    flex: 1,
    marginStart: margin.base,
    marginVertical: -margin.tiny
  },
  footer: {
    flexDirection: 'row',
    marginTop: margin.tiny,
    alignItems: 'center'
  },
  image: {
    width: 100,
    height: 106,
    borderRadius: 12,
    alignSelf: 'center'
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginEnd: margin.small
  },
  imageIcon: {
    width: 60,
    height: 60,
    marginVertical: - margin.base * 1.2,
    marginHorizontal: - margin.base * 1.1
  },
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  divider: {
    height: 2,
    backgroundColor: colors.text_color,
    marginVertical: margin.base,
    marginHorizontal: margin.base
  },
})