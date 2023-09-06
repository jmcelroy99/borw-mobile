import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { margin, padding } from "src/components/config/spacing";
import * as colors from 'src/components/config/colors';
import { TextHeader, IconHeader } from 'src/containers/HeaderComponent';
import { SearchBar, ThemedView, Header, Icon, Text, LoadingView } from 'src/components';
import { useSearchAndFilterFacade } from './hooks';
import ItemListing from 'src/screens/home-screen/ListingItems/Item';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { View } from 'react-native';
import FilterModal from 'src/screens/shop/Search/filter';

export default function SearchScreen(props) {
  const { search, data, isVisible, user, loading, formik,
    _onChangeVisible, _onUpdateSearch, _onLikeItem } = useSearchAndFilterFacade(props);

  const { t } = props.screenProps;

  return (
    <ThemedView isFullView>
      <Header
        backgroundColor={colors.black}
        centerComponent={
          <TextHeader titleStyle={{ color: colors.white }} title={t('home:text_search_and_filter')} />
        }
        leftComponent={<IconHeader color={colors.unSelIcon} />}
      />
      <View style={styles.containerSearch}>
        <TouchableOpacity style={styles.containerFilter} onPress={() => _onChangeVisible()}>
          <Icon name='sliders' type='feather' size={24} color={colors.unSelIcon} />
          <Text h5 colorSecondary style={styles.filter}>
            {t('home:text_filters')}
          </Text>
        </TouchableOpacity>

        <View style={styles.search}>
          <SearchBar
            searchIcon={() => {
              return (
                <Icon name='search' color={colors.unSelIcon} size={20} />
              )
            }}
            cancelButton={false}
            placeholder={t('common:text_type_here')}
            onChangeText={value => _onUpdateSearch(value)}
            value={search}
            inputStyle={{ color: colors.white }}
            platform="ios"
            onClear={() => _onUpdateSearch('')}
            containerStyle={styles.searchInput}
            inputContainerStyle={styles.inputSearch}
          />
        </View>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListEmptyComponent={() => {
          if (loading) {
            return (
              <View style={{ marginTop: margin.big * 8 }}>
                <LoadingView />
              </View>
            )
          } else return (
            <View style={{ marginTop: margin.big * 8, justifyContent: 'center', alignItems: 'center' }}>
              <Text h3 h3Style={{ color: colors.white, textAlign: 'center' }} >{t('shop:text_no_results_for_filter')}</Text>
            </View>
          )
        }}
        data={data}
        renderItem={({ item }) => (<ItemListing item={item}
          navigation={props.navigation} t={t} user={user}
          _onLikeItem={(id, isLike) => _onLikeItem(id, isLike)} />)}
        keyExtractor={(item) => item.id} />
      <FilterModal shouldVisible={isVisible} t={t} formikValues={formik.values}
        navigation={props.navigation} _onChangeVisible={() => _onChangeVisible()} />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: getStatusBarHeight(),
  },
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
  filter: {
    marginStart: margin.small,
    marginTop: margin.tiny
  },
  search: {
    flex: 1,
    paddingBottom: padding.small,
    paddingTop: margin.tiny
  },
  inputSearch: {
    borderRadius: 40,
    height: 40,
    marginTop: margin.tiny,
    borderWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.text_color
  },
  searchField: {
    backgroundColor: colors.background_colors,
    height: 40
  },
  content: {
    marginHorizontal: margin.base,
  },
});
