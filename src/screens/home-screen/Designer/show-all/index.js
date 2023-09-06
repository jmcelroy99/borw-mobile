import React from 'react';
import { ThemedView, Header } from 'src/components';
import { ActivityIndicator, FlatList, StatusBar } from 'react-native';
import { useDesignersFacade } from './hooks';
import ItemListing from '../../ListingItems/Item';
import * as colors from 'src/components/config/colors';
import { TextHeader, IconHeader } from 'src/containers/HeaderComponent';
import { margin } from 'src/components/config/spacing';
import { LoadingView } from 'src/components';
import SearchBar from 'src/screens/home-screen/SearchBar';

export default function ShowAllDesigners({ screenProps, navigation }) {
  const { t } = screenProps;
  const { loading, designers, user, isLoading, _onLikeItem, _onBookmark, _onLoadMore } = useDesignersFacade(t);

  return (
    <ThemedView isFullView>
      <StatusBar translucent barStyle='light-content' backgroundColor="transparent" />
      <Header
        backgroundColor={colors.black}
        leftComponent={<IconHeader color={colors.unSelIcon} />}
        centerComponent={<TextHeader titleStyle={{ color: colors.unSelIcon }} title={t('home:text_designers')} />}
      />

      <SearchBar t={t} navigation={navigation} isDesignersOnly={true} />

      <FlatList
        data={designers}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ marginHorizontal: margin.base }}
        renderItem={({ item }) => (
          <ItemListing
            item={item}
            navigation={navigation}
            t={t} user={user}
            _onBookmark={() => _onBookmark(item.id, !item.bookmarked)}
            _onLikeItem={(id, isLike) => _onLikeItem(id, isLike)} />
        )}
        ListFooterComponent={() => {
          if (!isLoading) return null;
          return (
            <ActivityIndicator
              style={{ color: colors.selIcon }}
            />
          );
        }}
        onEndReachedThreshold={0.4}
        onEndReached={_onLoadMore}
        keyExtractor={(item) => item.id}
      />
      {loading && <LoadingView />}
    </ThemedView>
  )
}