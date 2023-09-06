import React from 'react';
import { ThemedView, Header, Text } from 'src/components';
import { IconHeader, TextHeader } from 'src/containers/HeaderComponent';
import * as colors from 'src/components/config/colors';
import { FlatList, RefreshControl, ActivityIndicator, Dimensions } from 'react-native';
import FilterBar from './filter-bar';
import { mainStack } from 'src/config/navigator';
import { useMyOrdersFacade } from './hooks';
import ItemProduct from './item';

const W = Dimensions.get('screen').width
const H = Dimensions.get('screen').height

export default function MyOrders({ screenProps, navigation }) {
  const { t } = screenProps;
  const { orders, isRefresh, loading, emptyResult, itemsInCart,
    _onChooseIncoming,
    _onChooseOutgoing,
    _onChooseArchived,
    _onNavigateOrderDetail,
    _onRefreshing, 
    _onLoadMore } = useMyOrdersFacade(navigation);

  return (
    <ThemedView isFullView >
      <Header
        backgroundColor={colors.black}
        leftComponent={<IconHeader color={colors.white} />}
        centerComponent={<TextHeader titleStyle={{ color: colors.white }} title={t('orders:text_my_orders')} />}
      />
      <FilterBar t={t}
        itemsInCart={itemsInCart}
        _onChooseIncoming={_onChooseIncoming}
        _onChooseOutgoing={_onChooseOutgoing}
        _onChooseArchived={_onChooseArchived}
        _onNavigateMyCart={() => navigation.navigate(mainStack.my_cart)} />
      <FlatList
        data={orders}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ItemProduct item={item}
            navigation={navigation} t={t}
            _onNavigateOrderDetail={() => _onNavigateOrderDetail(item.id)} />
        )}
        refreshControl={
          <RefreshControl
            onRefresh={() => _onRefreshing()}
            refreshing={isRefresh} />
        }
        ListFooterComponent={() => {
          if (!loading) { return null }
          return (
            <ActivityIndicator
              style={{ color: colors.black }}
            />
          )
        }}
        onEndReachedThreshold={0.4}
        onEndReached={() => _onLoadMore()}
        keyExtractor={item => item.id} />
      {emptyResult && <Text style={{ position: 'absolute', top: H / 2, end: W / 3.7 }} h3 colorSecondary>{t('orders:text_empty_orders')}</Text>}
    </ThemedView>
  )
}