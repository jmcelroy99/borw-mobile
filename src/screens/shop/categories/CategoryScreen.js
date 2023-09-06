import { StyleSheet, TouchableOpacity, View, FlatList, Image, Dimensions } from "react-native";
import { Header, Text, ThemedView, Icon } from 'src/components';
import { TextHeader, IconHeader } from 'src/containers/HeaderComponent';
import { SearchBar } from 'src/components';
import { margin, borderRadius } from 'src/components/config/spacing';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import { getTitle } from 'src/utils/string';
import { categories } from '../../../assets/index';
import { useCategoryFacade } from './hooks';
import * as colors from 'src/components/config/colors'

export default function CategoryScreen({ navigation, screenProps }) {
  const { t } = screenProps;
  const { filters, filterList, filterResult, search, genderKids, filterKids, filtersForKids, filterResultForKids,
    _onUpdateSearch, _onChangeFilter, _onSelectCategory, _onChangeFilterForKids } = useCategoryFacade(navigation, t);

  return (
    <ThemedView isFullView>
      <Header
        backgroundColor={colors.black}
        leftComponent={<IconHeader color={colors.unSelIcon} />}
        centerComponent={<TextHeader titleStyle={{ color: colors.white }} title={t('categories:text_categories')} />} />
      <SearchBar
        cancelButton={false}
        placeholder={t('common:text_type_here')}
        onChangeText={value => _onUpdateSearch(value)}
        value={search}
        inputStyle={{ color: colors.white }}
        searchIcon={() => {
          return (
            <Icon name='search' color={colors.unSelIcon} size={20} />
          )
        }}
        onClear={() => _onUpdateSearch(null)}
        inputContainerStyle={styles.inputSearch}
      />
      <View style={styles.containerFilter}>
        {filterList.map((item) => {
          const i = filters.find(t => t.name == item.name)
          return (
            <TouchableOpacity style={styles.filterItem} onPress={() => _onChangeFilter(item.name, isSelected = !i.isSelected)}>
              <MaterialCommunityIcon name={item.iconName} size={32} color={i.isSelected ? colors.selIcon : colors.border_color} />
              <Text h5 medium style={[styles.textFilter, { color: i.isSelected ? colors.selIcon : colors.border_color }]}>{item.name}</Text>
            </TouchableOpacity>
          )
        })}
      </View>

      <View style={styles.containerKids}>
        {filterKids && genderKids.map((item) => {
          const i = filtersForKids.find(t => t.name == item.name)
          return (
            <TouchableOpacity style={styles.filterItem} onPress={() => _onChangeFilterForKids(item.name, isSelected = !i.isSelected)}>
              <Icon name={item.iconName} type={item.iconType} size={32} color={i.isSelected ? colors.selIcon : colors.border_color} />
              <Text h5 medium style={[styles.textFilter, { color: i.isSelected ? colors.selIcon : colors.border_color }]}>{item.name}</Text>
            </TouchableOpacity>
          )
        })}
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <FlatList
          style={{ flex: 1 }}
          ListEmptyComponent={() => {
            if (search == '') {
              return (
                <View style={{ marginTop: 150, justifyContent: 'center', alignItems: 'center' }}>
                  <Text h3 colorSecondary style={{ textAlign: 'center' }}>{t('shop:text_no_filter_is_selected')}</Text>
                </View>
              )
            } else {
              return (
                <View style={{ marginTop: 150, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text h3 colorSecondary style={{ textAlign: 'center' }}>{t('shop:text_no_results_for_filter')}</Text>
                </View>
              )
            }
          }}
          contentContainerStyle={styles.containerItem}
          data={filterResultForKids.length > 0 && filterKids ? filterResultForKids : filterResult}
          numColumns={2}
          renderItem={({ item }) => {
            const title = getTitle(item.title, t)
            
            return (
              <TouchableOpacity style={styles.item} onPress={() => _onSelectCategory(item)}>
                <Image source={categories[item.image]} style={styles.image} resizeMode='cover' />
                <Text style={{ color: colors.white }}>{title}</Text>
              </TouchableOpacity>
            )
          }}
          keyExtractor={({ id }) => id}
        />
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  containerFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerKids: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerItem: {
    alignItems: 'flex-start',
  },
  inputSearch: {
    height: 46,
    borderRadius: borderRadius.big,
    backgroundColor: colors.black,
    borderColor: colors.unSelIcon,
    borderWidth: 1,
    borderBottomColor: colors.unSelIcon
  },
  filterItem: {
    flexDirection: 'row',
    marginHorizontal: margin.small,
    marginVertical: margin.base,
    alignItems: 'center'
  },
  textFilter: {
    marginStart: margin.small / 2,
  },
  item: {
    marginHorizontal: margin.base,
    alignItems: 'center',
    marginBottom: margin.base
  },
  image: {
    width: Dimensions.get('screen').width / 2 - margin.base * 2,
    height: 200,
    borderRadius: borderRadius.large,
  }
})