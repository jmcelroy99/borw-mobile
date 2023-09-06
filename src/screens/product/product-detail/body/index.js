import React from 'react';
import { Icon, Text, Modal, ImageAvatar } from 'src/components';
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View, Image } from 'react-native';
import * as colors from 'src/components/config/colors';
import { margin, borderRadius } from 'src/components/config/spacing';
import FastImage from 'react-native-fast-image';
import { useProductDetailFacade } from './hooks';
import moment from 'moment';
import LikedList from './liked-list';
import * as formula from 'src/utils/formulas';
import { Badge } from 'react-native-elements';
import { getCurrencyDisplay } from 'src/utils/string';
import { _onGetStar } from 'src/utils/formulas';
import { icon } from 'src/utils/images';
import { getTitle, getDurationPref } from 'src/utils/string';

export default function Body({ item, t, userId, likesList, navigation, _onNavigateMessage }) {
  const { address, url, isVisible, liked, categoryName, isViewMore, bookmarked,
    _onLikeItem, _onChangeVisible, _onViewMore, _onBookmarkItem } = useProductDetailFacade(item, userId, likesList, navigation);

  const currency = getCurrencyDisplay(item.currency ? item.currency : '')
  const rentalPrice = item.isRent ? formula.getFinalPrice(item.rentalPrice) : 0
  const rating = item && item.owner && item.owner.rating ? item.owner.rating : 0
  const fullName = item && item.owner && item.owner.firstName + ' ' + item.owner.lastName
  let arrayFullStar = []
  let arrayEmptyStar = []
  for (let index = 0; index < _onGetStar(rating).toFixed(0); index++) {
    arrayFullStar.push(index)
  }
  for (let index = 0; index < 5 - parseInt(_onGetStar(rating).toFixed(0)); index++) {
    arrayEmptyStar.push(index)
  }

  const duration = item.rentDuration ? item.rentDuration.split('|')[0] : null
  const durationPref = item.rentDuration ? getDurationPref(item.rentDuration.split('|')[1], t) : null
  
  return (
    <View style={styles.container}>
      <View style={styles.containerTitle}>
        <Text style={{ flex: 1 }} h3 colorSecondary bold>{item.name}</Text>
        {item.owner.id != userId && 
        <TouchableWithoutFeedback onPress={_onNavigateMessage}>          
          <Image source={icon.sendUnselected} style={styles.sendo} />
        </TouchableWithoutFeedback>}
        <TouchableWithoutFeedback onPress={_onBookmarkItem}>          
          <Image source={bookmarked ? icon.bookmarkSelected : icon.bookmarkUnselected} style={styles.bookmark} />
        </TouchableWithoutFeedback>
      </View>

      <Text style={{ marginBottom: margin.base }} h4 colorSecondary>{getTitle(categoryName, t)} - {t('shop:text_product_size')} {item.size.replace('|', ' ')}</Text>
      {item.isRent && <View style={styles.element}>
        <Text h4 colorSecondary>{t('product:text_rental_price')}</Text>
        <Text h4 colorSecondary>{currency}{rentalPrice} {t('product:text_per')} {duration} {durationPref}</Text>
      </View>}
      {item.isRent && <View style={styles.element}>
        <Text h4 colorSecondary>{t('shop:text_insurance')}</Text>
        <Text h4 colorSecondary>{currency}{parseFloat(item.price).toFixed(2)}</Text>
      </View>}
      {item.isBuyOut && <View style={styles.element}>
        <Text h4 colorSecondary>{t('shop:text_buy_out_price')}</Text>
        <Text h4 colorSecondary>{currency}{formula.getFinalPriceForBuyOut(item.price)}</Text>
      </View>}
      <View style={styles.element}>
        <Text h4 colorSecondary>{t('product:text_created_on')}</Text>
        <Text h4 colorSecondary>{moment(item.createdAt).format('MMM DD, YYYY HH:MM')}</Text>
      </View>
      {item.payWithPoint && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={icon.payWithPoint} style={{ width: 56, height: 56, marginStart: -margin.base }} resizeMode='cover' />
        <Text h4 h4Style={{ color: colors.selIcon }} medium>{t('shop:text_allow_payment_with_points')}</Text>
      </View>}

      <View style={styles.containerInfo}>
        <ImageAvatar styleAvatar={styles.image} url={item.owner.avatar} id={item.owner.id}
          resizeMode={FastImage.resizeMode.cover} navigation={navigation} />
        <View style={styles.rating}>
          <Text h3 colorSecondary bold numberOfLines={2}
            style={{ flex: 0, textAlignVertical: 'bottom' }}>{fullName}</Text>
          <View style={styles.containerTitle}>
            {arrayFullStar.map((item, index) => {
              if (index == arrayFullStar.length - 1 && parseFloat(rating) % 1 !== 0) {
                return (
                  <Image source={icon.halfStar} style={styles.star} resizeMode='contain' />
                )
              } else {
                return (
                  <Image source={icon.fullStar} style={styles.star} resizeMode='contain' />
                )
              }
            })}
            {arrayEmptyStar.map(() => {
              return (
                <Image source={icon.emptyStar} style={styles.star} resizeMode='contain' />
              )
            })}
            <Text style={{ marginStart: margin.base }}
              h4 colorSecondary>({item.owner.ratingCount ? item.owner.ratingCount : 0})</Text>
          </View>
        </View>
      </View>

      <Text h3 colorSecondary bold>{t('product:text_item_description')}</Text>

      <View>
        <Text h4 colorSecondary numberOfLines={isViewMore ? 10 : 2} ellipsizeMode='tail'>{item.description}</Text>
        {item.description.length > 85 && <TouchableOpacity style={styles.footer} onPress={_onViewMore}>
          <Text h5 colorSecondary h5Style={{ marginBottom: -margin.small }}>{isViewMore ? t('product:text_view_less') : t('product:text_view_more')}</Text>
          <Icon name={isViewMore ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} type='material' size={24} color={colors.text_color} />
        </TouchableOpacity>}
      </View>

      <Text style={{ marginTop: margin.base }} h3 colorSecondary bold>{t('product:text_item_location')}</Text>
      <Text h4 colorSecondary>{address}</Text>
      <FastImage
        style={styles.map}
        source={{
          uri: url,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover} />
      <View style={styles.containerTitle}>
        <TouchableOpacity onPress={() => _onLikeItem(item.id, !liked.isLiked)}>
          <Image source={liked && liked.isLiked ? icon.clapSelected : icon.clapUnselected} style={styles.clap} />
        </TouchableOpacity>
        {liked && liked.likes > 0 && <Badge onPress={() => _onChangeVisible()}
          value={liked.likes <= 99 ? liked.likes : '99+'} textStyle={{ fontSize: 10 }} status='primary'
          badgeStyle={[styles.badge, { end: liked.likes < 10 ? -14 : liked.likes < 99 ? -17 : -21 }]} />}
      </View>

      <Modal
        visible={isVisible}
        headerStyle={styles.modal}
        setModalVisible={() => _onChangeVisible()}
        topLeftElement={() => (null)}
        ratioHeight={0.5}>
        <LikedList t={t} likesList={likesList} navigation={navigation} onPress={_onChangeVisible} />
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: margin.base,
    marginVertical: margin.base
  },
  containerTitle: {
    flexDirection: 'row',
  },
  containerInfo: {
    borderWidth: 1,
    borderRadius: borderRadius.medium,
    borderColor: colors.selIcon,
    marginTop: margin.base,
    marginBottom: margin.base,
    padding: margin.base,
    flexDirection: 'row',
    alignItems: 'center'
  },
  element: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    alignItems: 'center',
  },
  star: {
    width: 56,
    height: 56,
    marginHorizontal: - margin.base * 1.3,
    marginTop: - margin.base * 1.5
  },
  clap: {
    width: 56,
    height: 56,
    marginHorizontal: - margin.base * 1.3,
    marginTop: - margin.base * 1.5
  },
  sendo: {
    width: 56,
    height: 56,
    marginRight: - margin.base * 0.5,
    marginTop: - margin.base * 1.5
  },
  bookmark: {
    width: 56,
    height: 56,
    marginHorizontal: - margin.base * 1.3,
    marginTop: - margin.base * 1.5
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  map: {
    height: 240,
    marginBottom: margin.big,
    marginTop: margin.base,
    borderRadius: margin.small
  },
  rating: {
    marginStart: margin.small,
    justifyContent: 'center',
    flex: 1,
  },
  icon: {
    alignSelf: 'flex-start',
  },
  modal: {
    backgroundColor: colors.gray_modal
  },
  badge: {
    position: 'absolute',
    top: -6,
    start: -5,
    backgroundColor: colors.gray_icon_ban,
    borderWidth: 0,
  },
})