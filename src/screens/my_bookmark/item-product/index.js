import React from 'react';
import { Text, Icon } from 'src/components';
import { TouchableOpacity, StyleSheet, View, Dimensions, Image } from 'react-native';
import * as colors from 'src/components/config/colors';
import { margin } from 'src/components/config/spacing';
import FastImage from 'react-native-fast-image';
import { images } from 'src/utils/images';
import { icon } from 'src/utils/images';
import { getCurrencyDisplay, getDurationPref, getTitle } from 'src/utils/string';
import { isVideo } from 'src/utils/func';
import Video from 'react-native-video';

const W = Dimensions.get('screen').width
const imageWidth = W / 2 - margin.large;

export default function ItemProduct({ item, t, _onNavigateProduct, _onNavigateProfile }) {

  if (item) {
    const currency = getCurrencyDisplay(item.product && item.product.currency ? item.product.currency : '')
    
    let _image = item.product && item.product.photos && item.product.photos.length > 0 ? {
      uri: item.product.photos[0],
      priority: FastImage.priority.normal,
    } : item.profile && item.profile.avatar ? {
      uri: item.profile.avatar,
      priority: FastImage.priority.normal,
    } : images.person;
    return (
      <View style={styles.containerItem}>
        <View style={styles.containerImage}>
          <TouchableOpacity onPress={item.productId ? _onNavigateProduct : item.profileId ? _onNavigateProfile : null}>
            { !isVideo(_image.uri) ? <FastImage
              style={styles.image}
              source={images.person}
              source={_image}
              resizeMode={FastImage.resizeMode.cover}
            /> : <Video
            source={{uri: _image.uri}}
            style={styles.image}
            resizeMode="cover"
            repeat={true}
            muted={true}
            />
            }
          </TouchableOpacity>
        </View>

        <View style={styles.containerInfo}>
          {item.product && <View>
            <Text colorSecondary bold h4 numberOfLines={1} ellipsizeMode='tail'>{item.product && item.product.name}</Text>
            <Text colorSecondary h5>{getTitle(item.product.categoryName, t)}</Text>
          </View>}
          {item.profile && <View>
            <Text colorSecondary bold h4 numberOfLines={1} ellipsizeMode='tail'>{item.profile ? item.profile.firstName + ' ' + item.profile.lastName : ''}</Text>
            <Text colorSecondary h5>{item.profile && item.profile.businessName ? item.profile.businessName : ''}</Text>
          </View>}
          <View style={styles.purchaseType}>
            {item && item.product && item.product.isRent ?
              <Icon name='exchange' type='font-awesome' size={24} color={colors.selIcon} />
              : item && item.product && item.product.isBuyOut ?
                <Icon name='long-arrow-right' type='font-awesome' size={24} color={colors.selIcon} />
                : item && item.product && item.product.isDonation ?
                  <Image source={icon.donation} style={styles.imageIcon} resizeMode='cover'/>
                  : null
            }
            {item.product && <View style={styles.currency}>
              {item.product.isRent && <Text h5 colorSecondary numberOfLines={1} ellipsizeMode='tail'>
                {currency}{item.product.rentalPrice}/{item.product.rentDuration.split('|')[0]} {getDurationPref(item.product.rentDuration.split('|')[1], t)}</Text>}
              {item.product.isBuyOut && !item.product.isRent && <Text h5 colorSecondary numberOfLines={1} ellipsizeMode='tail'>{currency}{item.product.price}</Text>}
              {item.product.isRent && <Text h5 colorSecondary numberOfLines={1} ellipsizeMode='tail'>
                ({currency}{item.product.price}{t('shop:text_insurance_lowercase')})</Text>}
            </View>}
          </View>
        </View>
      </View>
    )
  } else return null
}

const styles = StyleSheet.create({
  containerItem: {
    width: W / 2,
    marginVertical: margin.small,
  },
  circle: {
    width: imageWidth / 2,
    height: imageWidth / 2,
    borderRadius: imageWidth / 4,
    borderWidth: 2,
    borderColor: colors.text_color,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerInfo: {
    marginHorizontal: margin.small,
    marginTop: margin.tiny,
  },
  containerImage: {
    borderRadius: margin.large,
    alignSelf: 'center',
    overflow: "hidden",
  },
  containerContent: {
    width: W
  },
  imageIcon: {
    width: 60,
    height: 60,
    marginVertical: - margin.base * 1.2,
    marginHorizontal: - margin.base * 1.1
  },
  iconBackground: {
    width: imageWidth / 3 - 14,
    height: imageWidth / 3 - 14,
    borderRadius: (imageWidth / 3 - 14) / 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlayBackground: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute',
    zIndex: 1,
    width: imageWidth,
    height: 200,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  purchaseType: {
    flexDirection: 'row',
  },
  image: {
    width: imageWidth,
    height: 200,
  },
  currency: {
    marginStart: margin.small,
    marginTop: margin.tiny * 0.7
  }
})