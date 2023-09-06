import React from 'react';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet, Image } from 'react-native';
import { margin, padding } from "src/components/config/spacing";
import * as colors from 'src/components/config/colors';
import Button from 'src/containers/Button';
import Slider from '@react-native-community/slider';
import { Icon, Text, Modal } from 'src/components';
import { View } from 'react-native';
import { useFilterFacade } from './hooks';
import { icon } from 'src/utils/images';
import { getParent, getTransaction } from 'src/utils/string';

export default function FilterModal({ shouldVisible, _onChangeVisible, t, navigation, isDesignersOnly, formikValues }) {
  const { types, users, categories, formik, distance,
    _onChangeDistance, _onHandleSubmit } = useFilterFacade(navigation, _onChangeVisible, isDesignersOnly, formikValues, t);

  return (
    <Modal
      backgroundColor={colors.black}
      visible={shouldVisible}
      noBorder={true}
      centerElement={(<Text h3 colorSecondary>{t('home:text_filters')}</Text>)}
      topLeftElement={(
        <TouchableOpacity style={{ flex: 0.48, alignItems: 'flex-start' }} onPress={() => _onChangeVisible()}>
          <Icon name='close' type='material' color={colors.text_color} />
        </TouchableOpacity>)}
      headerStyle={styles.header}
      setModalVisible={() => _onChangeVisible()}
      ratioHeight={1}>

      <ScrollView style={styles.containerOptions} showsVerticalScrollIndicator={false}>
        <Text h4 colorSecondary bold>{t('home:text_types')}</Text>
        {types.map(item => (
          <View style={styles.item}>
            <Text h5 colorSecondary>{getTransaction(item.name, t)}</Text>
            <TouchableOpacity onPress={() => formik.values[item.id]
              ? formik.setFieldValue(item.id, false)
              : formik.setFieldValue(item.id, true)}>
              <Image source={formik.values[item.id] ? icon.optionSelected : icon.optionUnselected}
                style={styles.icon} resizeMode='contain' />
            </TouchableOpacity>
          </View>
        ))}
        <Text style={{ marginTop: margin.big }} h4 colorSecondary bold>{t('home:text_categories')}</Text>
        {categories && categories.map(item => (
          <View style={styles.item}>
            <Text h5 colorSecondary>{getParent(item.name, t)}</Text>
            <TouchableOpacity onPress={() => formik.values[item.id]
              ? formik.setFieldValue(item.id, false)
              : formik.setFieldValue(item.id, true)}>
              <Image source={formik.values[item.id] ? icon.optionSelected : icon.optionUnselected}
                style={styles.icon} resizeMode='contain' />
            </TouchableOpacity>
          </View>
        ))}
        <Text style={{ marginTop: margin.big }} h4 colorSecondary bold>{t('home:text_users')}</Text>
        {users.map(item => (
          <View style={styles.item}>
            <Text h5 colorSecondary>{getParent(item.name, t)}</Text>
            <TouchableOpacity onPress={() => formik.values[item.id]
              ? formik.setFieldValue(item.id, false)
              : formik.setFieldValue(item.id, true)}>
              <Image source={formik.values[item.id] ? icon.optionSelected : icon.optionUnselected}
                style={styles.icon} resizeMode='contain' />
            </TouchableOpacity>
          </View>
        ))}
        <Text style={{ marginTop: margin.big }} h4 colorSecondary bold>{t('home:text_distance_from_you')}</Text>
        <View style={styles.containerSlider}>
          <Slider
            style={{
              width: Dimensions.get('screen').width - (margin.base * 12),
              height: 40,
            
            }}
            onValueChange={value => _onChangeDistance(value.toFixed(0))}
            minimumValue={500}
            maximumValue={100001}
            onSlidingComplete={value => _onChangeDistance(value.toFixed(0))}
            minimumTrackTintColor={colors.selIcon}
            maximumTrackTintColor={colors.unSelIcon}
          />
          <Text h4 medium h4Style={{ color: colors.selIcon }}>{distance}</Text>
        </View>
        <Button
          containerStyle={styles.showResult}
          title={t('home:text_show_result')}
          onPress={() => _onHandleSubmit()}
          backgroundColor={colors.selIcon}
          titleStyle={{ color: colors.black }}
          buttonStyle={{ backgroundColor: colors.selIcon }}
        />
      </ScrollView>
    </Modal >
  )
}

const styles = StyleSheet.create({
  containerSearch: {
    flexDirection: 'row',
    paddingStart: margin.base,
  },
  searchInput: {
    marginStart: - margin.small,
  },
  containerFilter: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  containerSlider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingEnd: padding.base
  },
  filter: {
    marginStart: margin.small,
    marginTop: margin.tiny
  },
  search: {
    flex: 1,
    paddingBottom: padding.small,
    paddingTop: margin.tiny
  },
  icon: {
    width: 60,
    height: 60,
  },
  searchField: {
    backgroundColor: colors.border_color,
    height: 40
  },
  content: {
    marginHorizontal: margin.base,
  },
  header: {
    marginTop: Platform.OS === 'android' ? 0 : margin.big,
    marginStart: margin.base,
  },
  containerOptions: {
    marginHorizontal: margin.base,
    marginStart: margin.big
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    justifyContent: 'space-between',
  },
  showResult: {
    width: 160,
    height: 80,
    alignSelf: 'center',
    marginTop: margin.base
  }
});