import React from 'react'
import { StyleSheet, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Icon, Text } from 'src/components';
import { padding, margin, borderRadius } from 'src/components/config/spacing';
import * as colors from 'src/components/config/colors';
import FastImage from 'react-native-fast-image';
import { getRelativeTime } from 'src/utils/time';
import { CheckBox } from 'react-native-elements';
import { images, icon } from 'src/utils/images';
import { isVideo } from 'src/utils/func';
import Video from 'react-native-video';

const W = Dimensions.get('screen').width

export default function Message({ currentMess, sender, t, checked, shouldEnableCheckbox, partner,
  _onNavigateItem, _onCheckedMessage }) {
  const transaction = currentMess.transaction
  const createdAt = getRelativeTime(currentMess.createdAt, t)

  if (currentMess.user._id != sender._id) {
    if (currentMess.type && currentMess.type == 'product') {
      var media = currentMess.photo ? {
        uri: currentMess.photo,
        priority: FastImage.priority.normal,
      } : images.person;
      
      return (
        <View style={[styles.messageReceive, { marginEnd: !shouldEnableCheckbox ? - margin.base : margin.base }]}>
          <FastImage
            style={styles.avatarReceiver}
            source={partner && partner.avatar ? {
              uri: partner.avatar,
              priority: FastImage.priority.normal,
            } : images.person}
            resizeMode={FastImage.resizeMode.cover}
          />
          <TouchableOpacity style={styles.containerMessageReceive}
            onPress={() => _onNavigateItem(currentMess.productId)}>
            { !isVideo(media.uri) ? <FastImage
              style={styles.image}
              source={media}
              resizeMode={FastImage.resizeMode.cover}
            /> : <Video
            source={{uri: media.uri}}
            style={styles.image}
            resizeMode="cover"
            repeat={true}
            muted={true}
            />
            }
            <View style={{ alignItems: 'flex-start', maxWidth: W - 196, flex: !shouldEnableCheckbox ? 1 : 0 }}>
              <Text numberOfLines={1} ellipsizeMode="tail" h4 h4Style={{ color: colors.text_color }} bold>{currentMess.name}</Text>
              <View style={styles.productInfo}>
                {transaction == 'rent' ?
                  <Icon name='exchange' type='font-awesome' size={24} color={colors.text_color} />
                  : transaction == 'buyout' ?
                    <Icon name='long-arrow-right' type='font-awesome' size={24} color={colors.text_color} />
                    : transaction == 'donation' ?
                      <Image source={icon.donation} style={styles.imageIcon} resizeMode='cover' />
                      : null
                }
                <View style={styles.transaction}>
                  {transaction != 'donation' && <View style={styles.rental}>
                    <Text h5>{currentMess.currency}{currentMess.rentalPrice} / {currentMess.pref}</Text>
                    <Text h5>{t('orders:text_insurance')}: {currentMess.currency}{currentMess.insurance}</Text>
                  </View>}
                </View>
              </View>
            </View>
            <Text style={styles.date} colorSecondary h7>{createdAt}</Text>
          </TouchableOpacity>
          {!shouldEnableCheckbox && <CheckBox
            containerStyle={{ alignSelf: 'stretch', justifyContent: 'center' }}
            onPress={() => _onCheckedMessage(currentMess._id)}
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            size={24}
            checked={checked}
          />}
        </View>
      )
    } else {
      return (
        <View style={[styles.messageReceive, { marginEnd: !shouldEnableCheckbox ? - margin.base : margin.base }]}>
          <FastImage
            style={styles.avatarReceiver}
            source={partner && partner.avatar ? {
              uri: partner.avatar,
              priority: FastImage.priority.normal,
            } : images.person}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={[styles.containerMessageReceive, styles.info]}>
              <Text h4 colorSecondary h4Style={{ color: colors.black }}>{currentMess.text}</Text>
              <Text style={styles.date} colorSecondary h7 h7Style={{ color: colors.black }}>{createdAt}</Text>
            </View>
          </View>
          {!shouldEnableCheckbox &&
            <CheckBox
              containerStyle={{ alignSelf: 'stretch', justifyContent: 'center' }}
              onPress={() => _onCheckedMessage(currentMess._id)}
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              size={24}
              checked={checked}
            />}
        </View>
      )
    }
  } else {
    if (currentMess.type && currentMess.type == 'product') {
      return (
        <View style={[styles.message, { marginEnd: !shouldEnableCheckbox ? - margin.base : margin.small }]}>
          <TouchableOpacity style={[styles.containerMessage, {
            marginEnd: !shouldEnableCheckbox ? - margin.base : margin.small
          }]} onPress={() => _onNavigateItem(currentMess.productId)}>
            <FastImage
              style={styles.image}
              source={{
                uri: currentMess.photo ? currentMess.photo :
                  'https://s3.eu-central-1.amazonaws.com/storage.propmap.io/staging/uploads/user/avatar/25/user_account_profile_avatar_person_student_male-512.jpg',
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={styles.containerProduct}>
              <Text style={{ flex: 1 }} h4 bold numberOfLines={1} ellipsizeMode='tail' h4Style={{ color: colors.white }}>{currentMess.name}</Text>
              <View style={styles.productInfo}>
                {transaction == 'rent' ?
                  <Icon name='exchange' type='font-awesome' size={24} color={colors.white} />
                  : transaction == 'buyout' ?
                    <Icon name='long-arrow-right' type='font-awesome' size={24} color={colors.white} />
                    : transaction == 'donation' ?
                      <Icon name='gift' type='material-community' size={24} color={colors.white} />
                      : null
                }
                <View style={styles.transaction}>
                  {!(transaction == 'donation') && <View style={styles.rental}>
                    <Text h5 h5Style={{ color: colors.white }}>{currentMess.currency}{currentMess.rentalPrice} / {currentMess.pref}</Text>
                    <Text h5 h5Style={{ color: colors.white }}>{t('orders:text_insurance')}: {currentMess.currency}{currentMess.insurance}</Text>
                  </View>}
                </View>
              </View>
            </View>
            <Text style={styles.date} h7 h7Style={{ color: colors.white }}>{createdAt}</Text>
          </TouchableOpacity>
          {!shouldEnableCheckbox && <CheckBox
            containerStyle={{ alignSelf: 'stretch', justifyContent: 'center' }}
            onPress={() => _onCheckedMessage(currentMess._id)}
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            size={24}
            checked={checked}
          />}
        </View>
      )
    } else {
      return (
        <View style={[styles.message, { marginEnd: !shouldEnableCheckbox ? - margin.base : margin.small, marginStart: !shouldEnableCheckbox ? margin.base : 0 }]}>
          <View style={[styles.containerMessage, styles.info, {
            marginEnd: !shouldEnableCheckbox ? - margin.base : margin.small,
            marginStart: !shouldEnableCheckbox ? margin.big * 2.5 : margin.base
          }]}>
            <Text h4 h4Style={{ color: colors.white }}>{currentMess.text}</Text>
            <Text style={styles.date} h7 h7Style={{ color: colors.white }}>{createdAt}</Text>
          </View>
          {!shouldEnableCheckbox && <CheckBox
            containerStyle={{ alignSelf: 'stretch', justifyContent: 'center' }}
            onPress={() => _onCheckedMessage(currentMess._id)}
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            size={24}
            checked={checked}
          />}
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  containerMessage: {
    minWidth: 60,
    minHeight: 30,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    borderRadius: borderRadius.normal,
    backgroundColor: colors.background_bubble,
    paddingHorizontal: padding.base,
    paddingTop: padding.small,
    paddingBottom: padding.big,
    margin: margin.base,
  },
  containerMessageReceive: {
    minWidth: 60,
    minHeight: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    borderRadius: borderRadius.normal,
    backgroundColor: colors.background_comment,
    paddingHorizontal: padding.base,
    paddingTop: padding.small,
    paddingBottom: padding.big,
    marginVertical: margin.base,
    marginStart: margin.small
  },
  containerProduct: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    maxWidth: W - 132,
  },
  info: {
    minHeight: 30,
    minWidth: 110,
    justifyContent: 'center'
  },
  imageIcon: {
    width: 60,
    height: 60,
    marginVertical: - margin.base * 1.2,
    marginHorizontal: - margin.base * 1.1
  },
  rental: {
    flex: 1,
    marginBottom: margin.small
  },
  message: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingBottom: padding.tiny / 2,
    marginVertical: - margin.small,
    paddingStart: padding.tiny,
  },
  messageReceive: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: - margin.small,
    paddingBottom: padding.tiny / 2,
    paddingStart: padding.tiny,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: margin.base * 1,
    marginEnd: margin.small
  },
  avatarReceiver: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: margin.base * 1,
  },
  image: {
    width: 64,
    height: 64,
    marginEnd: margin.base,
    borderRadius: borderRadius.normal
  },
  date: {
    textAlign: 'right',
    position: 'absolute',
    end: margin.small,
    bottom: margin.tiny / 2,
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  transaction: {
    marginStart: margin.base,
  }
})