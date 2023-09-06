import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Icon } from 'src/components';
import { margin } from 'src/components/config/spacing';
import * as colors from 'src/components/config/colors';
import FastImage from 'react-native-fast-image';
import { getRelativeTime } from 'src/utils/time';
import { images } from 'src/utils/images';
import { AVATAR_DEFAULT } from 'src/modules/common/constants';

export default function ItemMessage({ item, _onNavigateConversation, user, t }) {
  const data = item._data
  const updatedAt = data.updatedAt ? getRelativeTime(new Date(data.updatedAt._seconds * 1000), t) : null
  const participant = data.participants.filter(participant => participant.id && participant.id != user.id)[0]
  const unread = data.unread ? data.unread : null
  const lastMessage = () => {
    if (data.isMutedBy && data.isMutedBy[0] == user.id && data.isMutedBy.length > 0) {
      return t('messaging:text_block_room')
    } else if (data.isMutedBy && data.isMutedBy[0] != user.id && data.isMutedBy.length > 0) {
      return t('messaging:text_blocked_room')
    }
    if (data.lastMessage.senderId == user.id) {
      return t('messaging:text_you') + ': ' + data.lastMessage.content
    } else {
      return data.lastMessage.content
    }
  }

  const renderMuteIcon = () => {
    if (data.isMutedBy && data.isMutedBy.length > 0) {
      if (data.isMutedBy[0] == user.id) {
        return (
          <Icon containerStyle={{ position: 'absolute', end: 2, bottom: -2 }}
            name='ban' type='font-awesome' size={20}
            color={colors.red_icon_ban} />
        )
      } else {
        return (
          <Icon containerStyle={{ position: 'absolute', end: 2, bottom: -2 }}
            name='ban' type='font-awesome' size={20}
            color={colors.gray_icon_ban} />
        )
      }
    }
  }

  if (data._id && participant) {
    return (
      <TouchableOpacity style={styles.container} onPress={() =>
        _onNavigateConversation(data._id, participant)}>
        <View>
          <FastImage
            style={styles.image}
            source={participant.avatar && participant.avatar != '' && participant.avatar.localeCompare(AVATAR_DEFAULT) != 0 ? {
              uri: participant.avatar,
              priority: FastImage.priority.normal,
            } : images.person}
            resizeMode={FastImage.resizeMode.cover}
          />
          {renderMuteIcon()}
        </View>
        <View style={styles.containerMessage}>
          <Text h4 colorSecondary bold numberOfLines={1} ellipsizeMode="tail">{participant.name}</Text>
          <Text h5 colorSecondary numberOfLines={1} ellipsizeMode="tail">{lastMessage()}</Text>
        </View>
        <View style={styles.containerInfo}>
          <Text h5 colorSecondary numberOfLines={1} ellipsizeMode="tail">{updatedAt}</Text>
          {unread && <View style={styles.unread} />}
        </View>
      </TouchableOpacity>
    )
  } else return null
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: margin.small,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  containerMessage: {
    flex: 1,
    alignItems: 'flex-start',
    marginStart: margin.base
  },
  containerInfo: {
    alignItems: 'flex-end',
    marginStart: margin.base
  },
  unread: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.red
  }
})