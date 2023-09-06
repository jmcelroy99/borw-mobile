import React from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import { Text } from 'src/components';
import * as colors from 'src/components/config/colors';
import { padding, margin, borderRadius } from 'src/components/config/spacing';
import { Dropdown } from 'react-native-material-dropdown';

export default function Settings({ t, currencyList, methods, currency, sizesList, size, lang, languages,
  _onChangeByHand, _onChangeByCourier, _onChangeCurrency, _onChangeSize, _onChangeLang }) {

  return (
    <View style={styles.container}>
      <Text h3 colorSecondary bold style={styles.title}>{t('common:text_setting')}</Text>
      <View style={styles.divider} />
      <View style={styles.element}>
        <Text h4 colorSecondary h4Style={{ flex: 1, }}>{t('profile:text_currency')}</Text>
        <View style={[styles.border, { flex: currency == 'gpb' ? 0.6 : currency == 'usd' ? 0.48 : 0.40 }]}>
          <Dropdown
            itemColor={colors.white}
            baseColor={colors.white}
            selectedItemColor={colors.selIcon}
            pickerStyle={styles.picker}
            containerStyle={{ marginTop: -22 }}
            fontSize={14}
            value={currency}
            textColor={colors.white}
            onChangeText={value => _onChangeCurrency(value)}
            data={currencyList}
          />
        </View>
      </View>
      <View style={styles.divider} />
      <View>
        <Text h4 colorSecondary medium>{t('setting:text_delivery_methods')}</Text>
        <Text h5 colorSecondary>{t('setting:text_select_support_methods')}</Text>
        <View style={styles.containerMethods}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text h5Style={{ marginEnd: margin.base }} h5 colorSecondary>{t('setting:text_by_hand')}</Text>
            {methods && <Switch
              trackColor={{ true: colors.selIcon, false: Platform.OS == 'android' ? colors.unSelIcon : 'transparent' }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.black}
              style={methods[0].value ? styles.switchEnableBorder : styles.switchDisableBorder}
              value={methods[0].value}
              onValueChange={value => _onChangeByHand(value)}
            />}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text h5 colorSecondary h5Style={{ marginEnd: margin.base }}>{t('setting:text_by_courier')}</Text>
            {methods && <Switch
              trackColor={{ true: colors.selIcon, false: Platform.OS == 'android' ? colors.unSelIcon : 'transparent' }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.black}
              style={methods[1].value ? styles.switchEnableBorder : styles.switchDisableBorder}
              value={methods[1].value}
              onValueChange={value => _onChangeByCourier(value)}
            />}
          </View>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.element}>
        <Text h4 colorSecondary h4Style={{ flex: 1, }}>{t('setting:text_size_preference')}</Text>
        <View style={[styles.border, { flex: 0.2 }]}>
          <Dropdown
            itemTextStyle={styles.dropdown}
            style={styles.dropdown}
            itemColor={colors.white}
            baseColor={colors.white}
            selectedItemColor={colors.selIcon}
            pickerStyle={styles.picker}
            containerStyle={{ marginTop: -25 }}
            fontSize={16}
            value={size}
            textColor={colors.white}
            onChangeText={value => _onChangeSize(value)}
            data={sizesList}
          />
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.element}>
        <Text h4 colorSecondary h4Style={{ flex: 1, }}>{t('setting:text_system_lang')}</Text>
        <View style={[styles.border, { flex: 0.4 }]}>
          <Dropdown
            itemTextStyle={styles.dropdown}
            style={styles.dropdown}
            itemColor={colors.white}
            baseColor={colors.white}
            selectedItemColor={colors.selIcon}
            pickerStyle={styles.picker}
            containerStyle={{ marginTop: -22 }}
            fontSize={14}
            value={lang}
            textColor={colors.white}
            onChangeText={value => _onChangeLang(value)}
            data={languages}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: margin.big
  },
  element: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: padding.small
  },
  containerMethods: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: margin.small,
    marginBottom: margin.tiny
  },
  divider: {
    backgroundColor: colors.border_color,
    height: 1,
    alignSelf: 'stretch',
    marginVertical: margin.tiny
  },
  border: {
    height: 52,
    paddingHorizontal: padding.base,
    borderColor: colors.border_color,
    borderWidth: 1,
    borderRadius: borderRadius.base
  },
  title: {
    marginBottom: margin.small
  },
  picker: {
    backgroundColor: colors.black,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: borderRadius.large
  },
  switchEnableBorder: {
    borderColor: colors.selIcon,
    borderWidth: 1
  },
  switchDisableBorder: {
    borderColor: colors.white,
    borderWidth: 1,
  },
  dropdown: {
    fontFamily: 'Lato-regular'
  },
})