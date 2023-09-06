import React from 'react';
import { Text, ImageAvatar } from 'src/components';
import { View, StyleSheet, ScrollView, Dimensions, TouchableWithoutFeedback } from 'react-native';
import {
  borderRadius,
  margin,
} from 'src/components/config/spacing';
import { mainStack } from 'src/config/navigator';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import * as colors from 'src/components/config/colors';
import { images } from 'src/utils/images';
import { isVideo } from 'src/utils/func';

const W = Dimensions.get('screen').width;

export default function Videos({ data, t, navigation }) {

  return (
    <View style={styles.viewTab}>
      <View style={styles.containerTitle}>
        <Text h2 colorSecondary bold>{t('home:text_videos')}</Text>
        <Text h5 colorSecondary onPress={() => navigation.navigate(mainStack.show_all_videos)}>{t('home:text_show_all')}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={[styles.viewListTab, { marginEnd: W * 0.06 }]}>
          {data.map((item, index) => {
            const size = item.size.replace('|', ' (') + ')';
            return (
              <TouchableWithoutFeedback style={styles.item} onPress={() => navigation.navigate(mainStack.product_detail, {
                productId: item.id
              })}>
                <View style={{ marginStart: index == 0 ? margin.big : margin.base }}>
                  <View style={styles.containerImages}>
                   { !isVideo(item.photos[0]) ?
                    <FastImage
                      style={styles.image}
                      source={item.photos[0] ? {
                        uri: item.photos[0],
                        priority: FastImage.priority.normal,
                      } : images.person}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                    :                    
                    <Video
                      source={{uri: item.photos[0]}}
                      style={styles.image}
                      resizeMode="cover"
                      repeat={true}
                      muted={true}
                      /> }
                    <ImageAvatar
                      styleAvatar={styles.avatar}
                      url={item.owner.avatar}
                      id={item.owner.id}
                      resizeMode={FastImage.resizeMode.cover}
                      navigation={navigation} />
                  </View>

                  <View style={styles.footer}>
                    <View style={styles.containerInfo}>
                      <Text h5 numberOfLines={1} ellipsizeMode='tail' colorSecondary bold>{item.name}</Text>
                      <Text h6 colorSecondary numberOfLines={1} ellipsizeMode='tail'>{item.categoryName} - {t('home:text_size')} {size}</Text>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  viewTab: {
    marginVertical: margin.base,
  },
  viewListTab: {
    marginBottom: margin.base,
    flexDirection: 'row',
  },
  containerImages: {
    marginBottom: margin.large,
    alignItems: 'flex-start'
  },
  containerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginEnd: W * 0.06,
    marginStart: W * 0.06,
    marginBottom: margin.small
  },
  containerDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerInfo: {
    flexWrap: 'nowrap',
    width: W / 6,
    marginStart: margin.small
  },
  item: {
    width: 161,
    height: 200,
  },
  image: {
    width: 153,
    height: 160,
    borderRadius: borderRadius.medium,
  },
  avatar: {
    width: 30,
    height: 30,
    position: 'absolute',
    zIndex: 1,
    bottom: -margin.large,
    left: margin.base - margin.tiny,
    borderRadius: 25,
    backgroundColor: colors.border_color
  },
  footer: {
    flexDirection: 'row',
    marginTop: - margin.base * 1.2,
    marginStart: 36
  }
})