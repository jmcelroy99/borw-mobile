import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Text } from 'src/components';
import { padding, margin, borderRadius } from 'src/components/config/spacing';
import * as colors from 'src/components/config/colors';
import {
  ORDER_STEPS_FOR_SELLER,
  ORDER_STEPS_FOR_BUYER,
  ORDER_STEPS_FOR_RENT, ORDER_STEPS_FOR_DONATION, ORDER_STATUS,
  ORDER_STEPS_FOR_BUY, ORDER_STEPS_HAVE_IMAGES, ORDER_STEPS_FOR_DONATION_DELIVERY
} from 'src/utils/status-orders';
import getStatusFromCode from 'src/utils/status-orders';
import { useStatusFacade } from './hooks';
import { icon } from 'src/utils/images';
import Icon from 'src/components/icons/Icon';
import ImageList from '../ImageList/imageList';
import { DELIVERY_METHODS, ORDER_TRANSACTION_TYPES } from 'src/modules/common/constants';

const getStatusList = ({ transaction, deliveryType, deliveryCost }) => {
  switch (transaction) {
    case ORDER_TRANSACTION_TYPES.DONATION: {
      if (deliveryType == DELIVERY_METHODS.BY_HAND) {
        return ORDER_STEPS_FOR_DONATION
      } else if (deliveryType == DELIVERY_METHODS.BY_COURIER && parseFloat(deliveryCost) > 0) {
        return ORDER_STEPS_FOR_DONATION_DELIVERY
      }
    }
    case ORDER_TRANSACTION_TYPES.RENT:
      return ORDER_STEPS_FOR_RENT
    case ORDER_TRANSACTION_TYPES.BUY:
      return ORDER_STEPS_FOR_BUY
  }
}

export default function Status({ item, t, sellerImages, buyerImages, _onImageAdded, _onDeleteImage, isSeller }) {
  const status = item.passedSteps
  const isCompleted = item.completed
  const lastStep = item.passedSteps[item.passedSteps.length - 1].split('|')[0]
  const { formik, isCollapse, _onChangeCollapse } = useStatusFacade(status, isCompleted)
  const getImages = (stepCode) => {
    if (stepCode == ORDER_STATUS.SENT_FROM_SELLER || stepCode == ORDER_STATUS.RECEIVED_BY_SELLER) {
      if (sellerImages) {
        const arr = sellerImages.filter(i => i.step == stepCode)
        return arr
      }
    } else if (stepCode == ORDER_STATUS.RECEIVED_BY_BUYER || stepCode == ORDER_STATUS.RETURNED_FROM_BUYER) {
      if (buyerImages) {
        const arr = buyerImages.filter(i => i.step == stepCode)
        return arr
      }
    }
    return []
  }

  const statusList = getStatusList(item)
  const _lastStepIndex = statusList.findIndex(step => step == lastStep)

  const _stepList = statusList.map((step, index) => {
    const _status = isCollapse.find(i => i.name == step)
    const _canUpdate = (isSeller ? ORDER_STEPS_FOR_SELLER : ORDER_STEPS_FOR_BUYER).findIndex(_step => _step == step)
    return {
      code: step,
      completed: isCompleted || index <= _lastStepIndex,
      disabled: !isCompleted && (index > _lastStepIndex + 1),
      images: getImages(step),
      isExpand: _status ? _status.isExpand : false,
      shouldEnable: !isCompleted && _canUpdate > -1,
      hasImages: ORDER_STEPS_HAVE_IMAGES.includes(step)
    }
  })
  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: margin.base }} h4 colorSecondary>{t('orders:text_order_status')}</Text>

      {_stepList.map(step => {

        return (
          <View>
            <TouchableOpacity style={styles.element} onPress={() => _onChangeCollapse(step.code)} disabled={step.disabled}>
              <TouchableOpacity onPress={() => _onChangeCollapse(step.code)}>
                <Image source={step.completed ? icon.optionSelected : icon.optionUnselected}
                  style={styles.icon} resizeMode='contain' />
              </TouchableOpacity>
              <Text h4 colorSecondary> {getStatusFromCode(step.code, t)} </Text>
              {step.hasImages && <Icon name={!step.isExpand ? 'keyboard-arrow-down' : 'keyboard-arrow-up'} type='material' size={24} color={colors.unSelIcon} />}
            </TouchableOpacity>

            {step.isExpand && step.hasImages && <ImageList
              shouldEnable={step.shouldEnable}
              images={step.images}
              newImages={[]} t={t}
              _onDeleteImage={i => {
                const temp = []
                temp.push(i.uri.toString())
                const newImage = {
                  photos: temp,
                  orderId: item.id,
                  step: step.code,
                }
                _onDeleteImage(newImage)
              }}
              _onImagePicked={data => {
                const newImage = {
                  image: {
                    ...data,
                  },
                  orderId: item.id,
                  step: step.code,
                }
                _onImageAdded(newImage)
              }}
            />}
          </View>)
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: margin.base,
    marginVertical: margin.small,
    borderWidth: 1,
    borderRadius: borderRadius.large,
    borderColor: colors.border_color,
    padding: padding.base,
  },
  element: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    width: 60,
    height: 60,
  },
})