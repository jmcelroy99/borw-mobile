import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { padding, margin } from 'src/components/config/spacing';
import ItemMessage from './item';

export default function ListMessages({ list, t, _onNavigateConversation, user }) {

  return (
    <View style={styles.container}>
      <FlatList
        removeClippedSubviews
        initialNumToRender={10}
        maxToRenderPerBatch={6}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        data={list}
        renderItem={({ item }) => {
            return (
              <ItemMessage
                item={item}
                t={t}
                user={user}
                _onNavigateConversation={(name, partner) => _onNavigateConversation(name, partner)} />
            )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: margin.base
  },
  contentContainer: {
    paddingHorizontal: padding.base
  }
})