import React from 'react';
import { StyleSheet, ScrollView, Dimensions, View, KeyboardAvoidingView } from 'react-native';
import { ThemedView, Header, Text, LoadingView, Modal } from 'src/components';
import { TextHeader, IconHeader } from 'src/containers/HeaderComponent';
import { margin, padding } from 'src/components/config/spacing';
import * as colors from 'src/components/config/colors';
import OrderDetail from '../order-detail';
import Button from 'src/containers/Button';
import { usePaymentFacade } from './hooks';
import OrderSummary from './order-summary';
import PayWithPoint from './pay-with-point';

export default function Payment({ screenProps, navigation }) {
  const { t } = screenProps;
  const { order, isShowDetail, points, pointsDiscount, ownerPoints, error, shouldLoading, currency,
    _onShowDetail, _onChangePoints, _onShowPayment, _onShowErrorMinimum } = usePaymentFacade(navigation, t)

  return (
    <ThemedView isFullView>
      <Header
        backgroundColor={colors.black}
        leftComponent={<IconHeader color={colors.unSelIcon} />}
        centerComponent={<TextHeader titleStyle={{ color: colors.white }} title={t('orders:text_payment')} />}
      />

      <KeyboardAvoidingView behavior="height" style={styles.keyboard}>
        {order && <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}>
          <OrderDetail item={order} t={t} currency={currency} />
          <OrderSummary t={t} orderDetail={order} currency={currency}
            _onShowDetail={() => _onShowDetail()} pointsDiscount={pointsDiscount}
            _onShowErrorMinimum={(shouldShow) => _onShowErrorMinimum(shouldShow)} />
          {order.product.payWithPoint && <PayWithPoint t={t} _onChangePoints={points => _onChangePoints(points)}
            points={points} currency={currency}
            ownerPoints={ownerPoints} error={error} />}
          <View style={styles.buttonPayment}>
            <Button buttonStyle={{ backgroundColor: colors.selIcon }}
              titleStyle={{ color: colors.black }}
              title={t('orders:text_proceed_payment')} onPress={() => _onShowPayment()} />
          </View>
        </ScrollView>}
      </KeyboardAvoidingView>

      <Modal
        visible={isShowDetail}
        headerStyle={styles.header}
        topLeftElement={() => { return null }}
        setModalVisible={() => _onShowDetail()}
        centerElement={(<Text style={{ marginStart: margin.big, marginBottom: margin.base }} h3 colorSecondary bold>{t('orders:text_reason_for_insurance_title')}</Text>)}
        ratioHeight={0.5}>
        <View style={styles.content}>
          <Text colorSecondary h4 containerStyle={{ flex: 1 }}>{t('orders:text_reason_for_insurance_content')}</Text>
          <Button
            buttonStyle={{ backgroundColor: colors.selIcon }}
            titleStyle={{ color: colors.black }}
            onPress={() => _onShowDetail()}
            style={{ width: 300, marginTop: margin.big }} title={t('common:text_understood')} />
        </View>
      </Modal>
      {shouldLoading && <LoadingView />}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  container: {
    paddingTop: margin.base
  },
  containerCollapse: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: padding.base
  },
  button: {
    width: Dimensions.get('screen').width / 2 - 24,
    marginBottom: margin.base,
  },
  moreActions: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginStart: margin.base,
  },
  buttonPayment: {
    marginHorizontal: margin.base,
    marginBottom: margin.base * 2
  },
  header: {
    marginTop: Platform.OS === 'ios' ? margin.base : 0,
    marginStart: margin.small
  },
  content: {
    marginHorizontal: margin.big,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
})

