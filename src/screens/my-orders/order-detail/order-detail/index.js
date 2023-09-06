import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'src/components';
import { padding, margin } from 'src/components/config/spacing';
import * as colors from 'src/components/config/colors';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import * as formula from 'src/utils/formulas';
import { getDurationPref } from 'src/utils/string';
import { isVideo } from 'src/utils/func';
import Video from 'react-native-video';

export default function OrderDetail({ t, item, currency }) {
  const product = item.product
  const createdAt = moment(item.from).format('ll')
  let durationPref, duration
  if(item.product.rentDuration){
    durationPref = getDurationPref(item.product.rentDuration.split('|')[1], t)
    duration = item.product.rentDuration.split('|')[0]
  }

  const rental = formula.getFinalPrice(product.rentalPrice) + '/' + durationPref
  const buyOutPrice = item.transaction == 'buy' ? formula.getFinalPriceForBuyOut(product.price) : product.price
  const mainPhotoUrl = product.photos ? product.photos[0] : '';
  
  return (
    <TouchableOpacity style={styles.container}>

      <View style={styles.body}>
        <View style={styles.containerImage}>
         { !isVideo(mainPhotoUrl) ? <FastImage
            style={styles.image}
            source={{
              uri: product.photos ? product.photos[0] : '',
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          /> : <Video
          source={{uri: mainPhotoUrl}}
          style={styles.image}
          resizeMode="cover"
          repeat={true}
          muted={true}
          />
        }
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.info}>
            <Text h4 colorSecondary bold>{product.name}</Text>

            <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
              {item.transaction == 'rent' && <View style={styles.element}>
                <Text style={{ flex: 1 }} h6 colorSecondary>{t('shop:text_rental_price')}</Text>
                <Text h6 colorSecondary>{currency}{rental}</Text>
              </View>}

              {item.transaction != 'donation' && <View style={styles.element}>
                <Text style={{ flex: 1 }} h6 colorSecondary>{item.transaction == 'rent' ? t('orders:text_insurance') : t('shop:text_buy_out_price')}:</Text>
                <Text h6 colorSecondary>{currency}{buyOutPrice}</Text>
              </View>}

              {item.transaction == 'rent' && <View style={styles.element}>
                <Text style={{ flex: 1 }} h6 colorSecondary>{t('orders:text_rental_duration')}</Text>
                <Text h6 colorSecondary>{duration} {durationPref}</Text>
              </View>}

              <View style={styles.element}>
                <Text style={{ flex: 1 }} h6 colorSecondary>{t('orders:text_start_date')}</Text>
                <Text h6 colorSecondary>{createdAt}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.border_color,
    marginHorizontal: margin.base,
    marginVertical: margin.small,
    padding: padding.base,
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
    marginStart: margin.base,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  footer: {
    flexDirection: 'row',
    marginTop: margin.base,
    marginStart: margin.small,
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