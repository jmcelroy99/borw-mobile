import React from 'react';
import * as colors from 'src/components/config/colors';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Text } from 'src/components';
import { margin, padding, borderRadius } from 'src/components/config/spacing';
import { images } from 'src/utils/images';
import { getNotificationContent } from 'src/utils/string';
import moment from 'moment';
import { isVideo } from 'src/utils/func';
import Video from 'react-native-video';

export default function Item({ _onClickNotification, item, t }) {
  if (!item.product)
    return <></>;
  
    let _image = images.person
  if ((item.type == 'bookmark_profile' || item.type == 'rate_user') && item.user.avatar) {
    _image = { uri: item.user.avatar, priority: FastImage.priority.normal }
  }else if(item.product) {
    _image = {
      uri: item.product.photos[0],
      priority: FastImage.priority.normal
    }
  }
  return (
    <TouchableWithoutFeedback onPress={_onClickNotification}>
      <View style={[styles.container, { backgroundColor: !item.isRead ? colors.gray_modal : colors.black }]}>
        { !isVideo(_image.uri) ? <FastImage
          style={styles.image}
          source={_image}
          resizeMode={FastImage.resizeMode.cover} /> :
          <Video
            source={{uri: _image.uri}}
            style={styles.image}
            resizeMode="cover"
            repeat={true}
            muted={true}
            />
        }
        <View style={{ justifyContent: 'space-between', flex: 1 }}>
          {getNotificationContent(t, item)}
          <Text h5 h5Style={{ color: colors.white }}>{moment(item.updatedAt).format('MMM DD, YYYY HH:mm')}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: padding.base,
    paddingVertical: padding.small,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.normal,
    marginEnd: margin.base,
  }
})