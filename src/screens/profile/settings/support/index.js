import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Icon } from 'src/components';
import * as colors from 'src/components/config/colors';
import { padding, margin } from 'src/components/config/spacing';

export default function Support({ t, _onOpenUrl, _onContactUs }) {
  const options = [t('setting:text_how_it_works'), t('setting:text_faqs'), 
  t('setting:text_contact_us'), t('setting:text_about_borw_app')]

  const onPress = (item) => {
    switch (item) {
      case t('setting:text_how_it_works'): {
        _onOpenUrl('how');
        break
      }
      case t('setting:text_faqs'): {
        _onOpenUrl('faqs');
        break
      }
      case t('setting:text_contact_us'): {
        _onContactUs();
        break
      }
      case t('setting:text_about_borw_app'): {
        _onOpenUrl('os');
        break
      }
      default:
        break;
    }
  }

  return (
    <View style={styles.container}>
      <Text h3 colorSecondary bold style={styles.title}>{t('profile:text_account')}</Text>
      <View style={styles.divider} />
      {options.map((item, index) => (
        <View>
          <TouchableOpacity style={styles.element} onPress={() => onPress(item)}>
            <Text h4 colorSecondary medium style={{ flex: 1, }}>{item}</Text>
            <Icon name='chevron-right' size={26} color={colors.text_color} />
          </TouchableOpacity>
          {index < 4 && <View style={styles.divider} />}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginTop: margin.big,
    flex: 1,
    backgroundColor: colors.black
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