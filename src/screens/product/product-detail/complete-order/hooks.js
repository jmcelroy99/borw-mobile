import { useState, useEffect } from "react";
import moment from 'moment';
import { addItemToCart, getProductDetail } from '../actions';
import { useDispatch, useSelector } from "react-redux";
import * as calculation from 'src/utils/formulas';
import { mainStack } from 'src/config/navigator';
import { getCurrencyDisplay } from 'src/utils/string';
import { DELIVERY_METHODS } from 'src/modules/common/constants';
import { getDurationPref } from 'src/utils/string';

const useCompleteOrderFacade = (navigation, t) => {
  const dispatch = useDispatch();
  const [deliveryFee, setFee] = useState(0)
  const [distance, setDistance] = useState(0)
  const [price, setPrice] = useState(0)
  const [rentalPrice, setRentalPrice] = useState(0.00)
  const [totalPrice, setTotalPrice] = useState(0.00)
  const [duration, setDuration] = useState(0)
  const [newFee, setNewFee] = useState(0.00)
  const [pref, setPref] = useState()
  const [currency, setCurrency] = useState()
  const [date, setDate] = useState(moment().format('ll'))
  const [id,] = useState(navigation.getParam('id'))
  const [transaction,] = useState(navigation.getParam('type'))
  const [currentDate, setCurrentDate] = useState('')
  const [deliveryMethods, setDeliveryMethods] = useState([])
  const [error, setError] = useState('')
  const [method, setMethod] = useState()
  const [rentPreference, setRentPref] = useState()
  const [buyerLocation, setBuyerLocation] = useState()
  const [showCalendar, setShowCalendar] = useState(false)
  const [address, setAddress] = useState('')
  const [addToCartSuccess,] = useState(false)
  const [pricePerPref, setPricePerPref] = useState(0.0)
  const [item, setItem] = useState()
  const { loading, product } = useSelector(state => state.productDetail)
  let { addSuccess } = useSelector(state => state.productDetail)

  const delivery = [{
    value: DELIVERY_METHODS.BY_HAND,
    label: t('setting:text_by_hand')
  },
  {
    value: DELIVERY_METHODS.BY_COURIER,
    label: t('setting:text_by_courier')
  }]

  useEffect(() => {
    addSuccess = null
    id && dispatch(getProductDetail(id))
  }, [])

  useEffect(() => {
    if (product) {
      setItem(product)
    }
  }, [product])

  useEffect(() => {

    if (item) {
      if (transaction == 'rent') {
        const n = item.rentDuration.lastIndexOf('|');
        const rentPref = item.rentDuration.substring(n + 1);
        setRentPref(rentPref)
        const newRentalPrice = item.isRent ? calculation.getFinalPrice(item.rentalPrice) : 0
        setRentalPrice(newRentalPrice)
        const duration = item.rentDuration.slice(0, item.rentDuration.indexOf('|'));
        setPricePerPref((newRentalPrice / duration).toFixed(2))
        const minimum = parseInt(item.rentDuration.split('|')[0])
        setPref(minimum)
        _onChangeDuration(minimum.toString())
      }

      setCurrency(getCurrencyDisplay(item.currency ? item.currency : ''))

      if (item.deliveryMethod.length == 2) {               // Because we support both 2 delivery methods, so I check if length == 2 then we will enable                                                           //
        setMethod(delivery[0].value)                          // 2 options delivery methods for buyer
        setDeliveryMethods(delivery)
      } else if (item.deliveryMethod[0] == DELIVERY_METHODS.BY_HAND) {
        setMethod(delivery[0].value)                      // 2 options delivery methods for buyer
        setDeliveryMethods([delivery[0]])
      } else if (item.deliveryMethod[0] == DELIVERY_METHODS.BY_COURIER) {
        setMethod(delivery[1].value)                      // 2 options delivery methods for buyer
        setDeliveryMethods([delivery[1]])
      }

      const newFee = item.isDonation ? calculation.getFinalPriceForDeliveryForDonation(deliveryFee) :
        calculation.getFinalPriceForDelivery(deliveryFee)
      setNewFee(newFee)

      if (transaction == 'buy') {
        setPrice(calculation.getFinalPriceForBuyOut(item.price))
      }
    }
  }, [item])

  useEffect(() => {
    if (buyerLocation) {
      if (method == DELIVERY_METHODS.BY_COURIER) {
        const fee = (calculateDistance() * 1.2).toFixed(2)
        setFee(fee)
      } else {
        setDistance(calculateDistance())
      }
    }
  }, [buyerLocation])

  useEffect(() => {
    method == DELIVERY_METHODS.BY_HAND && setTotalPrice(parseFloat(price))
  }, [method])

  useEffect(() => {
    if (deliveryFee && parseFloat(deliveryFee) > 0.5) {
      setError('')
      const newFee = item.isDonation ? calculation.getFinalPriceForDeliveryForDonation(deliveryFee) :
        calculation.getFinalPriceForDelivery(deliveryFee)
      setNewFee(newFee)
      setTotalPrice(parseFloat(price) + parseFloat(newFee))
    }
  }, [deliveryFee])

  useEffect(() => {
    if (addSuccess && item) {
      navigation.navigate(mainStack.product_detail, {
        productId: item.id,
        addedToCart: true
      })
    }
  }, [addSuccess])

  useEffect(() => {
    if (addToCartSuccess) {
      navigation.goBack()
    }
  }, [addToCartSuccess])

  useEffect(() => {
    if (item && item.price) {
      if (method == DELIVERY_METHODS.BY_COURIER) {
        const newFee = item.isDonation ? calculation.getFinalPriceForDeliveryForDonation(deliveryFee) :
          calculation.getFinalPriceForDelivery(deliveryFee)
        setTotalPrice(parseFloat(price) + parseFloat(newFee))
      } else {
        setTotalPrice(parseFloat(price))
      }
    }
  }, [price])

  useEffect(() => {
    if (newFee) {
      if (transaction != 'donation' || method == DELIVERY_METHODS.BY_COURIER) {
        setTotalPrice(parseFloat(price) + parseFloat(newFee))
      }
    }
  }, [newFee])

  useEffect(() => {
    if (duration && item) {
      const rentDuration = item.rentDuration.slice(0, item.rentDuration.indexOf('|'));
      if (transaction == 'rent') {
        if (duration % rentDuration == 0) {
          const temp = duration / rentDuration
          setPrice((rentalPrice * temp).toFixed(2))
        } else {
          const price = duration * pricePerPref
          setPrice(price.toFixed(2))
        }
      }
    }
  }, [duration])

  const _onShowCalendar = () => {
    setShowCalendar(!showCalendar)
  }

  const _onChangeLocation = (location) => {
    const temp = location && location.split(',');
    const editLocation = []
    editLocation.push(parseFloat(temp[0]))
    editLocation.push(parseFloat(temp[1]))
    setBuyerLocation(editLocation)
  }

  const _onDateChange = date => {
    setDate(date.timestamp)
    setCurrentDate(date.dateString)
  }

  const calculateDistance = () => {
    if (item && item.location) {
      const temp = item.location && item.location.split(',');
      const distance = calculation.calculateDeliverCostCourier(parseFloat(temp[0]), buyerLocation[0], parseFloat(temp[1]), buyerLocation[1])
      return distance;
    } else return 0
  }

  const _onChangeMethod = value => {    
    if (value == DELIVERY_METHODS.BY_HAND) {
      setFee(0)
      setMethod(delivery[0].value)
    } else {
      setMethod(delivery[1].value)
    }
  }

  const _onHandleCancel = () => {
    navigation.navigate(mainStack.product_detail, {
      productId: item.id
    })
  }

  const _onHandleSubmit = () => {
    if (parseFloat(deliveryFee) + parseFloat(price) < 0.5 && transaction != 'donation') {
      setError(t('validators:text_amount_too_small', { currency: currency }))
      return
    }
    if (error != '' && transaction == 'rent') {
      return
    }
    if ((duration == 0 || !duration) && transaction == 'rent') {
      setError(t('validators:text_duration'))
      return
    }
    if ((duration != 0 && duration != '' && transaction == 'rent') || transaction == 'donation' || transaction == 'buy') {
      const newItem = { ...item }
      newItem.deliveryMethod = method
      newItem.buyerAddress = address
      newItem.buyerLocation = buyerLocation
      newItem.pickUpDate = date
      newItem.durationTime = duration
      newItem.transaction = transaction
      newItem.image = item.photos[0]
      newItem.deliveryFee = method == DELIVERY_METHODS.BY_COURIER && deliveryFee ? deliveryFee : 0
      newItem.distance = method == DELIVERY_METHODS.BY_COURIER && buyerLocation ? calculateDistance() : null
      newItem.totalPrice = totalPrice
      newItem.ownerAvatar = item.owner.avatar
      dispatch(addItemToCart(newItem))
    } else {
      setError(t('validators:text_duration'))
    }
  }

  const _onUpdateAddress = address => {
    setAddress(address)
  }

  const _onChangeDuration = value => {
    if (value.includes('.')) {
      return
    }
    setDuration(value)
    if (value < pref) {
      setError(t('error:text_minimum_rent_duration', { minimum: pref, pref: getDurationPref(rentPreference, t) }))
    } else
      setError('')
  }

  return {
    date,
    currentDate,
    showCalendar,
    deliveryMethods,
    method,
    newFee,
    deliveryFee,
    distance,
    price,
    item,
    loading,
    duration,
    rentPreference,
    error,
    rentalPrice,
    pref,
    transaction,
    currency,
    totalPrice,
    _onChangeDuration,
    _onUpdateAddress,
    _onChangeLocation,
    _onHandleSubmit,
    _onHandleCancel,
    _onShowCalendar,
    _onDateChange,
    _onChangeMethod,
  }
}

export {
  useCompleteOrderFacade,
}