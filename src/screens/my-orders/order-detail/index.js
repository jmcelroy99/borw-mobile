import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Dimensions, View } from 'react-native';
import { ThemedView, Header, Text, LoadingView, Modal } from 'src/components';
import { TextHeader, IconHeader } from 'src/containers/HeaderComponent';
import { margin, padding } from 'src/components/config/spacing';
import * as colors from 'src/components/config/colors';
import Icon from 'src/components/icons/Icon';
import TransactionInfo from './transaction-info';
import OrderDetail from './order-detail';
import Delivery from './delivery';
import Status from './status';
import Button from 'src/containers/Button';
import OrderActions from './order-actions';
import Rating from '../rating';
import { useOrderDetailFacade } from './hooks';
import { ORDER_STATUS_CODES, ORDER_STATUS } from 'src/utils/status-orders';
import ExtraFee from './extra-fee';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getCurrencyDisplay } from 'src/utils/string';

export default function OrderDetailScreen({ screenProps, navigation }) {
  const { t } = screenProps;
  const { isCollapse, shouldLoading, orderDetail, sellerImages, buyerImages, isSeller,
    visibleRating, ratingValue, ratingSuccess, shouldPropose, extraFee, description, shouldShowDesc,
    _onChangeMoreActions, _onCancelOrder, _onAddImageOrder, _onDeleteImage, _onGetImagesOrderForBuyer, _onSubmitExtraFee, _onShowMoreDesc, _onPurchaseExtraFee,
    _onArchiveOrder, _onCompleteOrder, _onProposeExtraFeeChange, _onUpdateStatusOrder, _onChangeExtraFee, _onChangeDescription, _onNavigatePayment,
    _onUploadImages, _onGetImagesOrderForSeller, _onRating, _onSubmitRating, _onOpenGmail, _onNavigateMessage } = useOrderDetailFacade(navigation, t);

  const currency = orderDetail && orderDetail.currency ? getCurrencyDisplay(orderDetail.currency) : getCurrencyDisplay('')
  let shouldDisableCancel = false
  let shouldEnableExtra = false
  if (orderDetail) {
    const lastStep = orderDetail.passedSteps[orderDetail.passedSteps.length - 1].split('|')[0];
    shouldEnableExtra = !orderDetail.completed && (lastStep == ORDER_STATUS.RECEIVED_BY_SELLER || lastStep == ORDER_STATUS.REQUEST_EXTRA_FEE)
    const index = ORDER_STATUS_CODES.findIndex(step => step == lastStep)
    if (orderDetail.cancelled) {
      shouldDisableCancel = true
    } else if (index >= 2 && lastStep != ORDER_STATUS.WAITING) {
      shouldDisableCancel = true
    }
  }

  return (
    <ThemedView isFullView>
      <Header
        backgroundColor={colors.black}
        leftComponent={<IconHeader color={colors.unSelIcon} />}
        centerComponent={<TextHeader titleStyle={{ color: colors.white }} title={t('orders:text_order_details')} />}
      />

      <KeyboardAwareScrollView
        enableOnAndroid
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        {orderDetail && <TransactionInfo item={orderDetail} currency={currency} t={t} />}
        {orderDetail && <OrderDetail item={orderDetail} t={t} currency={currency} />}
        {orderDetail && <Delivery item={orderDetail} t={t} _onNavigateMessage={() => _onNavigateMessage()} />}
        {orderDetail && <Status
          isSeller={isSeller}
          sellerImages={sellerImages}
          buyerImages={buyerImages}
          item={orderDetail}
          t={t}
          _onDeleteImage={(data) => _onDeleteImage(data)}
          _onImageAdded={(image) => _onAddImageOrder(image)} />}

        <TouchableOpacity onPress={() => _onChangeMoreActions()}
          style={[styles.moreActions, { marginBottom: !isCollapse ? margin.big * 2 : margin.small }]}>
          <Text h4 colorSecondary>{t('orders:text_more_actions')}</Text>
          <Icon name={!isCollapse ? 'keyboard-arrow-down' : 'keyboard-arrow-up'} type='material' size={24} color={colors.unSelIcon} />
        </TouchableOpacity>

        {isCollapse &&
          <View>
            <View style={styles.containerCollapse}>
              <Button
                buttonStyle={{ backgroundColor: colors.selIcon }}
                titleStyle={{ color: colors.black }}
                onPress={() => _onOpenGmail()}
                title={t('orders:text_contact_admin')}
                containerStyle={styles.button} />
              {isSeller && <Button
                buttonStyle={{ backgroundColor: colors.selIcon }}
                titleStyle={{ color: colors.black }}
                disabled={!shouldEnableExtra}
                onPress={() => _onProposeExtraFeeChange()}
                title={t('orders:text_propse_extra_fee')}
                disabledTitleStyle={{ color: colors.text_color }}
                containerStyle={styles.button} />}
            </View>
            {shouldPropose && !orderDetail.completed && !orderDetail.cancelled && <ExtraFee
              t={t} extraFee={extraFee}
              currency={currency}
              description={description} insurance={orderDetail.price}
              _onSubmitExtraFee={() => _onSubmitExtraFee()}
              _onChangeDescription={desc => _onChangeDescription(desc)}
              _onChangeExtraFee={fee => _onChangeExtraFee(fee)} />}
          </View>}

        <Button
          buttonStyle={{ backgroundColor: colors.selIcon }}
          titleStyle={{ color: colors.black }}
          containerStyle={{ marginHorizontal: margin.base, marginBottom: margin.base }}
          disabled={shouldDisableCancel}
          disabledTitleStyle={{ color: colors.text_color }}
          onPress={() => _onCancelOrder(orderDetail ? orderDetail.id : null)}
          title={t('actions:text_cancel_order')}>
        </Button>

        <Button
          buttonStyle={{ backgroundColor: colors.selIcon }}
          titleStyle={{ color: colors.black }}
          containerStyle={{ marginBottom: margin.big, marginHorizontal: margin.base }}
          disabled={orderDetail && !orderDetail.completed}
          disabledTitleStyle={{ color: colors.text_color }}
          onPress={() => _onArchiveOrder()}
          title={t('orders:text_archive_order')}>
        </Button>
      </KeyboardAwareScrollView>

      {orderDetail && <OrderActions
        shouldPropose={shouldPropose}
        currency={currency}
        rating={ratingSuccess}
        _onNavigateMessage={() => _onNavigateMessage()}
        _onPurchaseExtraFee={() => _onPurchaseExtraFee()}
        _onNavigatePayment={() => _onNavigatePayment()}
        _onShowMoreDesc={() => _onShowMoreDesc()}
        _onProposeExtraFee={() => { _onChangeMoreActions(true); _onProposeExtraFeeChange(true) }}
        _onRating={() => _onRating()}
        _onCompleteOrder={() => _onCompleteOrder()}
        _onGetImagesOrderForSeller={(data) => _onGetImagesOrderForSeller(data)}
        _onGetImagesOrderForBuyer={(data) => _onGetImagesOrderForBuyer(data)}
        _onUploadImages={(orderId, statusCode) => _onUploadImages(orderId, statusCode)}
        _onUpdateStatusOrder={(orderId, statusCode) => _onUpdateStatusOrder(orderId, statusCode)}
        _onCancelOrder={id => _onCancelOrder(id)}
        orderDetail={orderDetail}
        isSeller={isSeller}
        t={t} />}

      <Modal
        backgroundColor={colors.gray_modal}
        visible={shouldShowDesc}
        topLeftElement={() => { return null }}
        headerStyle={{ marginTop: Platform.OS === 'ios' ? margin.base : 0 }}
        setModalVisible={() => _onShowMoreDesc()}
        centerElement={(<Text style={{ flex: 1, textAlign: 'center' }} h3 colorSecondary bold>{t('orders:text_reason_for_extra_fee')}</Text>)}
        ratioHeight={0.5}>
        <ScrollView contentContainerStyle={{ marginHorizontal: margin.big, alignItems: 'center', flex: 1 }}>
          <Text style={{ flex: 0.95 }} colorSecondary h5>{orderDetail && orderDetail.extraFeeNotes ? orderDetail.extraFeeNotes : ''}</Text>
          <Button
            buttonStyle={{ backgroundColor: colors.selIcon }}
            titleStyle={{ color: colors.black }}
            onPress={() => _onShowMoreDesc()}
            containerStyle={styles.button}
            title={t('common:text_cancel')} />
        </ScrollView>
      </Modal>

      <Rating
        isComplete={ratingSuccess}
        partnerAvatar={null}
        rated={orderDetail && orderDetail.rated}
        ratingValue={ratingValue}
        isVisible={visibleRating}
        receiverId={isSeller && orderDetail ? orderDetail.buyer.id : orderDetail ? orderDetail.seller.id : null}
        _onChangeVisible={() => _onRating()}
        t={t}
        _onSubmitRating={(comment, rating, receiverId) => _onSubmitRating(comment, rating, receiverId)} />
      {shouldLoading && <LoadingView />}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: margin.base,
    paddingBottom: margin.base * 2
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
  }
})