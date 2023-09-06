import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text } from 'src/components';
import { margin } from 'src/components/config/spacing';
import FastImage from 'react-native-fast-image';
import { images } from 'src/utils/images';
import * as colors from 'src/components/config/colors';
import { _onGetStar } from 'src/utils/formulas';
import { icon } from 'src/utils/images';

export default function ItemComment({ item }) {
  const name = item.owner ? item.owner.firstName + ' ' + item.owner.lastName : ''
  let arrayFullStar = []
  let arrayEmptyStar = []
  const rating = parseFloat(item.value)
  for (let index = 0; index < _onGetStar(rating).toFixed(0); index++) {
    arrayFullStar.push(index)
  }
  for (let index = 0; index < 5 - parseInt(_onGetStar(rating).toFixed(0)); index++) {
    arrayEmptyStar.push(index)
  }

  return (
    <View style={styles.container}>
      <FastImage
        style={styles.image}
        source={item.owner && item.owner.avatar ? {
          uri: item.owner.avatar,
          priority: FastImage.priority.normal
        } : images.person}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.info}>
        <Text h4 colorSecondary bold>{name}</Text>
        <View style={{ flexDirection: 'row' }}>
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
        </View>
        <Text style={{ marginTop: margin.small }} h5 colorSecondary>{item.comment}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: margin.base,
    marginVertical: margin.small,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.selIcon
  },
  info: {
    flex: 1,
    alignItems: 'flex-start',
    marginStart: margin.base,
  },
  star: {
    width: 56,
    height: 56,
    marginHorizontal: - margin.base * 1.3,
    marginTop: - margin.base * 1.4,
    marginBottom: -margin.base * 1.5
  },
})