import React from 'react';
import { ThemedView, Text, IconOrder } from 'src/components';
import * as colors from 'src/components/config/colors';
import {
  View, StyleSheet, Dimensions, Platform, StatusBar, ActivityIndicator, FlatList, TouchableWithoutFeedback,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { margin } from 'src/components/config/spacing';
import Designers from './Designer/index';
import Videos from './Videos/index';
import { useHomeFacade } from './hooks';
import SearchBar from './SearchBar';
import { mainStack } from 'src/config/navigator';
import { getStatusBarHeight } from 'src/components/config';
import { images } from 'src/utils/images';
import ItemListing from './ListingItems/Item';

const W = Dimensions.get('screen').width
const H = Dimensions.get('screen').height
const HEADER_HEIGHT = 56

export default function HomeScreen(props) {
  const { t } = props.screenProps
  const { listProduct, listDesigner, listVideos, userProfile, isShowLoadMore, isPullRefresh, shouldScrollToTop,
    _onLikeItem, _onBookmark, _onScroll, _onScrolledToTop } = useHomeFacade(props.navigation, t);
  
  const _onRenderHeader = () => {
    return (
      <View>
        <View style={styles.header}>
          <Text h5 style={styles.text}>{t('home:text_welcome')}{'\n'}{name}</Text>
          <TouchableWithoutFeedback onPress={() => props.navigation.navigate(mainStack.user_profile, {
            userId: userProfile.id
          })}>
            <View style={styles.containerCenter}>
              <FastImage style={styles.image}
                resizeMode='cover'
                source={userProfile && userProfile.avatar && userProfile.avatar != '' ? { uri: userProfile.avatar, priority: FastImage.priority.normal } : images.person} />
            </View>
          </TouchableWithoutFeedback>
          <IconOrder _onPress={() => props.navigation.navigate(mainStack.my_orders)}/>
        </View>

        {isPullRefresh && <ActivityIndicator style={{ color: colors.black, marginTop: margin.base * 1.5 }} />}
        <SearchBar W={W} t={t} navigation={props.navigation} />

        <View>
          <Designers data={listDesigner} t={t} navigation={props.navigation} />
          <Videos data={listVideos} t={t} navigation={props.navigation} />
          <Text h2 colorSecondary bold style={{ marginStart: W * 0.06 }}>{t('home:text_news_listings')}</Text>
        </View>
      </View>
    )
  }

  let name = ''
  try {
    name = userProfile ? JSON.parse(userProfile).firstName : ''
  } catch (error) {
    name = userProfile ? userProfile.firstName : ''
  }

  if (shouldScrollToTop != null) {
    this.scroll && this.scroll.scrollToOffset({ animated: true, offset: 0 });
    _onScrolledToTop()
  }

  return (
    <ThemedView isFullView>
      <StatusBar translucent barStyle='light-content' backgroundColor="transparent" />
      <FlatList
        ref={(c) => { this.scroll = c }}
        style={{ flex: 1 }}
        bounces={false}
        maxToRenderPerBatch={5}
        showsVerticalScrollIndicator={false}
        data={listProduct}
        ListHeaderComponent={_onRenderHeader}
        removeClippedSubviews
        onScroll={({ nativeEvent }) => _onScroll(nativeEvent)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ItemListing
          item={item}
          user={userProfile}
          navigation={props.navigation}
          t={t}
          _onBookmark={() => _onBookmark(item.id, !item.bookmarked)}
          _onLikeItem={(id, isLike) => _onLikeItem(id, isLike)}
        />}
        ListFooterComponent={() => {
          if (!isShowLoadMore) return null;
          return (
            <ActivityIndicator
              style={{ color: colors.black }}
            />
          );
        }}
        onEndReachedThreshold={0.4}
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.borderAvt
  },
  containerIcons: {
    marginTop: margin.base,
    flexDirection: 'row'
  },
  header: {
    width: W,
    height: getStatusBarHeight() + HEADER_HEIGHT,
    paddingTop: Platform.OS === 'ios' && H >= 812 ? 30 : 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.black,
    paddingHorizontal: margin.big - 10,
    marginBottom: margin.base,
  },
  icon: {
    marginStart: margin.base + 4
  },
  containerCenter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'absolute',
    left: W / 2 - 40,
    top: Platform.OS == 'ios' && H >= 812 ? 36 : 16
  },
  text: {
    marginTop: margin.base,
    color: colors.white,
  }
})