import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedView, Header, Icon, Text, LoadingView } from 'src/components';
import Input from 'src/containers/input/Input';
import { TextHeader } from 'src/containers/HeaderComponent';
import Button from 'src/containers/Button';
import { padding, margin, borderRadius } from 'src/components/config/spacing';
import { sizes } from 'src/components/config/fonts';
import * as colors from 'src/components/config/colors';
import { Dropdown } from 'react-native-material-dropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useContactUsFacade } from './hooks';

export default function ContactUs({ screenProps, navigation }) {
  const { t } = screenProps;
  const { aboutList, reasonList, about, reason, formik, shouldValidate, loading,
    _onChangeAbout, _onChangeReason, _onSubmit } = useContactUsFacade(t);

  return (
    <ThemedView isFullView>
      <Header
        backgroundColor={colors.black}
        leftComponent={<TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={26} color={colors.unSelIcon} />
        </TouchableOpacity>}
        centerComponent={<TextHeader titleStyle={{ color: colors.white }} title={t('profile:text_contact_us')} />}
      />
      <KeyboardAwareScrollView
        bounces={false}
        enableOnAndroid={true}
        contentContainerStyle={styles.containerStyle}
        showsVerticalScrollIndicator={false}
        style={styles.containerBody}>
        <Text h3 colorSecondary>{t('setting:text_got_unanswered_question')}</Text>
        <Text h3 colorSecondary>{t('setting:text_we_are_here_to_help')}</Text>

        <View style={styles.element}>
          <Text h4 colorSecondary>{t('setting:text_what_is_it_about')}</Text>
          <View style={styles.about}>
            <Dropdown
              textColor={colors.white}
              itemColor={colors.white}
              baseColor={colors.white}
              selectedItemColor={colors.selIcon}
              pickerStyle={styles.picker}
              containerStyle={{ top: - margin.base * 1.5 }}
              value={about.value}
              onChangeText={value => _onChangeAbout(value)}
              data={aboutList}
            />
          </View>
        </View>
        <View style={styles.element}>
          <Text h4 colorSecondary>{t('setting:text_nature_of_your_enquiry')}</Text>
          <View style={styles.about}>
            <Dropdown
              textColor={colors.white}
              itemColor={colors.white}
              baseColor={colors.white}
              selectedItemColor={colors.selIcon}
              pickerStyle={styles.picker}
              containerStyle={{ top: - margin.base * 1.5 }}
              value={reason.value}
              onChangeText={value => _onChangeReason(value)}
              data={reasonList}
            />
          </View>
          <View style={styles.element}>
            <Text h4 colorSecondary>{t('setting:text_provide_more_details')}</Text>
            <Input
              containerStyle={{ borderWidth: 0.5, borderColor: colors.text_color, borderRadius: borderRadius.base }}
              placeholder={t('setting:text_type_something')}
              placeholderTextColor={colors.text_color}
              value={formik.values['detail']}
              inputStyle={{ fontSize: sizes.h4, color: colors.white }}
              multiline
              onChangeText={formik.handleChange('detail')}
              error={formik.errors && shouldValidate && formik.errors.detail}
            />
          </View>
          <View style={styles.element}>
            <Text h4 colorSecondary>{t('setting:text_whats_your_email')}</Text>
            <Text h5 colorSecondary>{t('setting:text_we_response_to_your_enquiries')}</Text>
            <Input
              containerStyle={{ borderWidth: 0.5, borderColor: colors.text_color, borderRadius: borderRadius.base }}
              label={t('inputs:text_email')}
              value={formik.values['email']}
              style={{ fontSize: sizes.h4, color: colors.white }}
              onChangeText={value => {
                formik.setFieldValue('email', value)
              }}
              error={formik.errors && formik.errors.email}
            />
          </View>
        </View>
        <Button
          titleStyle={{ color: colors.black }}
          buttonStyle={styles.button}
          onPress={_onSubmit}
          title={t('common:text_submit')} />
      </KeyboardAwareScrollView>
      {loading && <LoadingView />}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  containerContent: {
    borderRadius: borderRadius.large,
    paddingVertical: margin.base * 1.5,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  containerStyle: {
    alignItems: 'center',
    paddingTop: padding.base,
    paddingHorizontal: padding.big
  },
  about: {
    borderWidth: 0.5,
    borderColor: colors.text_color,
    borderRadius: borderRadius.base,
    paddingHorizontal: padding.base,
    marginTop: margin.small,
    height: 56
  },
  input: {
    borderWidth: 0.5,
    borderColor: colors.border_color,
    height: 56,
    color: colors.text_color,
    borderRadius: borderRadius.base,
    padding: padding.base,
    fontSize: sizes.h4,
  },
  button: {
    width: 100,
    marginTop: margin.big * 1.5,
    backgroundColor: colors.selIcon
  },
  switch: {
    flex: 0.2,
    marginStart: margin.base
  },
  element: {
    alignSelf: 'stretch',
    marginTop: margin.big
  },
  picker: {
    backgroundColor: colors.black,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: borderRadius.large
  },
})