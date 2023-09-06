import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, ImageAvatar } from 'src/components';
import * as colors from 'src/components/config/colors'
import { borderRadius, padding, margin } from 'src/components/config/spacing';

export default function LikedList({ likesList, t, navigation, onPress }) {
  return (
    <View style={styles.container}>
      <Text h3 colorSecondary bold>{t('common:text_all_likes')}</Text>
      <View style={styles.divider} />
      {likesList && likesList.length == 0 && <Text h3 colorSecondary style={styles.emptyLike}>{t('product:text_no_like_yet')}</Text>}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={likesList}
        removeClippedSubviews
        style={{ alignSelf: 'stretch' }}
        renderItem={({ item }) => (
          <View style={styles.user}>
            <ImageAvatar url={item.user.avatar}
              styleAvatar={styles.image}
              onPress={onPress}
              id={item.user.id}
              navigation={navigation} />
            <Text h3 colorSecondary medium h3Style={{ flex: 1 }} 
            numberOfLines={1} ellipsizeMode='tail'>{item.user ? item.user.firstName + ' ' + item.user.lastName : ''}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: -margin.base,
    paddingHorizontal: padding.base,
    backgroundColor: colors.gray_modal
  },
  divider: {
    height: 2,
    alignSelf: 'stretch',
    marginTop: margin.small,
    borderRadius: borderRadius.medium,
    backgroundColor: colors.border_color
  },
  user: {
    flexDirection: 'row',
    marginVertical: margin.base,
    alignItems: 'center'
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginEnd: margin.base
  },
  emptyLike: {
    position: 'absolute',
    top: '45%',
  }
})