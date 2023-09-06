import React from 'react';
import { View, StyleSheet } from "react-native";
import FastImage from 'react-native-fast-image';
import { Text, ImageAvatar } from 'src/components';
import { margin } from 'src/components/config/spacing';
import { Icon } from 'src/components';
import * as colors from 'src/components/config/colors';

export default function ItemComment({ comment, _onDeleteComment, ownerId, userId, navigation }) {

  return (
    <View style={styles.container}>
      <ImageAvatar 
          url={comment.user.avatar}
          styleAvatar={styles.image}
          id={comment.user.id}
          navigation={navigation} />
      {/* <FastImage
        style={styles.image}
        source={{
          uri: comment.user && comment.user.avatar ? comment.user.avatar :
            'https://s3.eu-central-1.amazonaws.com/storage.propmap.io/staging/uploads/user/avatar/25/user_account_profile_avatar_person_student_male-512.jpg',
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      /> */}
      <Text h5 colorSecondary bold h5Style={styles.owner}>{comment.user.firstName} {comment.user.lastName}  <Text h5 colorSecondary h5Style={styles.comment}>{comment.content}</Text></Text>
      {(userId == ownerId || userId == comment.userId) &&
        <Icon onPress={() => _onDeleteComment(comment.id)} name='trash' type='font-awesome' color={colors.unSelIcon} size={24} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: margin.small,
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginEnd: margin.base
  },
  owner: {
    flex: 1,
    marginTop: margin.tiny
  },
  comment: {
    fontWeight: 'normal'
  }
})