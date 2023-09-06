import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Icon } from 'src/components';
import * as colors from 'src/components/config/colors';
import { padding, margin } from 'src/components/config/spacing';

export default function MyAccount({ t, _onAddPaymentMethods, _onNavigateMyRatings,
  _onNavigateMyPoints, _onNavigateEditProfile, _onNavigateOrder, _onNavigateBookmark }) {
  const options = [t('setting:text_profile_information'), t('setting:text_my_points'),
  t('setting:text_my_ratings'), t('setting:text_my_orders'), t('setting:text_my_bookmark'),
  t('setting:text_payment_methods')]

  const onPress = (item) => {
    switch (item) {
      case t('setting:text_payment_methods'): {
        _onAddPaymentMethods();
        break
      }
      case t('setting:text_my_ratings'): {
        _onNavigateMyRatings();
        break
      }
      case t('setting:text_my_points'): {
        _onNavigateMyPoints();
        break
      }
      case t('setting:text_profile_information'): {
        _onNavigateEditProfile();
        break
      }
      case t('setting:text_my_orders'): {
        _onNavigateOrder();
        break
      }
      case t('setting:text_my_bookmark'): {
        _onNavigateBookmark();
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
          {index < 5 && <View style={styles.divider} />}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    flex: 1
  },
  element: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: padding.small
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