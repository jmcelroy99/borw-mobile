import React from 'react';
import { StyleSheet, View, Dimensions, TouchableWithoutFeedback, Switch, TouchableOpacity, TextInput, Image } from 'react-native';
import { ThemedView, Header, Icon, Text, LoadingView, Modal } from 'src/components';
import Input from 'src/containers/input/Input';
import { TextHeader } from 'src/containers/HeaderComponent';
import Button from 'src/containers/Button';
import { padding, margin, borderRadius } from 'src/components/config/spacing';
import { sizes } from 'src/components/config/fonts';
import * as colors from 'src/components/config/colors';
import { images } from 'src/utils/images';
import { useEditProfileFacade } from './hooks';
import MapView from './MapView/MapView';
import FastImage from 'react-native-fast-image';
import PrivacyModal from './privacy';
import Modal2 from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { icon } from 'src/utils/images';

const H = Dimensions.get('screen').height;

export default function EditProfile({ screenProps, navigation }) {
  const { t } = screenProps;
  const { user, formik, isVisible, type, value, accountGoogle, isAlreadyChanged,
    accountFacebook, showModalAvatar, loading, isSubmit, isChangeBusiness,
    _onShowModalChangeEmail, _onSubmit, _onFocusPhoneNo, _onChangeEmail, _onFocusEmail, _onSetEmail,
    _onChangeAvatar, _onChooseOption, _onSetDefaultAddress, _onChangePrivacy, _onChangeVisible,
    _onConnectFacebook, _onConnectGoogle, _onNavigateBack, _onChangeNewEmail, _onChangeBusiness } = useEditProfileFacade(t, navigation);

  const getRatioHeight = () => {
    if (Platform.OS === 'ios' && H >= 812) {
      if (user.avatar && user.avatar.uri != '') {
        return 0.36
      } else return 0.34
    } else if (user.avatar && user.avatar.uri != ''
      && !accountGoogle && !accountFacebook) {
      return 0.34
    } else return 0.4
  }

  return (
    <ThemedView isFullView>
      <Header
        backgroundColor={colors.black}
        leftComponent={<TouchableOpacity onPress={_onNavigateBack}>
          <Icon name="chevron-left" size={26} color={colors.unSelIcon} />
        </TouchableOpacity>}
        centerComponent={<TextHeader titleStyle={{ color: colors.white }} title={t('profile:text_edit_profile')} />}
      />
      {user ? <KeyboardAwareScrollView
        bounces={false}
        enableOnAndroid={true}
        contentContainerStyle={{ alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
        style={styles.containerBody}>
        <TouchableWithoutFeedback onPress={_onChangeAvatar}>
          <View style={{ marginTop: margin.big, marginBottom: margin.base }}>
            <FastImage
              style={styles.avatar}
              resizeMode={FastImage.resizeMode.cover}
              source={user.avatar.uri ? { uri: user.avatar.uri, priority: FastImage.priority.normal } : images.person} />
            <View style={styles.containerImage}>
              <Image source={icon.camera} style={styles.iconCamera} resizeMode='contain' />
            </View>
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.containerForm}>
          <Input
            label={t('profile:text_first_name')}
            value={formik.values['firstName']}
            style={{ fontSize: sizes.h4, color: colors.white }}
            onChangeText={formik.handleChange('firstName')}
            error={formik.errors && formik.errors.firstName}
          />
          <Input
            label={t('profile:text_last_name')}
            value={formik.values['lastName']}
            style={{ fontSize: sizes.h4, color: colors.white }}
            onChangeText={formik.handleChange('lastName')}
            error={formik.errors && formik.errors.lastName}
          />
          <Input
            label={t('profile:text_bio')}
            value={formik.values['bio']}
            style={{ fontSize: sizes.h4, color: colors.white }}
            multiline
            onChangeText={formik.handleChange('bio')}
            error={formik.errors && formik.errors.bio}
          />
          <MapView
            t={t}
            onChangeAddress={(value) => formik.setFieldValue('address', value)}
            CustomComponent={() => {
              return (
                <TouchableWithoutFeedback onPress={() => {
                  _onChangeVisible('address');
                }}>
                  <View style={styles.privacy}>
                    <Icon name={formik.values['isPublicAddress'] ? 'earth' : 'lock'} type='material-community' size={28} color={colors.text_color} />
                    <Icon name='arrow-drop-down' type='material' size={28} color={colors.text_color} />
                  </View>
                </TouchableWithoutFeedback>
              )
            }}
            style={styles.mapView}
            editableLocation={formik.values['location']}
            editableAddress={user && user.address && user.address}
            onChangeLocation={location => formik.setFieldValue('location', location)}
            onUpdateAddress={address => {
              formik.setFieldValue('address', address);
              _onSetDefaultAddress(address)
            }}
            error={formik.errors && formik.errors.address}
          />
          <View style={styles.info}>
            <Input
              flex={1}
              label={t('profile:text_input_email')}
              value={formik.values['email']}
              style={{ fontSize: sizes.h4, color: colors.white }}
              customIcon={!formik.values['isVerified'] ? 'information-outline' : 'checkmark-circle-outline'}
              iconType={!formik.values['isVerified'] ? 'material-community' : 'ionicon'}
              iconSize={22}
              onPress={_onChangeEmail}
              onFocus={_onFocusEmail}
              shouldBlur
              editable
              customIconColor={!formik.values['isVerified'] ? colors.red : colors.green}
              onChangeText={formik.handleChange('email')}
              error={formik.errors && formik.errors.email}
            />
            <TouchableWithoutFeedback onPress={() => {
              _onChangeVisible('email');
            }}>
              <View style={styles.privacy}>
                <Icon name={formik.values['isPublicEmail'] ? 'earth' : 'lock'} type='material-community' size={28} color={colors.text_color} />
                <Icon name='arrow-drop-down' type='material' size={28} color={colors.text_color} />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.info}>
            <Input
              flex={1}
              label={t('profile:text_phone_number')}
              value={formik.values['phoneNumber']}
              onFocus={_onFocusPhoneNo}
              editable
              shouldBlur
              style={{ fontSize: sizes.h4, color: colors.white }}
            />
            <TouchableWithoutFeedback onPress={() => {
              _onChangeVisible('phone');
            }}>
              <View style={styles.privacy}>
                <Icon name={formik.values['isPublicPhone'] ? 'earth' : 'lock'} type='material-community' size={28} color={colors.text_color} />
                <Icon name='arrow-drop-down' type='material' size={28} color={colors.text_color} />
              </View>
            </TouchableWithoutFeedback>
          </View>
          {accountFacebook ? <Input
            LeftComponent={() => {
              return (
                <FastImage
                  style={styles.avatarSocial}
                  resizeMode={FastImage.resizeMode.cover}
                  source={accountFacebook.avatar ? { uri: accountFacebook.avatar, priority: FastImage.priority.normal } : images.person} />
              )
            }}
            containerStyle={styles.elementSocial}
            flex={1}
            value={accountFacebook.name}
            label={t('profile:text_facebook')}
            onFocus={_onConnectFacebook}
            shouldBlur
            editable
            style={{ fontSize: sizes.h4, color: colors.white }}
          /> : <Input
              flex={1}
              label={t('profile:text_facebook')}
              onFocus={_onConnectFacebook}
              editable
              shouldBlur
              style={{ fontSize: sizes.h4, color: colors.white }}
              error={formik.errors && formik.errors.phone_number}
            />}
          {accountGoogle ? <Input
            LeftComponent={() => {
              return (
                <FastImage
                  style={[styles.avatarSocial, { marginTop: - margin.tiny }]}
                  resizeMode={FastImage.resizeMode.cover}
                  source={accountGoogle.user.photo ? { uri: accountGoogle.user.photo, priority: FastImage.priority.normal } : images.person} />
              )
            }}
            containerStyle={styles.elementSocial}
            flex={1}
            value={t('profile:text_google_info', {
              name: accountGoogle.user.familyName + ' ' + accountGoogle.user.givenName,
              email: accountGoogle.user.email
            })}
            label={t('profile:text_google')}
            onFocus={_onConnectGoogle}
            shouldBlur
            multiline
            numberOfLines={2}
            editable
            style={{ fontSize: sizes.h4, paddingTop: padding.base, color: colors.white }}
          /> : <Input
              flex={1}
              label={t('profile:text_google')}
              onFocus={_onConnectGoogle}
              editable
              shouldBlur
              style={{ fontSize: sizes.h4, color: colors.white }}
              error={formik.errors && formik.errors.phone_number}
            />}
        </View>
        <View style={[styles.info, styles.element]}>
          <Text h4 colorSecondary>{t('profile:text_switch_to_business_account')}</Text>
          <Switch
            trackColor={{ true: colors.selIcon, false: Platform.OS == 'android' ? colors.unSelIcon : 'transparent' }}
            thumbColor={colors.white}
            ios_backgroundColor={colors.black}
            style={formik.values['isBusiness'] ? styles.switchEnableBorder : styles.switchDisableBorder}
            value={formik.values['isBusiness']}
            onValueChange={value => {
              formik.setFieldValue('isBusiness', value)
              if (!value) {
                isChangeBusiness && _onChangeBusiness(false)
              }
            }}
          />
        </View>
        {formik.values['isBusiness'] && <View style={styles.containerForm}>
          <Input
            label={t('profile:text_business_name')}
            value={formik.values['businessName']}
            style={{ fontSize: sizes.h4, color: colors.white }}
            onChangeText={(value) => { formik.setFieldValue('businessName', value) }}
            onFocus={() => !isChangeBusiness && _onChangeBusiness(true)}
            error={formik.errors && isChangeBusiness && formik.errors.businessName}
          />
          <Input
            label={t('profile:text_website')}
            value={formik.values['website']}
            style={{ fontSize: sizes.h4, color: colors.white }}
            onChangeText={formik.handleChange('website')}
          />
          <Input
            label={t('profile:text_company_phone')}
            value={formik.values['companyPhone']}
            style={{ fontSize: sizes.h4, color: colors.white }}
            onChangeText={formik.handleChange('companyPhone')}
            error={formik.errors && formik.errors.companyPhone}
          />
          <Input
            label={t('profile:text_vat')}
            value={formik.values['VAT']}
            style={{ fontSize: sizes.h4, color: colors.white }}
            onChangeText={formik.handleChange('VAT')}
          />
          <Input
            label={t('profile:text_details')}
            value={formik.values['businessDetails']}
            style={{ fontSize: sizes.h4, color: colors.white }}
            multiline
            onChangeText={formik.handleChange('businessDetails')}
          />
        </View>}
        <Button
          titleStyle={{ color: colors.black }}
          buttonStyle={styles.button}
          onPress={_onSubmit}
          title={t('profile:text_save_changes')} />
        <PrivacyModal
          t={t}
          isVisible={isVisible}
          value={value}
          type={type}
          _onChangeVisible={_onChangeVisible}
          _onChangePrivacy={(value, type) => _onChangePrivacy(value, type)} />
        <Modal
          backgroundColor={colors.gray_modal}
          visible={showModalAvatar}
          centerElement={(<Text style={{ textAlign: 'center', marginStart: margin.big * 1.4 }} h3 colorSecondary medium>{t('profile:text_change_profile_picture')}</Text>)}
          headerStyle={{ marginStart: margin.small }}
          setModalVisible={_onChangeAvatar}
          ratioHeight={getRatioHeight()}>
          <View style={{ justifyContent: 'space-evenly', flex: 0.95, paddingBottom: padding.base }}>
            <Button
              buttonStyle={{ backgroundColor: colors.selIcon }}
              titleStyle={{ color: colors.black }}
              title={t('profile:text_take_photo')}
              onPress={() => _onChooseOption(1)}
              containerStyle={styles.buttonModal} />
            <Button
              buttonStyle={{ backgroundColor: colors.selIcon }}
              titleStyle={{ color: colors.black }}
              title={t('profile:text_upload_from_library')}
              onPress={() => _onChooseOption(2)}
              containerStyle={styles.buttonModal} />
            {accountFacebook && <Button
              buttonStyle={{ backgroundColor: colors.selIcon }}
              titleStyle={{ color: colors.black }}
              title={t('profile:text_use_facebook_profile_picture')}
              onPress={() => _onChooseOption(3)}
              containerStyle={styles.buttonModal} />}
            {accountGoogle && <Button
              buttonStyle={{ backgroundColor: colors.selIcon }}
              titleStyle={{ color: colors.black }}
              title={t('profile:text_use_google_profile_picture')}
              onPress={() => _onChooseOption(4)}
              containerStyle={styles.buttonModal} />}
            {user.avatar && user.avatar.uri && <Button
              buttonStyle={{ backgroundColor: colors.selIcon }}
              titleStyle={{ color: colors.black }}
              title={t('profile:text_remove_profile_picture')}
              onPress={() => _onChooseOption(5)}
              containerStyle={styles.buttonModal} />}
          </View>
        </Modal>
        <Modal2 isVisible={formik.values['isChangeEmail']}>
          <View style={styles.containerContent}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Text style={styles.titleEmail} h3 colorSecondary>{t('profile:text_enter_new_email')}</Text>
            </View>
            <View style={styles.comment}>
              <TextInput
                style={styles.input}
                value={formik.values['newEmail']}
                placeholder={t('profile:text_example_email')}
                onChangeText={value => _onSetEmail(value)} />
              {isAlreadyChanged && <Text h6 h6Style={{ color: colors.red }}>{formik.errors.newEmail}</Text>}
              <View style={{ flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'space-evenly', marginTop: margin.base }}>
                <Button buttonStyle={{ backgroundColor: colors.selIcon }}
                  titleStyle={{ color: colors.black }}
                  title={t('common:text_cancel')} onPress={_onShowModalChangeEmail} />
                <Button buttonStyle={{ backgroundColor: colors.selIcon }}
                  titleStyle={{ color: colors.black }}
                  title={t('common:text_submit')} onPress={_onChangeNewEmail} />
              </View>
            </View>
          </View>
        </Modal2>
        {loading && <LoadingView />}
      </KeyboardAwareScrollView> : <LoadingView />}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: margin.base,
  },
  containerBody: {
    flex: 1,
  },
  containerForm: {
    alignSelf: 'stretch',
    marginHorizontal: margin.base,
    marginBottom: margin.base
  },
  containerContent: {
    borderRadius: borderRadius.large,
    paddingVertical: margin.base * 1.5,
    backgroundColor: colors.black,
    alignItems: 'center',
  },
  input: {
    borderWidth: 0.5,
    borderColor: colors.border_color,
    height: 56,
    color: colors.white,
    borderRadius: borderRadius.base,
    padding: padding.base,
    fontSize: sizes.h4,
  },
  icon: {
    position: 'absolute',
    bottom: 0,
    end: 2
  },
  buttonModal: {
    backgroundColor: colors.border_color,
    marginVertical: margin.tiny,
    marginHorizontal: margin.base
  },
  button: {
    marginBottom: margin.base * 1.7,
    backgroundColor: colors.selIcon
  },
  titleEmail: {
    flex: 1,
    textAlign: 'center',
    marginBottom: margin.base
  },
  info: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  switch: {
    flex: 0.2,
    marginStart: margin.base
  },
  privacy: {
    flex: 0.2,
    marginStart: margin.base,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  element: {
    alignSelf: 'stretch',
    marginHorizontal: margin.base,
    justifyContent: 'space-between',
    marginVertical: margin.base,
  },
  mapView: {
    marginHorizontal: margin.tiny / 2,
    marginBottom: margin.base * 1.5
  },
  comment: {
    paddingHorizontal: margin.base,
    alignSelf: 'stretch',
  },
  containerImage: {
    position: 'absolute',
    end: 10,
    bottom: 10,
    width: 40,
    height: 40,
    backgroundColor: '#000',
    borderRadius: 20,
    marginVertical: - margin.base * 1.2,
    marginHorizontal: - margin.base * 1.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCamera: {
    width: 64,
    height: 64,
  },                                                                                                     
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.selIcon
  },
  avatarSocial: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  elementSocial: {
    paddingVertical: padding.base * 1.2,
    paddingStart: padding.small
  },
  switchEnableBorder: {
    borderColor: colors.selIcon,
    borderWidth: 1
  },
  switchDisableBorder: {
    borderColor: colors.white,
    borderWidth: 1,
  },
})