import React from 'react';
import { StyleSheet, View } from 'react-native';
import Input from 'src/containers/input/Input';
import { Text } from 'src/components';
import { margin, padding, borderRadius } from 'src/components/config/spacing';
import Button from 'src/containers/Button';
import * as colors from 'src/components/config/colors';

export default function ExtraFee({ t, insurance, extraFee, description, _onChangeExtraFee, _onChangeDescription, _onSubmitExtraFee }) {
  let error = null

  if (parseFloat(extraFee) > parseFloat(insurance)) {
    error = t('error:text_extra_fee_over_insurance')
  } else if (parseFloat(extraFee) < 0.5) {
    error = t('validators:text_amount_too_small')
  } else error = null

  return (
    <View style={styles.container}>
      <Text h5 colorSecondary >{t('orders:text_extra_fee_explaination')}</Text>
      <Input
        autoFocus
        label={t('orders:text_extra_fee')}
        value={extraFee}
        onChangeText={(value) => _onChangeExtraFee(value)}
        keyboardType='numeric'
        error={error}
      />
      <Input
        label={t('orders:text_description_optional')}
        value={description}
        onChangeText={(value) => _onChangeDescription(value)}
        multiline
      />
      <Button
        buttonStyle={{ backgroundColor: colors.selIcon }}
        titleStyle={{ color: colors.black }}
        containerStyle={styles.button}
        onPress={() => !error && _onSubmitExtraFee()}
        title={t('common:text_submit')}>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: margin.base,
    marginVertical: margin.small,
    borderWidth: 1,
    borderRadius: borderRadius.large,
    borderColor: colors.border_color,
    padding: padding.base,
  },
  button: {
    marginTop: margin.base,
    marginHorizontal: margin.big * 2,
  }
})