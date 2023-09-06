import React from 'react';
import { Header, ThemedView, Text, IconOrder } from 'src/components';
import { TextHeader, IconHeader } from 'src/containers/HeaderComponent';
import { TouchableOpacity, StyleSheet, View, Dimensions, Animated, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import * as colors from 'src/components/config/colors';
import { margin } from 'src/components/config/spacing';
import { useMyBookmarkFacade } from './hooks';
import ItemProduct from './item-product';
import { mainStack } from 'src/config/navigator';

const W = Dimensions.get('screen').width
const H = Dimensions.get('screen').height

export default function MyBookmark({ screenProps, navigation }) {
  const { t } = screenProps;
  const { bookmarkedProducts, bookmarkedProfiles, moveAnimation, loading, isRefreshing, loadingLoadMore, currentTab,
    _onChangeTab, _onNavigateProduct, _onRefreshing, _onLoadMore, _onNavigateProfile } = useMyBookmarkFacade(W, navigation);

  return (
    <ThemedView isFullView>
      <Header
        backgroundColor={colors.black}
        leftComponent={<IconHeader color={colors.unSelIcon} />}
        centerComponent={<TextHeader titleStyle={{ color: colors.white }} title={t('setting:text_my_bookmark')} />}
        rightComponent={
          <IconOrder _onPress={() => navigation.navigate(mainStack.my_orders)} />
        }
      />
      <View style={styles.containerRating}>
        <View style={styles.rating}>
          <TouchableOpacity onPress={() => _onChangeTab(0)}
            style={styles.tab}>
            <Text h4 colorSecondary>{t('bookmark:text_saved_item')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => _onChangeTab(1)}
            style={styles.tab}>
            <Text h4 colorSecondary>{t('bookmark:text_saved_profiles')}</Text>
          </TouchableOpacity>
        </View>
        <Animated.View
          style={[
            styles.slider,
            moveAnimation.getLayout()
          ]}
        />
      </View>

      <FlatList
        style={{ flex: 1, marginTop: margin.base }}
        data={currentTab == 0 ? bookmarkedProducts : bookmarkedProfiles}
        numColumns={2}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        removeClippedSubviews
        keyExtractor={(item) => item.id}
        extraData={currentTab}
        ListEmptyComponent={() => {
          if (!loading) return (
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: H / 3 }}>
              <Text h3 colorSecondary>{t('bookmark:text_you_have_no_bookmark')}</Text>
            </View>
          )
          return (
            <ActivityIndicator
              style={{ marginTop: margin.big }}
              color={colors.selIcon}
            />
          );
        }}
        refreshControl={
          <RefreshControl
            tintColor={colors.selIcon}
            onRefresh={_onRefreshing}
            refreshing={isRefreshing} />
        }
        renderItem={({ item }) => {
          return (
            <ItemProduct
              _onNavigateProduct={() => _onNavigateProduct(item.productId)}
              _onNavigateProfile={() => _onNavigateProfile(item.profileId)}
              t={t}
              item={item} />
          )
        }}
        ListFooterComponent={() => {
          if (!loadingLoadMore) return null;
          return (
            <ActivityIndicator
              color={colors.selIcon}
            />
          );
        }}
        onEndReachedThreshold={0.4}
        onEndReached={_onLoadMore} />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  containerTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: margin.base,
    marginHorizontal: margin.base,
  },
  orderNow: {
    color: colors.white
  },
  containerRating: {
    height: 57,
    backgroundColor: colors.text_color
  },
  rating: {
    height: 65,
    backgroundColor: colors.gray_modal,
    flexDirection: 'row',
  },
  containerIcons: {
    marginTop: margin.base,
    flexDirection: 'row'
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slider: {
    height: 2,
    width: W / 2,
    backgroundColor: colors.selIcon
  },
  empty: {
    position: 'absolute',
    alignSelf: 'center',
    top: Dimensions.get('screen').height / 2.5,
  },
})