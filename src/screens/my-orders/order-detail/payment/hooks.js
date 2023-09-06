import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react";
import { getOrderDetail } from '../../actions';
import { purchaseOrder } from './actions';
import stripe from 'tipsi-stripe';
import { PUBLISHABLE_KEY } from 'src/config/api';
import { getUserInfo } from 'src/screens/my-profile/my-points/actions';
import { getCurrencyDisplay } from 'src/utils/string';

const usePaymentFacade = (navigation, t) => {
  const dispatch = useDispatch();
  const orderId = navigation.getParam('orderId');
  const [isShowDetail, setShowDetail] = useState(false);
  const [shouldLoading, setLoading] = useState(false);
  const [pointsDiscount, setDiscount] = useState(0.00);
  const [currency, setCurrency] = useState()
  const [error, setError] = useState('');
  const [points, setPoints] = useState();
  const [ownerPoints, setOwnerPoints] = useState(0);
  const { order, isLoading } = useSelector(state => state.orders);
  let { purchaseSuccess, loading } = useSelector(state => state.payment)
  const { userInfo } = useSelector(state => state.myPoints)

  useEffect(() => {
    purchaseSuccess = null
    stripe.setOptions({
      publishableKey: PUBLISHABLE_KEY,
    })
    orderId && dispatch(getOrderDetail(orderId))
    dispatch(getUserInfo())
  }, [])

  useEffect(() => {
    setLoading(isLoading || loading)
  }, [isLoading, loading])

  useEffect(() => {
    if (userInfo) {
      setOwnerPoints(parseInt(userInfo.points))
    }
  }, [userInfo])

  const _onShowDetail = () => {
    setShowDetail(!isShowDetail)
  }

  const _onChangePoints = value => {
    setPoints(value)
    if (value <= ownerPoints) {
      setDiscount(value / 100)
      setError(null)
    } else if (value > ownerPoints) {
      setDiscount(0)
      setError(t('error:text_points_over_maximum'))
    }
  }

  const _onProceedPayment = (token, provider) => {
    const data = {
      paymentToken: token.tokenId,
      provider: provider,
      last4: token.card.last4,
      expYear: token.card.expYear,
      expMonth: token.card.expMonth,
      orderId: order ? order.id : orderId,
      points: points
    }
    dispatch(purchaseOrder(data))
  }

  const _onShowErrorMinimum = (value) => {
    if (value) {
      setError(t('error:text_minimum_total', {currency: currency}))
    } else if (points && points > ownerPoints) {
      setError(t('error:text_points_over_maximum'))
    }
  }

  const _onShowPayment = async () => {
    if (!error) {
      const token = await stripe.paymentRequestWithCardForm({
        // Only iOS support this options
        smsAutofillDisabled: true,
      })
      if (token) {
        _onProceedPayment(token, 'stripe')
      }
    }
  }

  useEffect(() => {
    if (purchaseSuccess) {
      navigation.goBack()
      dispatch(getOrderDetail(orderId))
    }
  }, [purchaseSuccess])

  useEffect(() => {
    if (order) {
      order.currency ? setCurrency(getCurrencyDisplay(order.currency)) : setCurrency(getCurrencyDisplay(''))
    }
  }, [order])

  return {
    order,
    isLoading,
    loading,
    isShowDetail,
    points,
    error,
    currency,
    ownerPoints,
    pointsDiscount,
    shouldLoading,
    _onShowErrorMinimum,
    _onShowPayment,
    _onChangePoints,
    _onShowDetail,
    _onProceedPayment
  }
}

export {
  usePaymentFacade
}