import React from 'react';
import { ThemedView, Header, Text, Modal, Divider, LoadingView } from 'src/components';
import * as colors from 'src/components/config/colors';
import { View, StyleSheet, TouchableOpacity, Dimensions, ScrollView, TextInput } from 'react-native';
import { TextHeader } from 'src/containers/HeaderComponent';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useCompleteOrderFacade } from './hooks';
import { margin, borderRadius, padding } from 'src/components/config/spacing';
import MapView from 'src/screens/shop/MapView/MapView';
import { Dropdown } from 'react-native-material-dropdown';
import Button from 'src/containers/Button';
import moment from 'moment';
import { sizes } from 'src/components/config/fonts';
import * as calculation from 'src/utils/formulas';
import { getDurationPref } from 'src/utils/string';
import { DELIVERY_METHODS } from 'src/modules/common/constants';

export default function CompleteOrder({ screenProps, navigation }) {
  const { t } = screenProps
  const { date, currentDate, showCalendar, deliveryMethods, method, rentalPrice, currency, newFee,
    price, loading, duration, rentPreference, error, transaction, totalPrice, item,
    _onHandleSubmit, _onChangeLocation, _onUpdateAddress,
    _onChangeMethod, _onShowCalendar, _onChangeDuration,
    _onDateChange, _onHandleCancel } = useCompleteOrderFacade(navigation, t);
  const markedDate = {
    [currentDate]: { selected: true, selectedColor: colors.button_color, disabled: true }
  };
  const dateString = moment(date).format('MMM DD, YYYY')
  const buyOutPrice = item ? calculation.getFinalPriceForBuyOut(item.price) : 0
  const rentDuration = item && item.rentDuration && item.rentDuration.split('|')[0]
  const durationPref = item && item.rentDuration && getDurationPref(item.rentDuration.split('|')[1], t)

  LocaleConfig.locales['en'] = {
    monthNames: [t('orders:text_january'), t('orders:text_february'), t('orders:text_march'), t('orders:text_april'), t('orders:text_may'),
    t('orders:text_june'), t('orders:text_july'), t('orders:text_august'), t('orders:text_september'), t('orders:text_october'), t('orders:text_november'), t('orders:text_december')],
    monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    dayNames: [t('orders:text_monday'), t('orders:text_tuesday'), t('orders:text_wednesday'), t('orders:text_thursday'), t('orders:text_friday'),
    t('orders:text_saturday'), t('orders:text_sunday')],
    dayNamesShort: [t('orders:text_monday_short'), t('orders:text_tuesday_short'), t('orders:text_wednesday_short'), t('orders:text_thursday_short'), t('orders:text_friday_short'),
    t('orders:text_saturday_short'), t('orders:text_sunday_short')],
    today: 'Aujourd\'hui'
  };
  LocaleConfig.defaultLocale = 'en';
  
  return (
    <ThemedView isFullView>
      <Header
        backgroundColor={colors.black}
        centerComponent={<TextHeader size={sizes.base} titleStyle={{ color: colors.white, fontSize: sizes.base }} title={t('product:text_complete_order')} />}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>

          {transaction == 'rent' && <View style={styles.containerDate}>
            <Text style={{ flex: 0.4 }} h4 colorSecondary>{t('orders:text_duration')}</Text>
            <View style={{ flex: 0.75 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: margin.base }}>
                <TextInput
                  value={duration}
                  keyboardType='numeric'
                  placeholderTextColor={colors.white}
                  style={[styles.duration, { borderColor: error !== '' ? colors.red : colors.border_color }]}
                  onChangeText={value => _onChangeDuration(value)}
                // placeholder={t('orders:text_duration')} 
                />
                {rentPreference == 'day(s)' && <Text style={{ flex: 0.4 }} h4 colorSecondary>{t('orders:text_days')}</Text>}
                {rentPreference == 'week(s)' && <Text style={{ flex: 0.4 }} h4 colorSecondary>{t('orders:text_weeks')}</Text>}
                {rentPreference == 'month(s)' && <Text style={{ flex: 0.4 }} h4 colorSecondary>{t('orders:text_months')}</Text>}
              </View>
              {error != '' && <Text style={{ color: colors.red, marginBottom: margin.small }}>{error}</Text>}
            </View>
          </View>}

          <View style={styles.containerDate}>
            <Text style={{ flex: 0.6 }} h4 colorSecondary>{transaction == 'rent' ? t('orders:text_start_date') + ':' : t('product:text_pick_up_date')}</Text>
            <TouchableOpacity style={styles.date} onPress={() => _onShowCalendar()}>
              <Text h4 colorSecondary>{dateString}</Text>
            </TouchableOpacity >
          </View>

          <View style={styles.element}>
            <Text style={{ width: 130, marginEnd: margin.small }} h4 colorSecondary>{t('product:text_delivery_option')}</Text>
            <Dropdown
              textColor={colors.white}
              itemColor={colors.white}
              baseColor={colors.white}
              selectedItemColor={colors.selIcon}
              pickerStyle={styles.picker}
              containerStyle={{ width: Dimensions.get('screen').width - 162, top: -margin.base, alignSelf: 'flex-end' }}
              value={method}
              onChangeText={value => _onChangeMethod(value)}
              data={deliveryMethods}
            />
          </View>

          {(method == DELIVERY_METHODS.BY_COURIER) && <Text h4 colorSecondary>{t('shop:text_address')}</Text>}
          {(method == DELIVERY_METHODS.BY_COURIER) && <MapView style={{ marginHorizontal: 0 }} t={t}
            onChangeLocation={location => _onChangeLocation(location)}
            onUpdateAddress={address => _onUpdateAddress(address)}
            editableLocation={null} />}

          <View>
            <Text style={{ marginBottom: margin.base, marginTop: margin.big }} h4 colorSecondary>{t('product:text_price_details')}</Text>
            {transaction == 'donation' && <View style={styles.item}>
              <Text h4 colorSecondary>{t('shop:text_donation')}</Text>
              <Text h4 colorSecondary>{currency}{price}</Text>
            </View>}
            {transaction == 'rent' && item && <View style={styles.item}>
              <Text h4 colorSecondary>{currency}{rentalPrice}/{rentDuration} {durationPref}  x  {duration} {''}</Text>
              <Text h4 colorSecondary>{currency}{price}</Text>
            </View>}
            {transaction == 'buy' && item && <View style={styles.item}>
              <Text h4 colorSecondary>{t('shop:text_buy_out_price')}</Text>
              <Text h4 colorSecondary>{currency}{buyOutPrice}</Text>
            </View>}

            <View style={styles.item}>
              <Text h4 colorSecondary>{t('product:text_delivery_fee')}</Text>
              {(method == DELIVERY_METHODS.BY_COURIER) ? <Text h4 colorSecondary>{currency}{newFee}</Text> :
                <Text h4 colorSecondary>{currency}0.00</Text>}
            </View>

            <Divider style={styles.divider} />
            <View style={styles.item}>
              <Text h4 colorSecondary>{t('cart:text_total')}</Text>
              <Text h4 colorSecondary>{currency}{totalPrice.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.containerButtons}>
            <Button
              title={t('common:text_cancel')}
              onPress={_onHandleCancel}
              backgroundColor={colors.white}
              borderColor={colors.black}
              type='custom'
              containerStyle={styles.button}
            />
            <Button
              buttonStyle={{ backgroundColor: colors.selIcon }}
              titleStyle={{ color: colors.black }}
              title={t('product:text_add_to_cart')}
              loading={loading}
              onPress={_onHandleSubmit}
              containerStyle={styles.button}
            />
          </View>
        </View>

        <Modal
          visible={showCalendar}
          setModalVisible={_onShowCalendar}
          backgroundColor={colors.gray_modal}
          headerStyle={{ marginStart: margin.small }}
          ratioHeight={Platform.OS == 'ios' && Dimensions.get('screen').height >= 812 ? 0.5 : 0.6}>
          <Calendar
            theme={{
              backgroundColor: colors.gray_modal,
              calendarBackground: colors.gray_modal,
              dayTextColor: colors.white,
              monthTextColor: colors.white,
              selectedDayTextColor: colors.selIcon,
              selectedDayBackgroundColor: colors.yellow,
              todayTextColor: colors.selIcon,
              indicatorColor: colors.selIcon,
              selectedDotColor: colors.selIcon,
              arrowColor: colors.selIcon,
            }}
            minDate={moment().format('YYYY-MM-DD')}
            markedDates={markedDate}
            onDayPress={(day) => _onDateChange(day)}
          />
        </Modal>
      </ScrollView>
      {loading && <LoadingView />}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: margin.base,
    marginVertical: margin.big + margin.small,
  },
  containerDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    backgroundColor: colors.black,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: borderRadius.large
  },
  containerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: margin.big
  },
  button: {
    width: 120,
  },
  date: {
    flex: 1,
    borderWidth: 1,
    padding: margin.base,
    borderRadius: 4,
    borderColor: colors.border_color
  },
  divider: {
    height: 2,
    backgroundColor: colors.text_color,
    marginVertical: margin.base
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  element: {
    flexDirection: 'row',
    marginBottom: margin.base,
    alignItems: 'center'
  },
  duration: {
    flex: 0.31,
    color: colors.white,
    fontSize: sizes.h4,
    borderWidth: 1,
    borderRadius: borderRadius.base,
    padding: padding.large,
    marginEnd: margin.small,
    fontFamily: 'Lato-regular'
  },
  dropdown: {
    fontFamily: 'Lato-regular'
  },
  containerDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    marginEnd: margin.small,
  }
})