
import { StyleSheet, View, FlatList, Dimensions, RefreshControl, ActivityIndicator } from "react-native"
import React from 'react';
import Item from './Item/ItemProduct';

export default function ListProduct({ t, list, selectedList, isRefreshing, loading,
  _onChangeSelected, _onDeleteItem, _onEdit, _onClone, _onRefreshing, _onLoadMore }) {

  return (
    <View style={styles.container}>
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={styles.containerContent}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        data={list}
        refreshControl={
          <RefreshControl
            onRefresh={() => _onRefreshing()}
            refreshing={isRefreshing} />
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Item item={item}
          selectedList={selectedList}
          t={t}
          _onChangeSelected={id => _onChangeSelected(id)}
          _onDelete={id => _onDeleteItem(id)}
          _onEdit={(item) => _onEdit(item)}
          _onClone={id => _onClone(id)}
        />}
        ListFooterComponent={() => {
          if (!loading) return null;
          return (
            <ActivityIndicator
              style={{ color: '#000' }}
            />
          );
        }}
        onEndReachedThreshold={0.4}
        onEndReached={() => _onLoadMore()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  containerContent: {
    width: Dimensions.get('screen').width
  },
})