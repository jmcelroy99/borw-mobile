import React from 'react';
import {
  StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback,
  Dimensions, FlatList, ActivityIndicator, Platform, Image
} from 'react-native';
import { ThemedView, Header, Icon, Text, LoadingView, Modal, IconOrder } from 'src/components';
import { padding, margin, borderRadius } from 'src/components/config/spacing';
import * as colors from 'src/components/config/colors';
import { images, icon } from 'src/utils/images';
import { useUserProfileFacade } from './hooks';
import { mainStack } from 'src/config/navigator';
import FastImage from 'react-native-fast-image';
import MapView, { Marker } from 'react-native-maps';
import moment from 'moment';
import { _onGetStar } from 'src/utils/formulas';
import { isVideo } from 'src/utils/func';
import Video from 'react-native-video';


const W = Dimensions.get('screen').width;

export default function UserProfile({ screenProps, navigation }) {
  const { t } = screenProps;
  const { loading, userInfo, listProducts, loadingLoadMore,
    currentUser, userId, location, visibleMap,
    _onLoadMore, _onOpenGmail, _onChangeVisibleMap, _onBookmarkProfile } = useUserProfileFacade(navigation, t);

  let arrayFullStar = []
  let arrayEmptyStar = []
  let rating
  if (userInfo) {
    rating = parseFloat(userInfo.rating)
    for (let index = 0; index < _onGetStar(rating).toFixed(0); index++) {
      arrayFullStar.push(index)
    }
    for (let index = 0; index < 5 - parseInt(_onGetStar(rating).toFixed(0)); index++) {
      arrayEmptyStar.push(index)
    }
  }

  const shouldShowAddress = () => {
    if (userInfo && !userInfo.settings) {
      return true
    }
    return userInfo.settings.privateInfos &&
      (userInfo.settings.privateInfos.findIndex(item => item == 'address') == -1)
  }

  const shouldShowEmail = () => {
    if (userInfo && !userInfo.settings) {
      return true
    }
    return userInfo.settings.privateInfos &&
      (userInfo.settings.privateInfos.findIndex(item => item == 'email') == -1)
  }

  const shouldShowPhone = () => {
    if (userInfo && !userInfo.settings) {
      return true
    }
    return userInfo.settings.privateInfos &&
      (userInfo.settings.privateInfos.findIndex(item => item == 'phoneNumber') == -1)
  }

  const renderHeader = () => {
    const memberFrom = userInfo ? moment(userInfo.createdAt).format('LL') : ''

    return (
      <View style={{ width: W, alignItems: 'center' }}>
        <Header
          containerStyle={{ height: 130, paddingBottom: margin.big * 1.5 }}
          backgroundColor={colors.black}
          leftComponent={<TouchableOpacity style={{ flexDirection: 'row', width: 150, alignItems: 'center' }} onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={28} color={colors.unSelIcon} />
            {currentUser.id == userId && <Text h4 medium h4Style={{ color: colors.white, marginStart: margin.small }}>{t('profile:text_my_profile')}</Text>}
          </TouchableOpacity>}
          centerComponent={userInfo && <View style={styles.containerCenter}>
            <FastImage
              style={styles.image}
              resizeMode='cover'
              source={userInfo.avatar && userInfo.avatar != '' ? { uri: userInfo.avatar, priority: FastImage.priority.normal } : images.person} />
          </View>}
          rightComponent={
            <IconOrder _onPress={() => navigation.navigate(mainStack.my_orders)} />
          }
        />
        {userInfo && !userInfo.deactivated && <View style={styles.containerBody}>
          <View style={styles.containerIcon}>
            {currentUser.id != userId && userId ? <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate(mainStack.conversation, {
                  partner: {
                    id: userId,
                    uid: userInfo.firebaseUID,
                    name: userInfo.firstName + ' ' + userInfo.lastName,
                    avatar: userInfo.avatar
                  }
                })
              }}>
              <Icon
                containerStyle={[styles.icon, { marginEnd: margin.big * 1.5, paddingEnd: padding.tiny }]}
                name='send-o' type='font-awesome'
                color={colors.unSelIcon} size={24} />
            </TouchableWithoutFeedback> : <TouchableWithoutFeedback
              onPress={() => navigation.navigate(mainStack.edit_profile, {
                shouldRefresh: true
              })}>
                <Icon
                  containerStyle={[styles.icon, { marginEnd: margin.big * 1.5 }]}
                  name='lead-pencil' type='material-community'
                  color={colors.unSelIcon} size={24} />
              </TouchableWithoutFeedback>}

            {currentUser.id != userId ? <TouchableWithoutFeedback onPress={_onBookmarkProfile}>
              <Icon containerStyle={[styles.icon, { borderColor: !userInfo.bookmarked ? colors.unSelIcon : colors.selIcon }]}
                name={!userInfo.bookmarked ? 'bookmark-o' : 'bookmark'}
                type='font-awesome' color={!userInfo.bookmarked ? colors.unSelIcon : colors.selIcon} size={24} />
            </TouchableWithoutFeedback> : <TouchableWithoutFeedback
              onPress={() => navigation.navigate(mainStack.my_points)}>
                <Image source={icon.point} style={styles.point} resizeMode='cover' />
              </TouchableWithoutFeedback>}
          </View>

          <View style={styles.containerInfo}>
            {userInfo.isBusiness ?
              <View>
                <Text h3 style={styles.text} numberOfLines={1} ellipsize='tail' medium colorSecondary>{userInfo.businessName}</Text>
                <Text h4 style={styles.text} numberOfLines={1} ellipsize='tail' medium colorSecondary>{userInfo.firstName + ' ' + userInfo.lastName}</Text>
              </View> :
              <Text style={styles.text} numberOfLines={1} ellipsize='tail' h3 medium colorSecondary>{userInfo.firstName + ' ' + userInfo.lastName}</Text>}

            <TouchableWithoutFeedback onPress={() => navigation.navigate(mainStack.my_ratings, {
              userId: userId
            })}>
              <View style={styles.containerElement}>
                {arrayFullStar.map((item, index) => {
                  if (index == arrayFullStar.length - 1 && rating % 1 !== 0) {
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
                <Text style={{ marginTop: margin.tiny, marginStart: margin.small }} h5 medium h5Style={{ color: colors.selIcon }}>{t('profile:text_ratings', { stars: userInfo.rating, ratings: userInfo.ratingCount })}</Text>
              </View>
            </TouchableWithoutFeedback>

            <View style={{ marginStart: -2 }}>
              {userInfo.isBusiness && userInfo.website != '' && <View style={styles.containerElement}>
                <Image source={icon.website} style={styles.email} resizeMode='contain' />
                <Text style={styles.text} h5 medium colorSecondary numberOfLines={1} ellipsize='tail'>{userInfo.website}</Text>
              </View>}
              {shouldShowEmail() && userInfo.email && <TouchableOpacity
                style={styles.containerElement} onPress={_onOpenGmail}>
                <Image source={icon.email} style={styles.email} resizeMode='contain' />
                <Text h5 style={styles.text} numberOfLines={1} ellipsize='tail' medium colorSecondary>{userInfo.email}</Text>
              </TouchableOpacity>}
            </View>

            <View style={styles.containerElement}>
              <Icon
                containerStyle={styles.iconInfo}
                name='calendar-o'
                type='font-awesome'
                color={colors.unSelIcon}
                size={22} />
              <Text h5 medium colorSecondary>{t('profile:text_member_from', { date: memberFrom })}</Text>
            </View>
            {shouldShowAddress() && userInfo.address && <TouchableOpacity
              style={styles.containerElement}
              onPress={_onChangeVisibleMap}>
              <Icon
                containerStyle={styles.iconInfo}
                name='map-o'
                type='font-awesome'
                color={colors.unSelIcon}
                size={18} />
              <Text style={styles.text} h5 medium colorSecondary  ellipsize='tail'>{userInfo.address}</Text>
            </TouchableOpacity>}
            {shouldShowPhone() && userInfo.phoneNumber && <View style={styles.containerElement}>
              <Icon
                containerStyle={styles.iconInfo}
                name='phone'
                type='feather'
                color={colors.unSelIcon}
                size={20} />
              <Text h5 medium colorSecondary>{userInfo.phoneNumber}</Text>
            </View>}
            {!!userInfo.bio && userInfo.bio != '' && <View style={[styles.containerElement, { alignItems: 'flex-start' }]}>
              <Icon
                containerStyle={styles.iconInfo}
                name='info-circle'
                type='font-awesome'
                color={colors.unSelIcon}
                size={24} />
              <Text style={styles.text} h5 medium colorSecondary>{userInfo.bio}</Text>
            </View>}
          </View>
        </View>}
        {userInfo && !userInfo.deactivated ? <Text h3 colorSecondary medium>{t('profile:text_published_items')}</Text> : 
        <Text h3 colorSecondary medium h3Style={{ marginTop: margin.big * 2.3 }}>{t('profile:text_deactivated_account')}</Text>}
      </View >
    )
  }

  return (
    <ThemedView isFullView>
      {userInfo &&
        <View style={{ flex: 1 }}>
          <FlatList
            contentContainerStyle={{ paddingBottom: margin.base }}
            numColumns={2}
            bounces={false}
            maxToRenderPerBatch={6}
            removeClippedSubviews
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={() => {
              if (userInfo && !userInfo.deactivated) {
                return (
                  <Text h4 colorSecondary h4Style={{ textAlign: 'center', marginTop: 50 }}>{t('profile:text_empty_published_item')}</Text>
                )
              } else return null
            }}
            data={userInfo && !userInfo.deactivated ? listProducts : []}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              if (index % 2 == 0) {
                return (
                  <TouchableWithoutFeedback onPress={() => navigation.navigate(mainStack.product_detail, {
                    productId: item.id
                  })}>
                    { !isVideo(item.photos[0]) ? <FastImage
                      style={styles.imageLeft}
                      resizeMode='cover'
                      source={{ uri: item.photos[0], priority: FastImage.priority.normal }} />
                      :
                      <Video
                      source={{uri: item.photos[0]}}
                      style={styles.imageLeft}
                      resizeMode="cover"
                      repeat={true}
                      muted={true}
                      />
                    }
                  </TouchableWithoutFeedback>
                )
              } else {
                return (
                  <TouchableWithoutFeedback onPress={() => navigation.navigate(mainStack.product_detail, {
                    productId: item.id
                  })}>
                    { !isVideo(item.photos[0]) ? <FastImage style={styles.imageRight}
                      resizeMode='cover'
                      source={{ uri: item.photos[0], priority: FastImage.priority.normal }} />
                      :
                      <Video
                      source={{uri: item.photos[0]}}
                      style={styles.imageRight}
                      resizeMode="cover"
                      repeat={true}
                      muted={true}
                      />
                    }
                  </TouchableWithoutFeedback>
                )
              }
            }}
            ListFooterComponent={() => {
              if (!loadingLoadMore) return null;
              return (
                <ActivityIndicator
                  style={{ color: '#000' }}
                />
              );
            }}
            onEndReachedThreshold={0.2}
            onEndReached={() => _onLoadMore()}
          />
          {location && location.length > 0 && <Modal
            visible={visibleMap}
            noBorder={true}
            headerStyle={{ marginTop: Platform.OS === 'android' ? 0 : margin.big }}
            setModalVisible={_onChangeVisibleMap}
            ratioHeight={1}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: parseFloat(location[0]),
                longitude: parseFloat(location[1]),
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: parseFloat(location[0]),
                  longitude: parseFloat(location[1])
                }}
              />
            </MapView>
          </Modal>}
        </View>}
      {loading && !loadingLoadMore && <LoadingView />}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  containerContent: {
    height: 220,
    borderRadius: borderRadius.large,
    paddingVertical: margin.base,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  containerHeader: {
    flexDirection: 'row',
    marginEnd: margin.small
  },
  containerElement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: margin.base
  },
  containerBody: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: margin.big * 2.5,
  },
  containerCenter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginTop: -margin.small,
    position: 'absolute',
  },
  containerIcon: {
    flexDirection: 'row',
    marginStart: margin.small
  },
  star: {
    width: 56,
    height: 56,
    marginHorizontal: - margin.base * 1.3,
    marginVertical: - margin.base * 1.5,
  },
  point: {
    width: 44,
    height: 44,
    margin: -margin.base * 1.3,
    marginTop: -margin.base * 0.15,
    borderRadius: 40,
    borderWidth: 2.5,
    borderColor: colors.unSelIcon,
  },
  text: {
    flex: 1,
  },
  email: {
    width: 56,
    height: 56,
    marginStart: - margin.base * 1.2,
    marginVertical: - margin.big,
    marginEnd: -(margin.base * 0.8)
  },
  containerInfo: {
    alignSelf: 'stretch',
    padding: padding.base,
    borderWidth: 2.5,
    borderColor: colors.selIcon,
    borderRadius: borderRadius.medium,
    marginHorizontal: margin.big * 1.5,
    marginVertical: margin.big
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2.5,
    borderColor: colors.unSelIcon,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconInfo: {
    marginEnd: margin.small
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: colors.selIcon,
    borderWidth: 2
  },
  imageLeft: {
    width: W / 2 - 16,
    height: 200,
    marginEnd: margin.tiny,
    marginStart: margin.base,
    marginVertical: margin.tiny,
    borderRadius: borderRadius.medium,
  },
  imageRight: {
    width: W / 2 - 16,
    height: 200,
    marginStart: margin.tiny,
    marginEnd: margin.base,
    marginVertical: margin.tiny,
    borderRadius: borderRadius.medium,
  },
  rating: {
    width: 100,
    marginEnd: margin.base,
  }
})