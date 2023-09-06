import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Icon } from 'src/components';
import * as colors from 'src/components/config/colors';
import { padding, margin } from 'src/components/config/spacing';

export default function Legal({ t, _onNavigateLegal }) {
  const options = [t('setting:text_temrs_and_conditions'), t('setting:text_privacy_policy'), t('setting:text_borw_membership')]

  const onPress = (item) => {
    switch (item) {
      case t('setting:text_temrs_and_conditions'): {
        _onNavigateLegal('tc')
        break
      }
      case t('setting:text_privacy_policy'): {
        _onNavigateLegal('pp')
        break
      }
      case t('setting:text_borw_membership'): {
        _onNavigateLegal('bm')
        break
      }
      default:
        break;
    }
  }

  return (
    <View style={styles.container}>
      <Text h3 colorSecondary bold style={styles.title}>{t('profile:text_legal')}</Text>
      <View style={styles.divider} />
      {options.map((item, index) => (
        <View>
          <TouchableOpacity style={styles.element} onPress={() => onPress(item)}>
            <Text h4 colorSecondary medium style={{ flex: 1, }}>{item}</Text>
            <Icon name='chevron-right' size={26} color={colors.text_color} />
          </TouchableOpacity>
          {index < 2 && <View style={styles.divider} />}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    marginTop: margin.big * 1.5,
    flex: 1
  },
  element: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: padding.small,
    backgroundColor: colors.black
  },
  divider: {
    backgroundColor: colors.border_color,
    height: 1,
    alignSelf: 'stretch',
  },
  title: {
    marginBottom: margin.small
  }
})