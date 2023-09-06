import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'src/components';
import { margin, padding } from 'src/components/config/spacing';
import * as colors from 'src/components/config/colors';
import Input from 'src/containers/input/Input';
import { isNumber } from 'src/utils/string';

export default function PayWithPoint({ t, points, _onChangePoints, ownerPoints, error, currency }) {

  return (
    <View style={styles.container}>
      <Text h3 colorSecondary bold style={styles.title}>{t('orders:text_pay_with_points')}</Text>
      <Text h4 colorSecondary>{t('orders:text_pay_with_points_content', { points: `${ownerPoints}`, currency: `${ownerPoints/100}`, curr: currency })}</Text>

      <Input
        label={t('orders:text_points')}
        value={points}
        keyboardType='number-pad'
        onChangeText={(value) => {
          if (isNumber(value) || value == '') {
            _onChangePoints(value)
          }
        }}
        error={error != '' && error}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.border_color,
    marginHorizontal: margin.base,
    marginBottom: margin.base,
    padding: padding.base
  },
  title: {
    marginBottom: margin.base
  },
})