import React from 'react';
import { ThemedView, Header, IconOrder, LoadingView, Text } from 'src/components';
import * as colors from 'src/components/config/colors';
import { TextHeader, IconHeader } from 'src/containers/HeaderComponent';
import { StatusBar, ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { mainStack } from 'src/config/navigator';
import Item from './item';
import { useNotificationFacade } from './hooks';

export default function Notification({ screenProps, navigation }) {
  const { t } = screenProps
  const { isRefreshing, isLoadMore, notifications, loading, currentPage,
    _onRefreshing, _onClickNotification, _onLoadMore } = useNotificationFacade(navigation);

  return (
    <ThemedView isFullView>
      <StatusBar translucent barStyle='light-content' backgroundColor="transparent" />
      <Header
        backgroundColor={colors.black}
        leftComponent={<IconHeader color={colors.unSelIcon} />}
        centerComponent={<TextHeader titleStyle={{ color: colors.white }} title={t('common:text_notification')} />}
        rightComponent={
          <IconOrder _onPress={() => navigation.navigate(mainStack.my_orders)}/>
        }
      />
      {notifications && notifications.length > 0 ? <FlatList
        style={{ flex: 1 }}
        data={notifications}
        removeClippedSubviews
        maxToRenderPerBatch={8}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            onRefresh={_onRefreshing}
            refreshing={isRefreshing} />
        }
        renderItem={({ item }) => {
          return (
            <Item
              item={item}
              t={t}
              _onClickNotification={() =>
                _onClickNotification(item.id, item.type, item.productId, item.orderId, item.isRead, item.fromUserId)} />
          )
        }}
        ListFooterComponent={() => {
          if (!isLoadMore) return null;
          return (
            <ActivityIndicator
              style={{ color: colors.selIcon }}
            />
          );
        }}
        onEndReachedThreshold={0.4}
        onEndReached={_onLoadMore}
      /> :
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text h3 h3Style={{ color: colors.white }}>{t('notifications:text_empty')}</Text></View>}
      {loading && currentPage == 0 && <LoadingView />}
    </ThemedView>
  )
}