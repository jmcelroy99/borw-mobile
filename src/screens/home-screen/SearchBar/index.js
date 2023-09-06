import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import React, { useState } from 'react';
import { padding } from 'src/components/config/spacing';
import { Icon, Text } from 'src/components';
import { margin } from "src/components/config/spacing";
import Search from 'src/screens/home/containers/Search';
import FilterModal from 'src/screens/shop/Search/filter';
import * as colors from 'src/components/config/colors';

const W = Dimensions.get('screen').width;

export default function SearchAndFilterComponent({ t, navigation, isDesignersOnly }) {
  const [isVisible, setVisible] = useState(false)

  return (
    <View style={[styles.container, { paddingStart: W * 0.06, paddingEnd: W * 0.025 }]}>
      <TouchableOpacity style={styles.containerFilter}
        onPress={() => setVisible(!isVisible)}>
        <Icon name='sliders' type='feather' size={24} color={colors.unSelIcon}/>
        <Text h5 colorSecondary style={styles.filter}>
          {t('home:text_filters')}
        </Text>
      </TouchableOpacity>

      <View style={styles.search}>
        <Search
          fields={{
            placeholder: {
              text: t('common:text_search')
            },
          }}
        />
      </View>

      <FilterModal shouldVisible={isVisible} t={t}
        navigation={navigation} _onChangeVisible={() => setVisible(!isVisible)} 
        isDesignersOnly={isDesignersOnly}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingStart: margin.base,
    marginTop: margin.base,
    alignItems: 'center',
  },
  containerFilter: {
    flexDirection: 'row',
  },
  filter: {
    marginStart: margin.small,
    marginTop: margin.tiny
  },
  search: {
    flex: 1,
    paddingBottom: padding.small,
    marginHorizontal: margin.base,
    paddingTop: margin.tiny,
  },
})