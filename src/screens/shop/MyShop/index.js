import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { ThemedView, Header, IconOrder } from 'src/components';
import { TextHeader, IconHeader } from 'src/containers/HeaderComponent';
import FloatingButton from 'src/components/FloatingButton/floatingButton';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { padding } from 'src/components/config/spacing';
import { mainStack } from 'src/config/navigator';
import ListProduct from './ListProduct/ListProduct';
import * as colors from 'src/components/config/colors';
import { useMyShopFacade } from './hooks';

export default function CategoryScreen({ navigation, screenProps }) {
  const { t } = screenProps;
  const {
    list,
    selectedList,
    isRefreshing,
    loading,
    _onRefreshing,
    _onChangeSelected,
    _onDeleteItem,
    _onEdit,
    _onClone,
    _onAddProduct,
    _onLoadMore } = useMyShopFacade(navigation, t);

  return (
    <ThemedView isFullView>
      <StatusBar translucent barStyle='light-content' backgroundColor="transparent" />
      <Header
        backgroundColor={colors.black}
        leftComponent={<IconHeader color={colors.unSelIcon} />}
        centerComponent={<TextHeader titleStyle={{ color: colors.white }} title={t('shop:text_my_shop')} />}
        rightComponent={
          <IconOrder _onPress={() => navigation.navigate(mainStack.my_orders)}/>
        }
      />
      <ListProduct
        t={t}
        list={list}
        selectedList={selectedList}
        isRefreshing={isRefreshing}
        loading={loading}
        _onRefreshing={_onRefreshing}
        _onChangeSelected={_onChangeSelected}
        _onDeleteItem={_onDeleteItem}
        _onEdit={_onEdit}
        _onLoadMore={_onLoadMore}
        _onClone={_onClone} />
      <FloatingButton addProduct={_onAddProduct} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: getStatusBarHeight(),
  },
  viewSearch: {
    padding: padding.large,
  },
  containerHeader: {
    flexDirection: 'row',
    marginEnd: 8
  },
  header: {
    borderBottomWidth: 1,
  },
});
