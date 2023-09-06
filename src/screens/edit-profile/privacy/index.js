import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import React, { useState, useEffect } from 'react';
import Modal from 'react-native-modal';
import { View } from "react-native";
import { Icon, Text } from 'src/components';
import { CheckBox } from 'react-native-elements'
import { margin, borderRadius, padding } from 'src/components/config/spacing';
import * as colors from 'src/components/config/colors';

export default function PrivacyModal({ t, isVisible, value, _onChangeVisible, _onChangePrivacy, type }) {
  const [checked, setChecked] = useState()

  useEffect(() => {
    isVisible && setChecked(value)
  }, [isVisible])

  return (
    <View style={styles.modal}>
      <Modal isVisible={isVisible} onBackdropPress={_onChangeVisible}>
        <View style={styles.containerContent}>
          <View style={styles.header}>
            <Icon name='close' type='material-community' size={22} onPress={_onChangeVisible} color={colors.unSelIcon}/>
            <Text h4 colorSecondary numberOfLines={2} medium style={{ marginStart: margin.base * 1.2 }}>{t('profile:text_edit_privacy')}</Text>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => _onChangePrivacy(checked, type)}>
              <Text h5 bold ellipsizeMode='tail' numberOfLines={1} h5Style={{ color: colors.selIcon, marginStart: margin.base }}>{t('profile:text_done')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <TouchableWithoutFeedback onPress={() => setChecked(true)}>
              <View style={[styles.element, { marginBottom: margin.big }]}>
                <CheckBox
                  containerStyle={{ backgroundColor: colors.gray_modal, marginEnd: -margin.small * 0.5, marginTop: -margin.small }}
                  size={24}
                  checkedIcon='dot-circle-o'
                  uncheckedIcon='circle-o'
                  checked={checked}
                  onPress={() => setChecked(true)}
                />
                <Icon name='earth' type='material-community' size={32} color={colors.text_color} />
                <View style={styles.info}>
                  <Text h4 colorSecondary medium>{t('profile:text_public')}</Text>
                  <Text h5 colorSecondary numberOfLines={2} ellipsize='tail'>{t('profile:text_public_desc')}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback  onPress={() => setChecked(false)}>
              <View style={styles.element}>
                <CheckBox
                  containerStyle={{ backgroundColor: colors.gray_modal, marginEnd: -margin.small * 0.5, marginTop: -margin.small }}
                  size={24}
                  checkedIcon='dot-circle-o'
                  uncheckedIcon='circle-o'
                  checked={!checked}
                  onPress={() => setChecked(false)}
                />
                <Icon name='lock' type='material-community' size={32} color={colors.text_color} />
                <View style={styles.info}>
                  <Text h4 colorSecondary medium>{t('profile:text_private')}</Text>
                  <Text h5 colorSecondary numberOfLines={2} ellipsize='tail'>{t('profile:text_private_desc')}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  containerContent: {
    height: 260,
    borderRadius: borderRadius.large,
    paddingVertical: margin.base * 1.5,
    backgroundColor: colors.gray_modal,
    alignItems: 'center',
  },
  close: {
    position: 'absolute',
    top: margin.small,
    end: margin.base
  },
  header: {
    paddingHorizontal: padding.base * 1.5,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  body: {
    alignSelf: 'stretch',
    marginTop: margin.big,
  },
  element: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  modal: {
    flex: 1,
    paddingHorizontal: margin.base,
  },
  info: {
    marginStart: margin.small,
    flex: 1
  },
})