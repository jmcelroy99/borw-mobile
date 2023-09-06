import React from 'react';
import { Header, ThemedView, Text, LoadingView } from 'src/components';
import { TextHeader, IconHeader } from 'src/containers/HeaderComponent';
import { TouchableOpacity, StyleSheet, ScrollView, View, Dimensions } from 'react-native';
import * as colors from 'src/components/config/colors';
import { margin } from 'src/components/config/spacing';
import { useMyCartFacade } from './hooks';
import ItemCart from './item';
import { getCurrencyDisplay } from 'src/utils/string';
import * as formula from 'src/utils/formulas';
import { DELIVERY_METHODS } from 'src/modules/common/constants';

export default function MyCart({ screenProps }) {
  const { t } = screenProps;
  const { list, loading, totalPrice, shouldShowTotal, _onSubmitOrder, _onRemoveToCart } = useMyCartFacade();
  const currency = list && list[0] && getCurrencyDisplay(list[0].currency)

  return (
    <ThemedView isFullView>
      <Header
        backgroundColor={colors.black}
        leftComponent={<IconHeader color={colors.unSelIcon} />}
        centerComponent={<TextHeader titleStyle={{ color: colors.white }} title={t('cart:text_my_cart')} />}
        rightComponent={
          <TouchableOpacity onPress={() => list.length > 0 && _onSubmitOrder()}>
            <Text h5 bold style={styles.orderNow}>{t('cart:text_order_now')}</Text>
          </TouchableOpacity>
        }
      />
      {list.length > 0 && shouldShowTotal && <View style={styles.containerTotal}>
        <Text h4 h4Style={{ color: colors.white }}>{t('cart:text_total')}</Text>
      <Text h4 h4Style={{ color: colors.white }}>{currency}{totalPrice.toFixed(2)}</Text>
      </View>}

      <ScrollView showsVerticalScrollIndicator={false}>
        {list.map(item => {
          const total = () => {
            if (item.isDonation && item.deliveryFee && item.deliveryMethod == DELIVERY_METHODS.BY_COURIER) {              
              return formula.getFinalPriceForDeliveryForDonation(item.deliveryFee)
            } else return parseFloat(item.totalPrice).toFixed(2)
          }
          return (
            <ItemCart item={item} t={t} _onRemoveToCart={(id) => _onRemoveToCart(id)}
              orderResult={null} total={total()} />
          )
        })}
        {list.length == 0 && <Text style={styles.empty} h3 colorSecondary>{t('cart:text_your_cart_is_empty')}</Text>}
      </ScrollView>
      {loading && <LoadingView />}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  containerTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: margin.base,
    marginHorizontal: margin.base,
  },
  orderNow: {
    color: colors.selIcon
  },
  empty: {
    position: 'absolute',
    alignSelf: 'center',
    top: Dimensions.get('screen').height / 2.5,
  }
})