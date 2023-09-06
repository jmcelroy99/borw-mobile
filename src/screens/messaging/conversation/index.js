import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat';
import { StatusBar, TouchableOpacity, View, StyleSheet, Dimensions, KeyboardAvoidingView } from 'react-native';
import { ThemedView, Icon, LoadingView, Modal, Text } from 'src/components';
import { margin, padding } from 'src/components/config/spacing';
import { mainStack } from 'src/config/navigator';
import * as colors from 'src/components/config/colors';
import Button from 'src/containers/Button';
import { useConversationFacade } from './hooks';
import Message from './message';
import { getStatusBarHeight } from 'src/components/config';
import FastImage from 'react-native-fast-image';
import { images } from 'src/utils/images';

const H = Dimensions.get('screen').height

export default function Conversation({ screenProps, navigation }) {
  const { t } = screenProps;
  const { listMessages, receiver, sender, loading, partner,
    isShowOptions, shouldEnableCheckbox, checkedMessages, isMutedBy,
    _onSendMessages, _onBackToMessages, _onShowModal, _onDeleteMessage,
    _onCheckedMessage, _onChangeOptions, _onChangeMuted } = useConversationFacade(navigation, t);

  const renderOptions = () => {
    if (isMutedBy) {
      if (isMutedBy == sender._id) {
        return (
          <TouchableOpacity disabled={shouldEnableCheckbox && checkedMessages.length == 0}
            onPress={() => shouldEnableCheckbox ? _onDeleteMessage() : _onShowModal()}>
            {shouldEnableCheckbox ? <Icon
              containerStyle={styles.containerHeader}
              name='trash-can-outline'
              type='material-community'
              size={26} color={colors.unSelIcon} /> : <Icon
                containerStyle={styles.containerHeader}
                name='dots-horizontal'
                type='material-community'
                size={30} color={colors.unSelIcon} />}
          </TouchableOpacity>
        )
      } else return null
    } else {
      return (
        <TouchableOpacity disabled={shouldEnableCheckbox && checkedMessages.length == 0}
          onPress={() => shouldEnableCheckbox ? _onDeleteMessage() : _onShowModal()}>
          {shouldEnableCheckbox ? <Icon
            containerStyle={styles.containerHeader}
            name='trash-can-outline'
            type='material-community'
            size={26} color={colors.unSelIcon} /> : <Icon
              containerStyle={styles.containerHeader}
              name='dots-horizontal'
              type='material-community'
              size={30} color={colors.unSelIcon} />}
        </TouchableOpacity>
      )
    }
  }

  const renderIconBan = () => {
    if (isMutedBy) {
      if (isMutedBy == sender._id) {
        return (
          <Icon containerStyle={styles.iconBan}
            name='ban' type='font-awesome' size={20}
            color={colors.red_icon_ban} />
        )
      } else {
        return (
          <Icon containerStyle={styles.iconBan}
            name='ban' type='font-awesome' size={20}
            color={colors.gray_icon_ban} />
        )
      }
    }
  }

  return (
    <ThemedView isFullView>
      <StatusBar translucent barStyle='light-content' backgroundColor="transparent" />
      <View style={styles.header}>
        <TouchableOpacity style={{ flex: shouldEnableCheckbox ? 1 : 0 }} onPress={() => shouldEnableCheckbox ? _onChangeOptions() : _onBackToMessages()}>
          {shouldEnableCheckbox ? <Text h4 h4Style={{ color: colors.unSelIcon }}>{t('common:text_cancel')}</Text> : <Icon color={colors.white} name='chevron-left' type='material' size={32} color={colors.unSelIcon} />}
        </TouchableOpacity>
        {!shouldEnableCheckbox && <View style={styles.containerInfo}>
          <View>
            <FastImage
              style={styles.avatar}
              source={partner && partner.avatar ? {
                uri: partner.avatar,
                priority: FastImage.priority.normal,
              } : receiver && receiver.avatar ? {
                uri: receiver.avatar,
                priority: FastImage.priority.normal,
              } : images.person}
              resizeMode={FastImage.resizeMode.cover}
            />
            {renderIconBan()}
          </View>
          <Text h4 numberOfLines={1}
            ellipsizeMode="tail"
            h4Style={styles.partnerName}>{receiver ? receiver.name : partner ? partner.name : ''}</Text>
        </View>}
        {renderOptions()}
      </View>

      {isMutedBy && <View style={styles.body}>
        {isMutedBy == sender._id ? <Text colorSecondary h4 h4Style={styles.muted} >{t('messaging:text_muted_by_you')}</Text> :
          <Text colorSecondary h4 h4Style={styles.muted}>{t('messaging:text_muted_by_partner')}</Text>}
      </View>}

      {!isMutedBy &&
        <View style={{ flex: 1 }}>
          {listMessages && listMessages.length == 0 && <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: H / 2 - 92 }}>
            <Text h3 colorSecondary>{t('messaging:text_empty_conversation')}</Text>
          </View>}
          <GiftedChat
            user={sender}
            messages={listMessages}
            renderMessage={(mess) => {
              const currentMess = mess.currentMessage
              if (currentMess._id) {
                const checked = checkedMessages.findIndex(item => item == currentMess._id) != -1
                return (
                  <Message
                    t={t}
                    partner={partner ? partner : receiver}
                    checked={checked}
                    currentMess={currentMess}
                    sender={sender}
                    shouldEnableCheckbox={!shouldEnableCheckbox}
                    _onCheckedMessage={id => _onCheckedMessage(id)}
                    _onNavigateItem={productId => navigation.navigate(mainStack.product_detail, {
                      productId: productId
                    })} />
                )
              } else return null
            }}
            onSend={messages => _onSendMessages(messages)}
          />
          {
            Platform.OS === 'android' && <KeyboardAvoidingView behavior="height" />
          }
        </View>}

      <Modal
        visible={isShowOptions}
        topLeftElement={() => { return null }}
        setModalVisible={() => _onShowModal()}
        headerStyle={{ marginBottom: - margin.big }}
        ratioHeight={0.25}>
        <View style={styles.modal}>
          {!isMutedBy && <Button
            title={t('messaging:text_delete_message')}
            buttonStyle={{ backgroundColor: colors.selIcon }}
            titleStyle={{ color: colors.black }}
            onPress={() => { _onChangeOptions(true); _onShowModal(false) }}
            containerStyle={styles.button}
          />}
          {!isMutedBy ? <Button
            buttonStyle={{ backgroundColor: colors.selIcon }}
            titleStyle={{ color: colors.black }}
            title={t('messaging:text_mute_user')}
            onPress={() => _onChangeMuted(false)}
            containerStyle={styles.button}
          /> : <Button
              buttonStyle={{ backgroundColor: colors.selIcon }}
              titleStyle={{ color: colors.black }}
              title={isMutedBy == sender._id ? t('messaging:text_unmute_user') : t('messaging:text_mute_user')}
              onPress={() => _onChangeMuted(false)}
              containerStyle={styles.button}
            />}
          <Button
            buttonStyle={{ backgroundColor: colors.selIcon }}
            titleStyle={{ color: colors.black }}
            title={t('common:text_cancel')}
            onPress={() => _onShowModal(false)}
            containerStyle={styles.button}
          />
        </View>
      </Modal>
      {loading && <LoadingView />}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: margin.big,
    backgroundColor: colors.selIcon
  },
  header: {
    flexDirection: 'row',
    backgroundColor: colors.black,
    height: Platform.OS === 'ios' && H >= 812 ? 56 + getStatusBarHeight() : 48 + getStatusBarHeight(),
    alignItems: 'flex-end',
    paddingBottom: padding.big * 0.3,
    paddingHorizontal: padding.base * 1.3
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginEnd: margin.tiny
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: padding.tiny
  },
  containerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: margin.small,
    marginHorizontal: margin.small,
    paddingEnd: padding.small,
    flex: 1,
  },
  partnerName: {
    flex: 1,
    color: colors.white,
    marginStart: margin.small
  },
  muted: {
    textAlign: 'center',
    alignItems: 'center'
  },
  modal: {
    flex: 1,
    justifyContent: 'space-evenly',
    backgroundColor: colors.gray_modal
  },
  iconBan: {
    position: 'absolute',
    end: 2,
    bottom: -2
  }
})