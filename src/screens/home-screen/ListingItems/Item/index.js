import React from 'react';
import { Text, Icon, ImageAvatar } from 'src/components';
import { margin } from 'src/components/config/spacing';
import { View, StyleSheet, TouchableOpacity, Dimensions, TouchableWithoutFeedback, Image } from 'react-native';
import * as colors from 'src/components/config/colors';
import { borderRadius } from 'src/components/config/spacing';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import { mainStack } from 'src/config/navigator';
import * as formula from 'src/utils/formulas';
import { getCurrencyDisplay } from 'src/utils/string';
import { Badge } from 'react-native-elements';
import { images, icon } from 'src/utils/images';
import { getDurationPref, getTitle } from 'src/utils/string';
import { calculateDistance } from 'src/utils/formulas';
import { isVideo } from 'src/utils/func';

const W = Dimensions.get('screen').width;
const H = Dimensions.get('screen').height;

export default function ItemListing({ item, navigation, t, _onLikeItem, user, _onBookmark }) {
  const durationPref = item.rentDuration && item.rentDuration.split('|')[1]
  const renderLikeButton = (likes) => {
    if (item.liked) {
      return (
        <View>
          <TouchableOpacity style={{ marginStart: -margin.tiny }}
            onPress={() => _onLikeItem(item.id, !item.liked)}>
            <Image source={icon.clapSelected} style={styles.imageIcon} />
          </TouchableOpacity>
          {likes > 0 && <Badge onPress={() => navigation.navigate(mainStack.product_detail, {
            productId: item.id,
            viewLikeList: true
          })}
            value={ likes <= 99 ? likes : '99+'} textStyle={{ fontSize: 10 }}
            badgeStyle={[styles.badge, {top: -45, end: likes < 10 ? 5 : likes < 99 ? 0 : 2 }]} />}
        </View>
      )
    } else {
      return (
        <View>
          <TouchableOpacity style={{ marginStart: -margin.tiny }}
            onPress={() => _onLikeItem(item.id, !item.liked)}>
            <Image source={icon.clapUnselected} style={styles.imageIcon} />
          </TouchableOpacity>
          {likes > 0 && <Badge value={likes <= 99 ? likes : '99+'} textStyle={{ fontSize: 10 }}
            onPress={() => navigation.navigate(mainStack.product_detail, {
              productId: item.id,
              viewLikeList: true
            })}
            badgeStyle={[styles.badge, { top: -45, end: likes < 10 ? 5 : likes < 99 ? 0 : 2 }]} />}
        </View>
      )
    }
  }

  const renderComment = (comments) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate(mainStack.product_detail, {
        productId: item.id,
        viewComments: true
      })} style={{ marginStart: -margin.tiny }}>
        <Image source={icon.comment} style={styles.imageIcon} resizeMode='contain' />
        {comments > 0 && <Badge value={comments <= 99 ? comments : '99+'} textStyle={{ fontSize: 10 }}
          badgeStyle={[styles.badge, { top: -45, end: comments < 10 ? 5 : comments < 99 ? 0 : 2 }]} />}
      </TouchableOpacity>
    )
  }

  const buyOutPrice = () => {
    return formula.getFinalPriceForBuyOut(item.price)
  }

  const price = () => {
    if (item.isRent) {
      return formula.getFinalPrice(item.rentalPrice)
    } else if (item.isBuyOut) {
      return formula.getFinalPriceForBuyOut(item.price)
    }
  }

  const calDistance = () => {
    if (user.location) {
      const userLocation = user.location.split(',');
      const productLocation = item.location.split(',');
      return calculateDistance(userLocation[0], productLocation[0], userLocation[1], productLocation[1])
    } else return null
  }

  return (
    <View style={styles.containerItem}>
      <TouchableWithoutFeedback onPress={() => navigation.navigate(mainStack.product_detail, {
        productId: item.id
      })}>
        <View>
          {!isVideo(item.photos[0]) ? <FastImage
            style={styles.image}
            source={item.photos[0] ? {
              uri: item.photos[0],
              priority: FastImage.priority.normal,
            } : images.person}
            resizeMode={FastImage.resizeMode.cover}
          /> : <Video source={{uri:item.photos[0]}} style={styles.image} resizeMode="cover" repeat={true} muted={true}/> }
          <View style={[styles.type, { minHeight: !item.isRent ? 72 : 60 }]}>
            {!item.isDonation && item.rentalPrice &&
              <Text h6 colorSecondary style={[styles.textReact, { marginStart: margin.small }]}>{getCurrencyDisplay(item && item.currency)}{price()}</Text>}
            {item.isRent ?
              <Icon containerStyle={{ marginEnd: margin.tiny }} name='exchange' type='font-awesome' size={20} color={colors.selIcon} />
              : item.isBuyOut ?
                <Icon name='long-arrow-right' type='font-awesome' size={20} color={colors.selIcon} />
                : item.isDonation ?
                  <Image source={icon.iconDonation} style={styles.imageDonation} resizeMode='cover'/>
                  : null
            }
            {item.isRent && <Text h6 colorSecondary numberOfLines={1} ellipsizeMode='tail'
            style={[styles.textReact, styles.durationPref]}>{getDurationPref(durationPref, t)}</Text>}
          </View>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.containerReaction}>
        <View style={styles.containerLikeComment}>
          {renderLikeButton(item.likes)}
          {renderComment(item.comments)}
        </View>
        <View style={styles.containerMessBook}>
          {user.id != item.owner.id && <TouchableWithoutFeedback
           onPress={() => navigation.navigate(mainStack.conversation, {
              product: item
            })}>          
            <Image source={icon.sendUnselected} style={styles.sendo} />
          </TouchableWithoutFeedback>}
          <TouchableWithoutFeedback onPress={_onBookmark}>          
            <Image source={item.bookmarked ? icon.bookmarkSelected : icon.bookmarkUnselected} style={styles.bookmark} />
          </TouchableWithoutFeedback>
        </View>
      </View>

      <View style={styles.containerDetail}>
        <View>
          <ImageAvatar
            styleAvatar={styles.avatar}
            navigation={navigation}
            url={item.owner.avatar}
            id={item.owner.id}
            resizeMode={FastImage.resizeMode.cover} />
          <View style={{ flexDirection: 'row', marginTop: margin.small, alignItems: 'flex-end' }}>
            {item.rating && item.numberRating && <Text h5 colorSecondary>{item.rating} ({item.numberRating})</Text>}
          </View>
        </View>

        <View style={styles.containerInfo}>
          <Text h4 bold colorSecondary numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
          {item.isRent && item.isBuyOut && <Text h5 colorSecondary numberOfLines={1} ellipsizeMode='tail'>{t('home:text_your_for')} {getCurrencyDisplay(item && item.currency)}{buyOutPrice()}</Text>}
          <Text h5 colorSecondary numberOfLines={1} ellipsizeMode='tail'>{getTitle(item.categoryName, t)} - {t('home:text_size')} {item.size.replace('|', ' (')})</Text>
          {!!item.distance && <Text h5 colorSecondary>{t('home:text_distance', { distance: item.distance })}</Text>}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  containerItem: {
    alignItems: 'center',
    marginVertical: margin.big * 1.3,
    marginHorizontal: margin.big
  },
  containerLikeComment: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  containerReaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: margin.small,
    marginEnd: margin.tiny
  },
  containerMessBook: {
    flexDirection: 'row'
  },
  containerDetail: {
    flexDirection: 'row',
    marginTop: margin.small
  },
  containerImage: {
    width: W - margin.big,
    height: H * 0.45,
    borderRadius: borderRadius.medium
  },
  containerInfo: {
    flex: 1,
    marginStart: margin.small
  },
  durationPref: {
    marginTop: margin.small,
    textAlign: 'center'
  },
  clap: {
    width: 56,
    height: 56,
  },
  sendo: {
    width: 56,
    height: 56,
    marginRight: - margin.base * 0.5,
    marginTop: - margin.base
  },
  bookmark: {
    width: 56,
    height: 56,
    marginHorizontal: - margin.base * 1.3,
    marginTop: - margin.base
  },
  type: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    width: 90,
    position: 'absolute',
    bottom: 32,
    end: 16,
    padding: margin.tiny,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.border_transaction
  },
  image: {
    width: W * 0.88,
    height: W * 0.88,
    borderRadius: borderRadius.medium,
  },
  imageDonation: {
    width: 86,
    height: 86,
    marginVertical: - (margin.base * 1.2)
  },
  imageIcon: {
    width: 56,
    height: 56,
    marginTop: - (margin.base * 1.2)
  },
  textReact: {
    marginStart: margin.tiny,
    marginEnd: margin.base,
  },
  iconDonation: {
    width: 64,
    height: 60,
    marginVertical: - margin.base * 1.2,
    marginHorizontal: - margin.base * 1.1
  },
  icon: {
    marginEnd: margin.base
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  badge: {
    position: 'absolute',
    top: -32,
    backgroundColor: colors.gray_icon_ban,
    borderWidth: 0
  }
})