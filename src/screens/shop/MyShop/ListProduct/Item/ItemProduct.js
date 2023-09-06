import { StyleSheet, View, Dimensions, TouchableOpacity, Image } from "react-native"
import React from 'react';
import { Text } from 'src/components';
import Icon from 'src/components/icons/Icon';
import { margin } from 'src/components/config/spacing';
import * as colors from 'src/components/config/colors';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import { getCurrencyDisplay, getDurationPref } from 'src/utils/string';
import { icon } from 'src/utils/images';
import { getTitle } from 'src/utils/string';
import { isVideo } from 'src/utils/func';

const W = Dimensions.get('screen').width;
const imageWidth = W / 2 - margin.large;

export default function ItemProduct({ item, selectedList, _onDelete, _onEdit, _onClone, _onChangeSelected, t }) {
  const isSelected = selectedList.findIndex(i => i === item.id) !== -1 ? true : false;
  const isPublic = item.isPublic;
  const currency = getCurrencyDisplay(item.currency ? item.currency : '')
  let duration, durationPref
  if(item.rentDuration){
    duration = item.rentDuration.split('|')[0]
    durationPref = getDurationPref(item.rentDuration.split('|')[1], t)
  }

  return (
    <View style={styles.containerItem}>
      <View style={styles.containerImage}>
        <TouchableOpacity onPress={() => _onChangeSelected(item.id)}>
          {!isVideo(item.photos[0]) ? <FastImage
            style={styles.image}
            source={{
              uri: item.photos[0] ? item.photos[0] : '',
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          /> : <Video source={{uri: item.photos[0]}} style={styles.image} resizeMode="cover" muted={true}/>}
          
        </TouchableOpacity>

        {!isPublic && <TouchableOpacity onPress={() => _onChangeSelected(item.id)}
          style={[styles.overlayBackground, { justifyContent: 'center', alignItems: 'center' }]}>
          <View style={styles.circle}>
            <Text h4 style={{ color: colors.white }}>{t('shop:text_hidden')}</Text>
          </View>
        </TouchableOpacity>}

        {isSelected && <TouchableOpacity style={styles.overlayBackground} onPress={() => _onChangeSelected(item.id)}>
          <TouchableOpacity style={styles.iconBackground} onPress={() => _onEdit(item)}>
            <Icon name='edit' type='material' size={30} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBackground} onPress={() => _onClone(item.id)}>
            <Icon name='content-copy' type='material-community' size={28} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBackground} onPress={() => _onDelete(item.id)}>
            <Icon name='ios-trash-outline' type='ionicon' size={28} color={colors.white} />
          </TouchableOpacity>
        </TouchableOpacity>}
      </View>

      <View style={styles.containerInfo}>
        <Text colorSecondary bold h4 numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
        <Text colorSecondary h5>{getTitle(item.categoryName, t)}</Text>
        <View style={styles.purchaseType}>
          {item.isRent ?
            <Icon name='exchange' type='font-awesome' size={24} color={colors.selIcon} />
            : item.isBuyOut ?
              <Icon name='long-arrow-right' type='font-awesome' size={24} color={colors.selIcon} />
              : item.isDonation ?
                <Image source={icon.donation} style={styles.imageIcon} resizeMode='cover' />
                : null
          }
          <View style={styles.currency}>
            {item.rentalPrice && item.rentalPrice > 0 && item.isRent && <Text h5 colorSecondary numberOfLines={1} ellipsizeMode='tail'>{currency}{item.rentalPrice}/{duration} {durationPref}</Text>}
            {item.price && !item.isDonation && <Text h5 colorSecondary numberOfLines={1} ellipsizeMode='tail'>{item.isRent && '('}{currency}{item.price}{item.isRent ? t('shop:text_insurance_lowercase') : ''}{item.isRent && ')'}</Text>}
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  containerItem: {
    width: W / 2,
    marginVertical: margin.small,
  },
  imageIcon: {
    width: 60,
    height: 60,
    marginVertical: - margin.base * 1.2,
    marginHorizontal: - margin.base * 1.1
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