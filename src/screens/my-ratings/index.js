import React from 'react';
import {
  StyleSheet, View, Dimensions, TouchableOpacity, Image,
  Animated, RefreshControl, ActivityIndicator
} from 'react-native';
import { ThemedView, Header, IconOrder, Text } from 'src/components';
import { TextHeader, IconHeader } from 'src/containers/HeaderComponent';
import { margin, padding } from 'src/components/config/spacing';
import { mainStack } from 'src/config/navigator';
import * as colors from 'src/components/config/colors';
import { FlatList } from 'react-native-gesture-handler';
import { useMyRatingsFacade } from './hooks';
import Item from './item';
import { icon } from 'src/utils/images';
import { _onGetStar } from 'src/utils/formulas';

const H = Dimensions.get('screen').height;
const W = Dimensions.get('screen').width;

export default function MyRatings({ navigation, screenProps }) {
  const { t } = screenProps;
  const { totalAverage, ratingsFromSellers, ratingsFromBuyers, moveAnimation, currentTab,
    isRefreshing, loading, sellersAverage, buyersAverage,
    _onChangeTab, _onRefreshing, _onLoadMore } = useMyRatingsFacade(W, navigation);

  let arrayFullStar = []
  let arrayEmptyStar = []
  for (let index = 0; index < _onGetStar(totalAverage).toFixed(0); index++) {
    arrayFullStar.push(index)
  }
  for (let index = 0; index < 5 - parseInt(_onGetStar(totalAverage).toFixed(0)); index++) {
    arrayEmptyStar.push(index)
  }

  return (
    <ThemedView isFullView>
      <Header
        backgroundColor={colors.black}
        leftComponent={<IconHeader color={colors.unSelIcon} />}
        centerComponent={<TextHeader titleStyle={{ color: colors.white }} title={t('ratings:text_my_ratings')} />}
        rightComponent={
          <IconOrder _onPress={() => navigation.navigate(mainStack.my_orders)} />
        }
      />
      <View style={styles.summary}>
        <Text style={{ fontSize: 36, color: colors.selIcon, marginTop: margin.small * 1.2 }} medium>{totalAverage.toFixed(1)}</Text>
        <View style={{ flexDirection: 'row' }}>
          {arrayFullStar.map((item, index) => {
            if (index == arrayFullStar.length - 1 && parseFloat(totalAverage) % 1 !== 0) {
              return (
                <Image source={icon.halfStarBlue} style={styles.star} resizeMode='contain' />
              )
            } else {
              return (
                <Image source={icon.fullStarBlue} style={styles.star} resizeMode='contain' />
              )
            }
          })}
          {arrayEmptyStar.map(() => {
            return (
              <Image source={icon.emptyStarBlue} style={styles.star} resizeMode='contain' />
            )
          })}
        </View>
      </View>

      <View style={styles.containerRating}>
        <View style={styles.rating}>
          <TouchableOpacity onPress={() => _onChangeTab(0)}
            style={styles.tab}>
            <Text numberOfLines={1} h4 h4Style={{ color: colors.white }}>{t('ratings:text_rating_from_seller')}</Text>
            {sellersAverage && <Text h5 h5Style={{ color: colors.white }}>{sellersAverage}/5.0</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => _onChangeTab(1)}
            style={styles.tab}>
            <Text numberOfLines={1} h4 h4Style={{ color: colors.white }}>{t('ratings:text_rating_from_buyers')}</Text>
            {buyersAverage && <Text h5 h5Style={{ color: colors.white }}>{buyersAverage}/5.0</Text>}
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
        contentContainerStyle={{ paddingTop: padding.base }}
        style={{ flex: 1, marginTop: margin.base }}
        showsVerticalScrollIndicator={false}
        data={currentTab == 0 ? ratingsFromSellers : ratingsFromBuyers}
        extraData={currentTab}
        ListEmptyComponent={() => {
          return (
            <View style={styles.empty}>
              <Text h3 colorSecondary>{t('ratings:text_no_ratings')}</Text>
            </View>
          )
        }}
        refreshControl={
          <RefreshControl
            onRefresh={() => _onRefreshing()}
            refreshing={isRefreshing} />
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Item item={item} />}
        ListFooterComponent={() => {
          if (!loading) return null;
          return (
            <ActivityIndicator
              color={colors.selIcon}
            />
          );
        }}
        onEndReachedThreshold={0.4}
        onEndReached={() => _onLoadMore()}
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  summary: {
    height: H / 6.8,
    backgroundColor: colors.gray_modal,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: padding.base * 1.8
  },
  containerRating: {
    height: 57,
    backgroundColor: colors.black
  },
  rating: {
    height: 67,
    backgroundColor: colors.black,
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    width: 80,
    height: 80,
    marginHorizontal: - margin.base * 1.75,
    marginTop: - margin.base * 1.5
  },
  tabText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14
  },
  slider: {
    height: 2,
    width: W / 2,
    backgroundColor: colors.selIcon
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})