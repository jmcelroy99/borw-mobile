import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewProduct, updateProduct } from '../actions';
import { Alert } from "react-native";
import { getFinalPrice, getActualReceived, getFinalPriceForBuyOut } from 'src/utils/formulas';
import { getCurrencyDisplay, getParent, getTitle } from 'src/utils/string';

const useCreateProductFacade = (navigation, t, isEdit) => {
  const [images, setImages] = useState([])
  const [newImages,] = useState([])
  const [errors, setErrors] = useState({})
  const [isSubmit, setSubmit] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [currency, setCurrency] = useState(getCurrencyDisplay('eur'))
  const [finalRentPrice, setFinalRentPrice] = useState(0.00)
  const [finalBuyOutPrice, setFinalBuyOutPrice] = useState(0.00)
  const [actualRentReceived, setActualRentReceived] = useState(0.00)
  const [actualBuyOutReceived, setActualBuyOutReceived] = useState(0.00)
  const [editLocation, setEditLocation] = useState('51.517381, -0.127758')
  const state = useSelector(state => state.auth)
  const [user,] = useState(state.toJS().user)
  let { success, loading, updateSuccess } = useSelector(state => state.addProduct)
  const { appSetting } = useSelector(state => state.setting);
  const { data } = useSelector(state => state.category)
  const dispatch = useDispatch()

  const sizeList = [{
    value: '1',
    name: '1'
  },
  {
    label: t('shop:text_more_than_1'),
    value: 'more_than_1'
  }];

  const seasonList = [{
    label: t('shop:text_all_year'),
    value: 'all_year',
  },
  {
    label: t('shop:text_spring_summer'),
    value: 'spring_summer',
  },
  {
    label: t('shop:text_autumn_winter'),
    value: 'autumn_winter',
  }];

  const durationList = [{
    label: t('shop:text_day_s'),
    value: 'day(s)'
  },
  {
    label: t('shop:text_week_s'),
    value: 'week(s)'
  },
  {
    label: t('shop:text_month_s'),
    value: 'month(s)'
  }];

  const sizePrefList = [{
    value: 'EU',
  },
  {
    value: 'UK',
  },
  {
    value: 'US',
  },
  {
    value: 'AU',
  }];

  const getQuantity = string => {
    for (let index = 0; index < sizeList.length; index++) {
      if (string === sizeList[index].value) {
        return sizeList[index].value
      }
    }
  }

  const createProductValidateSchema = Yup.object().shape({
    isRent: Boolean(),
    isBuyOut: Boolean(),
    isDonation: Boolean(),
    name: Yup.string().trim()
      .required(t('error:text_require_field')),
    description: Yup.string().trim()
      .required(t('error:text_require_field')),
    size: Yup.string().trim()
      .required(t('error:text_require_field')),
    price: Yup.string()
      .when('isDonation', {
        is: false,
        then: Yup.string().required(t('error:text_require_field')),
        otherwise: Yup.string().notRequired()
      }),
    categoryId: Yup.string()
      .required(t('error:text_require_field')),
    rentalPrice: Yup.string().when('isRent', {
      is: true,
      then: Yup.string().required(t('error:text_require_field')),
      otherwise: Yup.string().notRequired()
    }),
    hasImage: Yup.bool()
      .oneOf([true], t('error:text_require_field'))
  })

  useEffect(() => {
    success = false;
    loading = false;
    updateSuccess = false;
  }, [])

  useEffect(() => {
    setLoading(loading)
  }, [loading])

  useEffect(() => {
    if (appSetting) {
      switch (appSetting.size) {
        case sizePrefList[1].value:
          formik.setFieldValue('sizePref', sizePrefList[1].value)
          break;
        case sizePrefList[2].value:
          formik.setFieldValue('sizePref', sizePrefList[2].value)
          break;
        case sizePrefList[0].value:
          formik.setFieldValue('sizePref', sizePrefList[0].value)
          break;
        case sizePrefList[3].value:
          formik.setFieldValue('sizePref', sizePrefList[3].value)
          break;
      }
      setCurrency(getCurrencyDisplay(appSetting.currency))
      if (appSetting.deliveryMethod.length == 1 && appSetting.deliveryMethod[0] == 'hand') {
        formik.setFieldValue('byHand', true)
        formik.setFieldValue('byCourier', false)
      } else if (appSetting.deliveryMethod.length == 1 && appSetting.deliveryMethod[0] == 'courier') {
        formik.setFieldValue('byCourier', true)
        formik.setFieldValue('byHand', false)
      } else if (appSetting.deliveryMethod.length == 2) {
        formik.setFieldValue('byCourier', true)
        formik.setFieldValue('byHand', true)
      }
    }
  }, [appSetting])

  useEffect(() => {
    if (navigation.getParam('category')) {
      const cate = navigation.getParam('category')
      const cateLocale = getParent(cate.parent, t)
      const titleLocale = getTitle(cate.title, t)
      formik.setFieldValue('category', cateLocale + ' -> ' + titleLocale)
      formik.setFieldValue('categoryId', cate.id)
      if (errors.categoryId) {
        const newErrors = { ...errors }
        delete newErrors.categoryId
        setErrors(newErrors)
      }
    }
  }, [navigation.getParam('category')])

  useEffect(() => {
    if (isEdit) {
      setLoading(true)
      const itemEditable = navigation.getParam('edit');
      let values = { ...itemEditable }
      const category = data && data.findIndex(i => i.id == values.categoryId)
      if (category !== -1) {
        values.category = getParent(data[category].parent, t) + ' -> ' + getTitle(itemEditable.categoryName, t)
      } else {
        values.category = getTitle(itemEditable.categoryName, t)
      }

      const quantity = sizeList.find(item => item.value == itemEditable.quantity)
      values.quantity = quantity ? quantity.value : itemEditable.quantity.replaceAll('_', ' ')
      values.durationPref = durationList[0].value
      values.durationRent = "1"
      if (itemEditable.rentDuration) {
        const [durationRent, durationPref] = itemEditable.rentDuration.split('|')
        const duration = durationList.find(item => item.value == durationPref)
        values.durationPref = duration ? duration.value : durationList[0].value
        values.durationRent = durationRent
      }

      const season = seasonList.find(item => item.value == itemEditable.season)
      values.season = season ? season.value : itemEditable.season.replace('_', ' ')

      values.payWithPoint = itemEditable.payWithPoint
      values.currency = itemEditable.currency
      values.sizePref = itemEditable.size.split('|')[1]
      values.size = itemEditable.size.substring(0, itemEditable.size.indexOf('|'));
      values.hasImage = itemEditable.photos ? true : false
      if (itemEditable.deliveryMethod) {
        if (itemEditable.deliveryMethod.length == 1 && itemEditable.deliveryMethod[0] == 'hand') {
          values.byHand = true
          values.byCourier = false
        } else if (itemEditable.deliveryMethod.length == 1 && itemEditable.deliveryMethod[0] == 'courier') {
          values.byCourier = true
          values.byHand = false
        } else if (itemEditable.deliveryMethod.length == 2) {
          values.byHand = true
          values.byCourier = true
        }
      }
      values.id = itemEditable.id

      delete values.updatedAt
      delete values.createdAt
      delete values.deleted
      delete values.ownerId
      delete values.deliveryMethod

      setCurrency(getCurrencyDisplay(itemEditable.currency))
      formik.setValues(values)
      const images = []
      for (let index = 0; index < values.photos.length; index++) {
        images.push({ uri: values.photos[index] })
      }
      setImages(images)
      setTimeout(() => {
        setLoading(false)
        setEditLocation(values.location)
      }, 150);
    }
  }, [isEdit])

  useEffect(() => {
    if (success || updateSuccess) {
      navigation.goBack();
    }
  }, [success, updateSuccess])

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      size: '',
      sizePref: sizePrefList[0].value,
      quantity: sizeList[0].value,
      season: seasonList[0].value,
      price: '0',
      rentalPrice: '0',
      location: '',
      durationPref: durationList[0].value,
      durationRent: '1',
      category: '',
      categoryId: '',
      address: '',
      hasImage: false,
      isBuyOut: false,
      isRent: true,
      isDonation: false,
      payWithPoint: false,
      byHand: true,
      byCourier: false,
      isDesigner: false,
      isPublic: false,
      currency: ''
    },
    validationSchema: createProductValidateSchema,
    validateOnMount: true,
    onSubmit: values => {
      console.log('error: ', errors)
      if (errors.rentalPrice || errors.price)  {
        return
      }
      let value = { ...values }
      const size = value.size + '|' + value.sizePref
      const duration = durationList.find(item => item.value == value.durationPref)

      const durationRent = value.durationRent + '|' + (duration ? duration.value : durationList[0].value)
      delete value.sizePref
      delete value.durationPref
      delete value.category
      delete value.hasImage
      value.size = size
      value.rentDuration = durationRent
      value.images = images
      value.quantity = getQuantity(value.quantity)
      if (value.isBuyOut && !value.isRent) {
        value.rentalPrice = '0'
        value.durationRent = '0'
        value.durationPref = durationList[0].value
      }
      const index = seasonList.findIndex(item => item.value == value.season)
      value.season = seasonList[index].value
      if (!isEdit) {
        delete value.id
        value.currency = appSetting && appSetting.currency ? appSetting.currency : 'eur'
        dispatch(addNewProduct(value))
      } else {
        value.images = value.images.filter(i => i.isNew)
        delete value.likes
        delete value.comments
        dispatch(updateProduct(value))
      }
    },
  })

  useEffect(() => {
    if (formik.values['isBuyOut'] && formik.values['price']) {
      const price = parseFloat(formik.values['price']);

      if (price < 0.5) {
        return
      } else if (price >= 0.5) {
        const error = {
          ...formik.errors,
          price: null
        }
        setErrors(error)
        setFinalBuyOutPrice(getFinalPriceForBuyOut(price))
        setActualBuyOutReceived(getActualReceived(price))
      }
    }
  }, [formik.values['isBuyOut']])

  const _onHandleSubmit = () => {
    if (formik.values['isRent'] && formik.values['rentalPrice'] != 0 && formik.values['price'] != 0) {
      !isSubmit && setSubmit(true)

      if (!formik.isValid && formik.errors) {
        const error = {
          ...formik.errors
        }
        setErrors(error)
        return alert(t('common:text_complete_all_required_fields'))
      } else {
        formik.handleSubmit();
      }
    } else if (formik.values['isBuyOut']) {
      if (parseFloat(formik.values['price']) >= 0.5) {
        !isSubmit && setSubmit(true)

        if (!formik.values['isRent'] && formik.errors.rentalPrice) {
          delete formik.errors.rentalPrice
        }
        if (!formik.isValid && formik.errors) {
          const error = {
            ...formik.errors
          }
          setErrors(error)
          return alert(t('common:text_complete_all_required_fields'))
        } else {
          formik.handleSubmit();
        }
      } else return
    } else if (formik.values['isDonation']) {
      !isSubmit && setSubmit(true)

      if (!formik.values['isRent'] && formik.errors.rentalPrice) {
        delete formik.errors.rentalPrice
      }
      if (!formik.isValid && formik.errors) {
        if (!formik.errors.price) {
          formik.handleSubmit();
        } else {
          const error = {
            ...formik.errors
          }
          setErrors(error)
          return alert(t('common:text_complete_all_required_fields'))
        }
      } else {
        formik.handleSubmit();
      }
    } else {
      !isSubmit && setSubmit(true)
      if (formik.values['isRent']) {
        if (formik.values['price'] == '0') {
          const error = {
            ...formik.errors,
            price: t('shop:text_price_must_greater_than_0')
          }
          setErrors(error)
          return
        } else if (formik.values['rentalPrice'] == '0') {
          const error = {
            ...formik.errors,
            rentalPrice: t('shop:text_price_must_greater_than_0')
          }
          setErrors(error)
          return
        }
      }
      if (!formik.values['isRent'] && formik.errors.rentalPrice) {
        delete formik.errors.rentalPrice
      }
      if (!formik.isValid && formik.errors) {
        const error = {
          ...formik.errors
        }
        setErrors(error)
        return alert(t('common:text_complete_all_required_fields'))
      } else {
        formik.handleSubmit();
      }
    }
  }

  const _onConfirmDonation = () => {
    if (!formik.values['isDonation']) {
      Alert.alert(
        t('product:text_ask_donate_product'),
        t('product:text_desc_donate_product'),
        [
          {
            text: "No",
            style: "cancel"
          },
          {
            text: "Yes",
            onPress: () => {
              formik.setFieldValue('isDonation', true)
              formik.setFieldValue('isRent', false)
              formik.setFieldValue('isBuyOut', false)
              if (formik.errors.price) {
                delete formik.errors.price
              }
            }
          }
        ],
        { cancelable: true }
      );
    } else {
      formik.setFieldValue('isDonation', false)
    }
  }

  const _onChangePaymentWithPoint = (value) =>
    Alert.alert(
      value ? t('product:text_ask_payment_with_point') : t('product:text_desc_payment_with_point'),
      value ? t('product:text_desc_payment_commission', { curr: currency }) : t('product:text_desc_only_accept_card'),
      value ?
        [
          {
            text: t('actions:text_no'),
            style: "cancel"
          },
          {
            text: t('actions:text_yes'),
            onPress: () => {
              formik.setFieldValue('payWithPoint', value)
            }
          }
        ] : [
          {
            text: t('actions:text_no'),
            style: "cancel"
          },
          {
            text: t('actions:text_yes'),
            onPress: () => {
              formik.setFieldValue('payWithPoint', value)
            }
          }
        ],
      { cancelable: true }
    );

  const _onPaymentChange = value => {
    _onChangePaymentWithPoint(value)
  }

  const _onWarningMethod = () => {
    Alert.alert(
      t('product:text_cannot_disable_method'),
      t('product:text_select_at_least_method'),
      [
        {
          text: "OK",
          style: "cancel"
        },
      ],
      { cancelable: true }
    );
  }

  const _onCheckValidType = type => {
    switch (type) {
      case 'isBuyOut': {
        if (formik.values['isBuyOut'] && !formik.values['isRent'] && !formik.values['isDonation']) {
          _onWarningMethod()
          return false;
        } else {
          return true;
        }
      }
      case 'isRent': {
        if (!formik.values['isBuyOut'] && formik.values['isRent'] && !formik.values['isDonation']) {
          _onWarningMethod()
          return false;
        } else {
          return true;
        }
      }
      case 'isDonation': {
        if (!formik.values['isBuyOut'] && !formik.values['isRent'] && formik.values['isDonation']) {
          _onWarningMethod()
          return false
        } else {
          return true;
        }
      }
    }
  }

  const _onChangeSubmit = () => {
    setSubmit(!isSubmit)
  }

  const _onImagePicked = image => {
    if (!isEdit) {
      const imageTemp = [...images, image]
      setImages(imageTemp)
      imageTemp.length > 0 && formik.setFieldValue('hasImage', true)
    } else {
      image.isNew = true
      const imageTemp = [...images, image]
      setImages(imageTemp)
      imageTemp.length > 0 && formik.setFieldValue('hasImage', true)
    }
  }

  const _onDeleteImage = image => {
    if (isEdit) {
      const index = images.findIndex(i => i.uri == image.uri)
      if (index !== -1) {
        const newList = [...images]
        newList.splice(index, 1)
        setImages(newList)

        const i = formik.values['photos'].findIndex(i => i == image.uri)
        if (i !== -1) {
          const temp = [...formik.values['photos']]
          temp.splice(i, 1);
          formik.setFieldValue('photos', temp)
        }
      }
    } else {
      const index = images.findIndex(i => i.uri == image.uri)
      if (index !== -1) {
        const newList = [...images]
        newList.splice(index, 1)
        setImages(newList)
      }
    }
  }

  const _onChangePrice = value => {
    formik.setFieldValue('price', value)
    if (parseFloat(value) < 0.5) {
      const error = {
        ...errors,
        price: t('shop:text_price_is_too_small', { currency: currency })
      }
      setErrors(error)
      return
    } else {
      const error = {
        ...errors,
        price: null
      }
      setErrors(error)
    }
  }

  const _onChangeRentalPrice = value => {
    formik.setFieldValue('rentalPrice', value)
    if (parseFloat(value) < 0.5) {
      const error = {
        ...errors,
        rentalPrice: t('shop:text_price_is_too_small', { currency: currency })
      }
      setErrors(error)
      return
    } else {
      const error = {
        ...errors,
        rentalPrice: null
      }
      setErrors(error)
    }
  }

  useEffect(() => {
    if (images && images.length > 0) {
      formik.setFieldValue('hasImage', true)
    } else {
      formik.setFieldValue('hasImage', false)
    }
  }, [images])

  useEffect(() => {
    if (parseFloat(formik.values['price']) != 0 || parseFloat(formik.values['rentalPrice']) != 0) {
      const price = parseFloat(formik.values['price']);
      const rentalPrice = parseFloat(formik.values['rentalPrice']);
      if (formik.values['isRent'] && !formik.values['isBuyOut']) {
        setFinalRentPrice(getFinalPrice(rentalPrice))
        setActualRentReceived(getActualReceived(rentalPrice))
      } else if (formik.values['isBuyOut'] && !formik.values['isRent']) {
        setFinalBuyOutPrice(getFinalPriceForBuyOut(price))
        setActualBuyOutReceived(getActualReceived(price))
      } else if (formik.values['isBuyOut'] && formik.values['isRent']) {
        setFinalRentPrice(getFinalPrice(rentalPrice))
        setActualRentReceived(getActualReceived(rentalPrice))
        setFinalBuyOutPrice(getFinalPriceForBuyOut(price))
        setActualBuyOutReceived(getActualReceived(price))
      }
    }
  }, [formik.values['price'], formik.values['rentalPrice']])

  return {
    editLocation,
    sizeList,
    seasonList,
    durationList,
    sizePrefList,
    formik,
    images,
    newImages,
    errors,
    isSubmit,
    isLoading,
    finalRentPrice,
    finalBuyOutPrice,
    actualRentReceived,
    actualBuyOutReceived,
    user,
    currency,
    appSetting,
    _onWarningMethod,
    _onChangeSubmit,
    _onImagePicked,
    _onDeleteImage,
    _onHandleSubmit,
    _onCheckValidType,
    _onPaymentChange,
    _onConfirmDonation,
    _onChangePrice,
    _onChangeRentalPrice
  }
}

export {
  useCreateProductFacade,
}