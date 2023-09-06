import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import FastImage from 'react-native-fast-image';
import { mainStack } from 'src/config/navigator';
import { images } from 'src/utils/images';

export default function ImageAvatar({ url, styleAvatar, resizeMode, navigation, id, onPress }) {

  return (
    <TouchableWithoutFeedback onPress={() => {
      if (onPress) {
        onPress();
        setTimeout(() => {
          navigation.navigate(mainStack.user_profile, {
            userId: id
          })
        }, 500);
      } else {
        navigation.navigate(mainStack.user_profile, {
          userId: id
        })
      }
    }}>
      <FastImage
        style={styleAvatar}
        source={url && url.substring(0, 4) == 'http' ? { uri: url, priority: FastImage.priority.normal } : images.person}
        resizeMode={resizeMode}
      />
    </TouchableWithoutFeedback>
  )
}