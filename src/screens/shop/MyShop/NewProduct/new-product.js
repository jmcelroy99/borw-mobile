import React from 'react';
import { Header, Text, ThemedView, LoadingView } from 'src/components';
import Input from 'src/containers/input/Input';
import { TextHeader, IconHeader } from 'src/containers/HeaderComponent';
import {
  KeyboardAvoidingView, StyleSheet, View, Image,
  TouchableOpacity, TextInput, ScrollView, Dimensions, Switch, Platform
} from 'react-native';
import { useCreateProductFacade } from './hooks';
import { sizes } from 'src/components/config';
import { margin, borderRadius, padding } from 'src/components/config/spacing';
import { Dropdown } from 'react-native-material-dropdown';
import ImageList from './ImageList/imageList';
import { icon } from 'src/utils/images';
import { mainStack } from 'src/config/navigator';
import * as colors from 'src/components/config/colors';
import MapView from '../../MapView/MapView';
import { getDurationPref } from 'src/utils/string';

const H = Dimensions.get('screen').height

export default function NewProductScreen({ navigation, screenProps }) {
  const { t } = screenProps;
  const isEdit = navigation.getParam('edit')
  const {
    editLocation,
    sizeList,
    seasonList,
    durationList,
    sizePrefList,
    formik,
    images,
    errors,
    isSubmit,
    newImages,
    isLoading,
    finalRentPrice,
    finalBuyOutPrice,
    actualRentReceived,
    actualBuyOutReceived,
    user,
    currency,
    appSetting,
    _onImagePicked,
    _onDeleteImage,
    _onHandleSubmit,
    _onCheckValidType,
    _onPaymentChange,
    _onConfirmDonation,
    _onWarningMethod,
    _onChangePrice,
    _onChangeRentalPrice,
  } = useCreateProductFacade(navigation, t, isEdit);

  const isBuyOut = formik.values['isBuyOut']
  const isRent = formik.values['isRent']
  const isDonation = formik.values['isDonation']
  const payWithPoint = formik.values['payWithPoint']
  const byHand = formik.values['byHand']
  const byCourier = formik.values['byCourier']
  const isDesigner = formik.values['isDesigner']
  const isPublic = formik.values['isPublic']
  let shouldCourier
  let shouldHand
  if (appSetting) {
    if (appSetting.deliveryMethod.length == 1) {
      shouldCourier = appSetting.deliveryMethod.findIndex(method => method == 'courier') == -1
      shouldHand = appSetting.deliveryMethod.findIndex(method => method == 'hand') == -1
    } else {
      shouldCourier = true
      shouldHand = true
    }
  }

  const renderPreviewBox = () => {
    if (isRent && !isBuyOut) {
      return (
        <View style={styles.containerPreview}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text h5 colorSecondary>{t('product:text_final_rental_price')}</Text>
            <Text h5 colorSecondary>{currency}{finalRentPrice} / {formik.values['durationRent']} {getDurationPref(formik.values['durationPref'], t)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text h5 colorSecondary>{t('product:text_actual_rental_received')}</Text>
            <Text h5 colorSecondary>{currency}{actualRentReceived} / {formik.values['durationRent']} {getDurationPref(formik.values['durationPref'], t)}</Text>
          </View>
        </View>
      )
    } else if (isBuyOut && !isRent) {
      return (
        <View style={styles.containerPreview}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text h5 colorSecondary>{t('product:text_final_buy_out_price')}</Text>
            <Text h5 colorSecondary>{currency}{finalBuyOutPrice}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text h5 colorSecondary>{t('product:text_actual_rental_received')}</Text>
            <Text h5 colorSecondary>{currency}{actualBuyOutReceived}</Text>
          </View>
        </View>
      )
    } else if (isBuyOut && isRent) {
      return (
        <View style={styles.containerPreview}>
          <Text h5 colorSecondary bold>{t('product:text_final_buy_out_prices')}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text h5 colorSecondary>     . {t('shop:text_rental')}:</Text>
            <Text h5 colorSecondary>{currency}{finalRentPrice} / {formik.values['durationRent']} {getDurationPref(formik.values['durationPref'], t)}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text h5 colorSecondary>     . {t('shop:text_buy_out')}:</Text>
            <Text h5 colorSecondary>{currency}{finalBuyOutPrice}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text h5 colorSecondary>     . {t('shop:text_insurance')}:</Text>
            <Text h5 colorSecondary>{currency}{formik.values['price']}</Text>
          </View>

          <Text h5 colorSecondary bold>{t('product:text_actual_rental_receiveds')}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text h5 colorSecondary>     . {t('shop:text_rental')}:</Text>
            <Text h5 colorSecondary>{currency}{actualRentReceived} / {formik.values['durationRent']} {getDurationPref(formik.values['durationPref'], t)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text h5 colorSecondary>     . {t('shop:text_buy_out')}:</Text>
            <Text h5 colorSecondary>{currency}{actualBuyOutReceived}</Text>
          </View>
        </View>
      )
    }
  }

  return (
    <ThemedView isFullView>
      <Header
        backgroundColor={colors.black}
        leftComponent={<IconHeader color={colors.unSelIcon} />}
        centerComponent={<TextHeader
          titleStyle={{ color: colors.white }}
          title={isEdit ? t('shop:text_edit_product') : t('shop:text_add_new_product')} />}
        rightComponent={<TouchableOpacity onPress={() => _onHandleSubmit()}>
          <TextHeader titleStyle={{ color: colors.selIcon }} title={t('shop:text_save')} />
        </TouchableOpacity>
        }
      />
      <KeyboardAvoidingView
        behavior="height"
        enabled
        style={styles.keyboard}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: H >= 812 ? padding.base : 0 }} showsVerticalScrollIndicator={false}>
          <ImageList
            shouldEnable={true}
            images={images}
            newImages={newImages} t={t}
            _onDeleteImage={item => _onDeleteImage(item)}
            _onImagePicked={image => _onImagePicked(image)}
            error={formik.errors && isSubmit && formik.errors.hasImage}
          />
          <Input
            label={t('shop:text_product_name')}
            value={formik.values['name']}
            inputContainerStyle={{ colorBackground: colors.black }}
            style={{ fontSize: sizes.h4, color: colors.white }}
            onChangeText={formik.handleChange('name')}
            error={formik.errors && isSubmit && formik.errors.name}
          />
          <Input
            label={t('shop:text_product_description')}
            value={formik.values['description']}
            onChangeText={formik.handleChange('description')}
            style={{ fontSize: sizes.h4, color: colors.white, fontFamily: 'Lato-regular' }}
            multiline
            error={formik.errors && isSubmit && formik.errors.description}
          />

          <Input
            label={t('shop:text_select_product_category')}
            value={formik.values['category']}
            style={{ fontSize: sizes.h4, color: colors.white }}
            onFocus={() => navigation.navigate(mainStack.category)}
          />

          {formik.errors && formik.errors.categoryId && isSubmit && <Text style={[
            styles.textError,
            {
              color: colors.darkColors.colors.error,
            },
          ]}>{t('error:text_require_field')}</Text>}

          <View style={[styles.containerSize]}>
            <View style={{ flex: 0.5 }}>
              <Input
                style={{ color: colors.white }}
                label={t('shop:text_product_size')}
                value={formik.values['size']}
                onChangeText={formik.handleChange('size')}
                error={formik.errors && isSubmit && formik.errors.size}
              />
            </View>
            <Dropdown
              itemTextStyle={styles.dropDownStyle}
              style={styles.dropDownStyle}
              textColor={colors.white}
              itemColor={colors.white}
              baseColor={colors.white}
              selectedItemColor={colors.selIcon}
              pickerStyle={styles.picker}
              containerStyle={[styles.dropdown, { flex: 0.5, top: -margin.small }]}
              label={t('shop:text_size_preference')}
              value={formik.values['sizePref']}
              onChangeText={formik.handleChange('sizePref')}
              data={sizePrefList}
            />
          </View>

          <Dropdown
            itemTextStyle={styles.dropDownStyle}
            style={styles.dropDownStyle}
            textColor={colors.white}
            itemColor={colors.white}
            baseColor={colors.white}
            selectedItemColor={colors.selIcon}
            pickerStyle={styles.picker}
            containerStyle={styles.dropdown}
            label={t('shop:text_select_quantity')}
            value={formik.values['quantity']}
            onChangeText={formik.handleChange('quantity')}
            data={sizeList}
          />

          <Dropdown
            itemTextStyle={styles.dropDownStyle}
            style={styles.dropDownStyle}
            textColor={colors.white}
            itemColor={colors.white}
            baseColor={colors.white}
            selectedItemColor={colors.selIcon}
            pickerStyle={styles.picker}
            containerStyle={styles.dropdown}
            label={t('shop:text_select_season')}
            value={formik.values['season']}
            onChangeText={formik.handleChange('season')}
            data={seasonList}
          />

          <View style={styles.containerType}>
            <TouchableOpacity style={styles.type} onPress={() => {
              if (_onCheckValidType('isBuyOut')) {
                formik.setFieldValue('isBuyOut', !formik.values['isBuyOut'])
                if (!formik.values['isBuyOut']) {
                  formik.setFieldValue('isDonation', false)
                }
              }
            }}>
              <Image source={isBuyOut ? icon.optionSelected : icon.optionUnselected}
                style={styles.icon} resizeMode='contain' />
              <Text h5 medium style={[styles.text, { marginStart: 4, color: isBuyOut ? colors.selIcon : colors.border_color }]} >
                {t('shop:text_buy_out')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.type} onPress={() => {
              if (_onCheckValidType('isRent')) {
                formik.setFieldValue('isRent', !formik.values['isRent'])
                if (!formik.values['isRent']) {
                  formik.setFieldValue('isDonation', false)
                }
              }
            }}>
              <Image source={isRent ? icon.optionSelected : icon.optionUnselected}
                style={styles.icon} resizeMode='contain' />
              <Text h5 medium style={[styles.text, { marginStart: 4, color: isRent ? colors.selIcon : colors.border_color }]} >
                {t('shop:text_rent')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.type} onPress={() => {
              if (_onCheckValidType('isDonation')) {
                _onConfirmDonation()
              }
            }}>
              <Image source={isDonation ? icon.optionSelected : icon.optionUnselected}
                style={styles.icon} resizeMode='contain' />
              <Text h5 medium style={[styles.text, { marginStart: 4, color: isDonation ? colors.selIcon : colors.text_color }]} >
                {t('shop:text_donation')}
              </Text>
            </TouchableOpacity>
          </View>

          {!isDonation && <View>
            <View style={styles.insurance}>
              <View style={{ flex: 1 }}>
                <Input
                  label={t('shop:text_insurance_buy_out')}
                  keyboardType='numeric'
                  value={formik.values['price']}
                  onChangeText={(value) => {
                    _onChangePrice(value)
                  }}
                  error={errors && errors.price}
                />
              </View>
              <Text style={styles.currency}>({currency})</Text>
            </View>

            {isRent && <View style={[styles.insurance, { justifyContent: 'flex-start' }]}>
              <View style={{ flex: 0.52 }}>
                <Input
                  label={t('shop:text_rental_price')}
                  value={formik.values['rentalPrice']}
                  keyboardType='numeric'
                  onChangeText={(value) => {
                    _onChangeRentalPrice(value)
                  }}
                  error={errors && errors.rentalPrice}
                />
              </View>
              <Text h5 style={[styles.currency, { marginEnd: margin.small }]}>({currency}) {t('product:text_per')}</Text>

              <TextInput style={styles.day}
                keyboardType='number-pad'
                value={formik.values['durationRent']}
                onChangeText={formik.handleChange('durationRent')} />

              <Dropdown
                itemTextStyle={styles.dropDownStyle}
                style={styles.dropDownStyle}
                textColor={colors.white}
                itemColor={colors.white}
                baseColor={colors.white}
                selectedItemColor={colors.selIcon}
                pickerStyle={styles.picker}
                containerStyle={styles.ddRentPref}
                value={formik.values['durationPref']}
                onChangeText={formik.handleChange('durationPref')}
                data={durationList}
              />
            </View>}

            {renderPreviewBox()}

            <View style={[styles.type, { marginTop: margin.base }]}>
              <Text style={{ marginEnd: margin.base, color: colors.white }}>{t('shop:text_allow_payment_with_points')}</Text>
              <Switch
                trackColor={{ true: colors.selIcon, false: Platform.OS == 'android' ? colors.unSelIcon : 'transparent' }}
                thumbColor={colors.white}
                ios_backgroundColor={colors.black}
                style={payWithPoint ? styles.switchEnableBorder : styles.switchDisableBorder}
                value={payWithPoint}
                onValueChange={value => _onPaymentChange(value)}
              />
            </View>
          </View>}

          <View style={{...styles.containerDelivery, flex: 1}}>
            {shouldCourier && <TouchableOpacity style={{...styles.type, flex : 1,}} onPress={() => {
              if (!formik.values['byCourier'] && formik.values['byHand']) {
                _onWarningMethod();
                return;
              }
              formik.setFieldValue('byHand', !formik.values['byHand'])
            }}>
              <Image source={byHand ? icon.optionSelected : icon.optionUnselected}
                style={styles.icon} resizeMode='contain' />
              <Text h5 medium
                style={[styles.text, { flexShrink: 1, marginStart: margin.small, color: !byHand ? colors.border_color : colors.selIcon }]} >
                {t('shop:text_delivery_by_hand')}
              </Text>
            </TouchableOpacity>}

            {shouldHand && <TouchableOpacity style={{...styles.type, flex : 1,}} onPress={() => {
              if (!formik.values['byHand'] && formik.values['byCourier']) {
                _onWarningMethod();
                return;
              }
              formik.setFieldValue('byCourier', !formik.values['byCourier'])
            }}>
              <Image source={byCourier ? icon.optionSelected : icon.optionUnselected}
                style={styles.icon} resizeMode='contain' />
              <Text h5 medium number
                style={[styles.text, { flexShrink: 1, marginStart: margin.small, color: !byCourier ? colors.border_color : colors.selIcon }]} >
                {t('shop:text_delivery_by_courier')}
              </Text>
            </TouchableOpacity>}
          </View>

          {!editLocation ? <MapView t={t} onUpdateAddress={(address) => {
            formik.setFieldValue('address', address)
          }}
            onChangeLocation={location => formik.setFieldValue('location', location)} />
            : <MapView t={t} editableLocation={editLocation} onUpdateAddress={(address) => {
              formik.setFieldValue('address', address)
            }}
              onChangeLocation={location => formik.setFieldValue('location', location)} />}

          <View style={[styles.type, { marginTop: margin.base }]}>
            <Text style={{ marginEnd: margin.base + margin.big + 2, color: colors.white }}>{t('shop:text_publish_item')}</Text>
            <Switch
              trackColor={{ true: colors.selIcon, false: Platform.OS == 'android' ? colors.unSelIcon : 'transparent' }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.black}
              style={isPublic ? styles.switchEnableBorder : styles.switchDisableBorder}
              value={isPublic}
              onValueChange={value => formik.setFieldValue('isPublic', value)}
            />
          </View>

          {user && user.isBusiness && <View style={[styles.type, { marginTop: margin.base }]}>
            <Text style={{ marginEnd: margin.base, color: colors.white }}>{t('shop:text_are_you_designer')}</Text>
            <Switch
              trackColor={{ true: colors.selIcon, false: Platform.OS == 'android' ? colors.unSelIcon : 'transparent' }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.black}
              style={isDesigner ? styles.switchEnableBorder : styles.switchDisableBorder}
              value={isDesigner}
              onValueChange={value => formik.setFieldValue('isDesigner', value)}
            />
          </View>}
        </ScrollView>
      </KeyboardAvoidingView>
      {isLoading && <LoadingView />}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    paddingHorizontal: margin.base,
    paddingBottom: margin.base,
    marginTop: margin.base,
  },
  container: {
    flex: 1,
  },
  containerType: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: margin.base
  },
  containerSize: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  containerPreview: {
    borderRadius: borderRadius.base,
    borderWidth: 1,
    marginVertical: margin.base,
    borderColor: colors.unSelIcon,
    paddingHorizontal: padding.base,
    paddingVertical: padding.base,
    justifyContent: 'center'
  },
  containerDelivery: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: margin.base
  },
  switchEnableBorder: {
    borderColor: colors.selIcon,
    borderWidth: 1
  },
  switchDisableBorder: {
    borderColor: colors.white,
    borderWidth: 1,
  },
  picker: {
    backgroundColor: colors.black,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: borderRadius.large
  },
  text: {
    marginVertical: margin.base,
    marginHorizontal: margin.small,
  },
  item: {
    marginHorizontal: margin.base
  },
  dropdown: {
    marginHorizontal: margin.base,
  },
  dropDownStyle: { 
    fontFamily: 'Lato-regular'
  },
  type: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  currency: {
    fontSize: sizes.h4,
    marginTop: margin.small,
    marginStart: margin.small,
    color: colors.white
  },
  insurance: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  textError: {
    fontSize: sizes.h7,
    lineHeight: 15,
    marginBottom: margin.base,
  },
  day: {
    borderWidth: 1,
    minHeight: 46,
    flex: 0.15,
    marginTop: margin.tiny,
    borderColor: colors.unSelIcon,
    color: colors.white,
    borderRadius: borderRadius.base,
    textAlign: 'center',
    fontSize: sizes.h4
  },
  ddRentPref: {
    flex: 0.33,
    marginStart: margin.small,
    marginTop: -margin.small
  },
  icon: {
    width: 56,
    height: 56,
    marginEnd: - margin.base * 1.2
  },
})


