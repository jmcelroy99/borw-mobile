import { useEffect, useState } from "react";
import { getOrderDetail } from '../actions';
import { useDispatch, useSelector } from "react-redux";
import globalConfig from 'src/utils/global';
import {
  cancelOrder, updateStatusOrder, addOrderPhotos,
  getOrderPhotos, deleteOrdePhoto, completeOrder,
  ratingUser, archiveOrder, purchaseExtraFee,
} from './actions';
import { updateProduct } from '../../shop/MyShop/actions';
import ImagePicker from 'react-native-image-crop-picker';
import { Alert, Linking, ActionSheetIOS } from 'react-native';
import { ORDER_STATUS_CODES, ORDER_STATUS } from 'src/utils/status-orders';
import { mainStack } from 'src/config/navigator';
import { uniqueImagesArr } from 'src/utils/func';
import { DELIVERY_METHODS, ORDER_TRANSACTION_TYPES } from 'src/modules/common/constants';

let deletedImage = '';

const useOrderDetailFacade = (navigation, t) => {
  const dispatch = useDispatch();
  const orderId = navigation.getParam('orderId')
  const [isCollapse, setCollapse] = useState(false)
  const [shouldLoading, setLoading] = useState(true)
  const [orderDetail, setOrderDetail] = useState()
  const [image, setImage] = useState()
  const [isSeller, setSeller] = useState(false)
  const [shouldPropose, setPropose] = useState(false)
  const [visibleRating, setVisibleRating] = useState(false)
  const [shouldShowDesc, setShowDesc] = useState(false)
  const [extraFee, setExtraFee] = useState(null)
  const [description, setDescription] = useState('')
  const [ratingValue, setRatingValue] = useState(null)
  const [sellerImages, setSellerImages] = useState([])
  const [buyerImages, setBuyerImages] = useState([])
  const { order, isLoading } = useSelector(state => state.orders)
  let { updateSuccess, sellerPhotos, valueRating, purchaseExtraSuccess,
    buyerPhotos, deleteSuccess, loading, ratingSuccess, completeSuccess, archiveSuccess } = useSelector(state => state.orderStatus)

  const user = globalConfig.getUser()

  useEffect(() => {
    setLoading(isLoading || loading)
  }, [isLoading, loading])

  useEffect(() => {
    if (sellerPhotos && sellerPhotos.photos && orderDetail && sellerPhotos.orderId == orderDetail.id) {
      const lastStep = orderDetail.passedSteps[orderDetail.passedSteps.length - 1].split('|')[0]
      if (lastStep != ORDER_STATUS.WAITING && sellerPhotos.photos.length > 0 && isSeller) {

        if ((lastStep == ORDER_STATUS.SELLER_CONFIRMED && orderDetail.transaction == ORDER_TRANSACTION_TYPES.DONATION) ||
          (lastStep == ORDER_STATUS.PAYED_BY_BUYER && orderDetail.transaction == ORDER_TRANSACTION_TYPES.DONATION && orderDetail.deliveryType == DELIVERY_METHODS.BY_COURIER) ||
          (lastStep == ORDER_STATUS.PAYED_BY_BUYER && orderDetail.transaction != ORDER_TRANSACTION_TYPES.DONATION)) {
          const data = {
            orderId,
            status: ORDER_STATUS.SENT_FROM_SELLER
          }
          dispatch(updateStatusOrder(data))
        } else if (lastStep == ORDER_STATUS.RETURNED_FROM_BUYER && sellerPhotos.step == ORDER_STATUS.RECEIVED_BY_SELLER && isSeller) {
          const data = {
            orderId,
            status: ORDER_STATUS.RECEIVED_BY_SELLER
          }
          dispatch(updateStatusOrder(data))
        }
      }
      const images = [...sellerImages]
      for (let index = 0; index < sellerPhotos.photos.length; index++) {
        const image = {
          uri: sellerPhotos.photos[index],
          step: sellerPhotos.step
        }
        images.push(image)
      }
      setSellerImages(uniqueImagesArr(images))
    }
  }, [sellerPhotos])

  useEffect(() => {
    if (buyerPhotos && buyerPhotos.photos && orderDetail && buyerPhotos.orderId == orderDetail.id) {
      const lastStep = orderDetail.passedSteps[orderDetail.passedSteps.length - 1].split('|')[0]

      if (lastStep != ORDER_STATUS.WAITING && lastStep != ORDER_STATUS.SELLER_CONFIRMED && lastStep != ORDER_STATUS.PAYED_BY_BUYER) {
        if (buyerPhotos.photos.length > 0 && !isSeller) {
          if (lastStep != ORDER_STATUS.RECEIVED_BY_BUYER
            && lastStep != ORDER_STATUS.RETURNED_FROM_BUYER
            && lastStep != ORDER_STATUS.RECEIVED_BY_SELLER
            && lastStep != ORDER_STATUS.REQUEST_EXTRA_FEE
            && lastStep != ORDER_STATUS.PAYED_EXTRA_FEE) {
            const data = {
              orderId: orderDetail.id,
              status: ORDER_STATUS.RECEIVED_BY_BUYER
            }
            dispatch(updateStatusOrder(data))
          } else if (lastStep == ORDER_STATUS.RECEIVED_BY_BUYER && buyerPhotos.step == ORDER_STATUS.RETURNED_FROM_BUYER) {
            const data = {
              orderId: orderDetail.id,
              status: ORDER_STATUS.RETURNED_FROM_BUYER
            }
            dispatch(updateStatusOrder(data))
          }
        }
      }
      const images = [...buyerImages]
      for (let index = 0; index < buyerPhotos.photos.length; index++) {
        const image = {
          uri: buyerPhotos.photos[index],
          step: buyerPhotos.step
        }
        images.push(image)
      }
      setBuyerImages(uniqueImagesArr(images))
    }
  }, [buyerPhotos])

  useEffect(() => {
    dispatch(getOrderDetail(orderId))
  }, [])

  useEffect(() => {
    valueRating && dispatch(getOrderDetail(orderId))
    if (valueRating && orderDetail && orderDetail.isCompleted) {
      setRatingValue(valueRating, () => {
        _onRating()
      })
    }
  }, [valueRating])

  useEffect(() => {
    if (updateSuccess) {
      updateSuccess = null;
      dispatch(getOrderDetail(orderId))
    } else if (purchaseExtraSuccess) {
      purchaseExtraSuccess = null;
      dispatch(getOrderDetail(orderId))
    }
  }, [updateSuccess, purchaseExtraSuccess])

  useEffect(() => {
    if (completeSuccess) {
      completeSuccess = null;
      dispatch(getOrderDetail(orderId))
    }
  }, [completeSuccess])

  useEffect(() => {
    if (archiveSuccess && orderDetail) {
      navigation.goBack()
    }
  }, [archiveSuccess])

  useEffect(() => {
    if (deleteSuccess && orderDetail) {
      if (isSeller) {
        if (sellerImages.length > 0) {
          const index = sellerImages.findIndex(i => i.uri == deletedImage);
          if (index != -1) {
            const temp = [...sellerImages]
            temp.splice(index, 1)
            setSellerImages(temp)
          }
        }
      } else {
        const index = buyerImages.findIndex(i => i.uri == deletedImage);
        if (index != -1) {
          const temp = [...buyerImages]
          temp.splice(index, 1)
          setBuyerImages(temp)
        }
      }
    }
  }, [deleteSuccess])

  useEffect(() => {
    if (order) {
      _onGetImagesOrderForSeller({
        step: ORDER_STATUS.SENT_FROM_SELLER,
        orderId: order.id
      })

      setOrderDetail(order)
      const isSeller = user.id == order.seller.id

      setSeller(isSeller)

      if (order.passedSteps && order.passedSteps.length > 0) {
        const lastStep = order.passedSteps[order.passedSteps.length - 1].split('|')[0];

        if (!isSeller && order.transaction != 'rent' &&
          lastStep == ORDER_STATUS.RECEIVED_BY_BUYER && !order.completed) {
          const data = {
            orderId: order.id,
          }
          dispatch(completeOrder(data))
        } else if (lastStep == ORDER_STATUS.PAYED_EXTRA_FEE && !isSeller && !order.completed &&
          order.transaction == ORDER_TRANSACTION_TYPES.RENT) {
          const data = {
            orderId: order.id,
          }
          dispatch(completeOrder(data))
        }
      }
    }
  }, [order])

  useEffect(() => {
    if (image) {
      const lastStep = order.passedSteps[order.passedSteps.length - 1].split('|')[0];
      const newImage = {image, orderId: order.id}
      if (lastStep == ORDER_STATUS.PAYED_BY_BUYER && isSeller) {
        const img = {...newImage, step: ORDER_STATUS.SENT_FROM_SELLER}
        dispatch(addOrderPhotos(img))
      } else if (lastStep == ORDER_STATUS.SENT_FROM_SELLER && !isSeller) {
        const img = {...newImage, step: ORDER_STATUS.RECEIVED_BY_BUYER}
        dispatch(addOrderPhotos(img))
      } else if (lastStep == ORDER_STATUS.RECEIVED_BY_BUYER && !isSeller) {
        const img = {...newImage, step: ORDER_STATUS.RETURNED_FROM_BUYER}
        dispatch(addOrderPhotos(img))
      } else if (lastStep == ORDER_STATUS.RETURNED_FROM_BUYER && isSeller) {
        const img = {...newImage, step: ORDER_STATUS.RECEIVED_BY_SELLER}
        dispatch(addOrderPhotos(img))
      }
    }
  }, [image])

  useEffect(() => {
    if (ratingSuccess && orderDetail) {
      setTimeout(() => {
        setVisibleRating(true)
      }, (200));
    }
  }, [ratingSuccess])

  const _onAddImageOrder = image => {
    dispatch(addOrderPhotos(image))
  }

  const _onChangeMoreActions = (value) => {
    value ? setCollapse(value) : setCollapse(!isCollapse)
  }

  const _onCancelOrder = (id) => {
    confirmCancel(id)
  }

  const _onPickImage = () => {
    if (Platform.OS == 'android') {
      Alert.alert(
        t('common:text_select_image'),
        '',
        [
          {
            text: t('common:text_cancel'),
            style: 'cancel'
          },
          {
            text: t('common:text_select_from_library'),
            onPress: () => {
              _onPickFromGallery()
            }
          },
          {
            text: t('common:text_select_from_camera'),
            onPress: () => {
              _onPickFromCamera()
            }
          },
        ],
        { cancelable: true }
      );
    } else {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [t('common:text_cancel'), t('common:text_take_photo'), t('common:text_select_from_library')],
          cancelButtonIndex: 0
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            // cancel action
          } else if (buttonIndex === 1) {
            _onPickFromCamera()
          } else if (buttonIndex === 2) {
            _onPickFromGallery()
          }
        }
      );
    }
  }

  const _onPickFromCamera = () => {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
      _onImagePicked(image)
    });
  }

  const _onPickFromGallery = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      compressImageQuality: 0.7
    }).then(image => {
      _onImagePicked(image)
    });
  }

  const _onImagePicked = image => {
    let fileName = image.path;
    if (fileName) {
      const path = fileName.split("/")
      if (path.length > 0) {
        fileName = path[path.length - 1]
      } else {
        fileName = moment().format('YYYY-MM-DD-HH-mm-ss')
      }
    }
    const photo = {
      uri: image.path,
      name: fileName,
      type: image.mime
    }

    setImage(photo);
  }

  const confirmOrder = (data) => {
    Alert.alert(
      t('orders:text_ask_keep_item_in_store'),
      t('orders:text_desc_keep_item_in_store'),
      [
        {
          text: t('actions:text_no'),
          onPress: () => {
            const values = {
              isPublic: false,
              id: orderDetail.product.id
            }
            dispatch(updateProduct(values))
            setTimeout(() => {
              dispatch(updateStatusOrder(data))
            }, 1500);
          }
        },
        {
          text: t('actions:text_yes'),
          onPress: () => {
            dispatch(updateStatusOrder(data))
          }
        }
      ],
      { cancelable: true }
    );
  }

  const confirmCancel = (data) => {
    Alert.alert(
      t('orders:text_ask_cancel_order'),
      '',
      [
        {
          text: t('actions:text_no'),
          style: 'cancel'
        },
        {
          text: t('actions:text_yes'),
          onPress: () => {
            dispatch(cancelOrder(data))
          }
        }
      ],
      { cancelable: true }
    );
  }

  const confirmSentItem = (orderId, statusCode) => {
    const data = {
      orderId,
      status: statusCode
    }
    Alert.alert(
      t('orders:text_upload_photo_delivery_receipt'),
      t('orders:text_desc_upload_photo_delivery_receipt'),
      [
        {
          text: t('orders:text_later'),
          onPress: () => {
            dispatch(updateStatusOrder(data))
          }
        },
        {
          text: t('orders:text_upload_photo_receipt'),
          onPress: () => {
            _onPickImage(data)
          }
        }
      ],
      { cancelable: true }
    );
  }

  const _onGetImagesOrderForSeller = data => {
    if (order && order.transaction) {
      data.transaction = order.transaction
      dispatch(getOrderPhotos(data))
    }
  }

  const _onGetImagesOrderForBuyer = data => {
    dispatch(getOrderPhotos(data))
  }

  const _onUpdateStatusOrder = (statusCode, orderId) => {
    const data = {
      orderId,
      status: statusCode
    }
    if (statusCode == ORDER_STATUS.SELLER_CONFIRMED &&
      order.product.quantity == 'more_than_1') {
      confirmOrder(data)
    } else if (statusCode == ORDER_STATUS.SELLER_CONFIRMED) {
      const values = {
        isPublic: false,
        id: orderDetail.product.id
      }
      dispatch(updateProduct(values))
      setTimeout(() => {
        dispatch(updateStatusOrder(data))
      }, 1500);
    } else {
      dispatch(updateStatusOrder(data))
    }
  }

  const _onUploadImages = (orderId, statusCode) => {
    confirmSentItem(orderId, statusCode)
  }

  const _onDeleteImage = data => {
    deletedImage = data.photos[0]
    dispatch(deleteOrdePhoto(data))
  }

  const _onRating = () => {
    setVisibleRating(!visibleRating)
  }

  const _onSubmitRating = (cmt, rating, recvId) => {
    setVisibleRating(!visibleRating)
    const data = {
      comment: cmt,
      value: rating,
      receiverId: recvId,
      orderId: orderDetail.id
    }
    dispatch(ratingUser(data))
  }

  const _onArchiveOrder = () => {
    dispatch(archiveOrder(orderDetail.id))
  }

  const _onOpenGmail = () => {
    Linking.openURL(`mailto:borw@borw.app?subject=Order ID: ${orderDetail.id} User ID: ${user.id} Request for support from admin&body=Hi \nMy name is ${user.firstName}, and I need your help with the following issue: (please specify the issue below)\n \nI’m looking forward to your reply. Thanks.\n \n${user.firstName} ${user.lastName}`);
    return;
  }

  const _onCompleteOrder = () => {
    const data = {
      orderId: order.id,
    }
    dispatch(completeOrder(data))
  }

  const _onProposeExtraFeeChange = (value) => {
    value ? setPropose(value) : setPropose(!shouldPropose)
  }

  const _onChangeExtraFee = fee => {
    fee != extraFee && setExtraFee(fee)
  }

  const _onChangeDescription = desc => {
    desc != description && setDescription(desc)
  }

  const _onSubmitExtraFee = () => {
    const data = {
      orderId: orderDetail.id,
      status: ORDER_STATUS.REQUEST_EXTRA_FEE,
      extraFees: extraFee,
      extraFeeNotes: description
    }
    dispatch(updateStatusOrder(data))
    setPropose(false)
    setCollapse(false)
  }

  const _onPurchaseExtraFee = () => {
    dispatch(purchaseExtraFee({
      orderId: orderDetail.id
    }))
  }

  const _onShowMoreDesc = () => {
    setShowDesc(!shouldShowDesc)
  }

  const _onNavigatePayment = () => {
    navigation.navigate(mainStack.payment, {
      orderId: orderDetail.id
    })
  }

  const _onNavigateMessage = () => {
    const product = { ...orderDetail.product }
    if (!isSeller) {
      product.owner = {
        firstName: orderDetail.seller.firstName,
        lastName: orderDetail.seller.lastName,
        id: orderDetail.seller.id,
        avatar: orderDetail.seller.avatar,
        firebaseUID: orderDetail.seller.firebaseUID
      }
    } else {
      product.owner = {
        firstName: orderDetail.buyer.firstName,
        lastName: orderDetail.buyer.lastName,
        id: orderDetail.buyer.id,
        avatar: orderDetail.buyer.avatar,
        firebaseUID: orderDetail.buyer.firebaseUID
      }
    }
    navigation.navigate(mainStack.conversation, {
      product: product,
    })
  }

  return {
    isCollapse,
    orderDetail,
    user,
    sellerImages,
    buyerImages,
    shouldLoading,
    loading,
    isSeller,
    visibleRating,
    ratingValue,
    ratingSuccess,
    shouldPropose,
    extraFee,
    description,
    shouldShowDesc,
    _onNavigateMessage,
    _onNavigatePayment,
    _onShowMoreDesc,
    _onSubmitExtraFee,
    _onChangeDescription,
    _onChangeExtraFee,
    _onProposeExtraFeeChange,
    _onOpenGmail,
    _onArchiveOrder,
    _onSubmitRating,
    _onRating,
    _onDeleteImage,
    _onGetImagesOrderForBuyer,
    _onGetImagesOrderForSeller,
    _onAddImageOrder,
    _onUpdateStatusOrder,
    _onCancelOrder,
    _onChangeMoreActions,
    _onUploadImages,
    _onCompleteOrder,
    _onPurchaseExtraFee,
  }
}

export {
  useOrderDetailFacade
}