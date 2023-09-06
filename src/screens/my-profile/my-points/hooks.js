import { useState, useEffect } from 'react';
import { mainStack } from 'src/config/navigator';
import { useDispatch, useSelector } from 'react-redux';
import { getListPoints, redeemCode, getUserInfo } from './actions';
import { Alert } from 'react-native';
import { MAXIMUM_REDEEM_CODE } from 'src/modules/common/constants';

const useMyPointsFacade = (navigation, t) => {
  const dispatch = useDispatch()
  const [isVisible, setVisible] = useState()
  const [code, setCode] = useState()
  const [error, setError] = useState('')
  let { redeemSuccess } = useSelector(state => state.myPoints)
  const { listPoints, loading, userInfo } = useSelector(state => state.myPoints)

  useEffect(() => {
    redeemSuccess = null
    const data = {
      limit: 30,
      page: 0
    }
    dispatch(getListPoints(data))
    dispatch(getUserInfo())
  }, [])

  useEffect(() => {
    if (redeemSuccess) {
      setTimeout(() => {
        _onShowPopup()
      }, 200);
      dispatch(getUserInfo())
    }
  }, [redeemSuccess])

  const _onChangeCode = value => {
    if ((value && value.length <= MAXIMUM_REDEEM_CODE) || value == '') {         // Check if input is valid and less than MAXIMUM REDEEM CODE length 
      setCode(value)
    }
  }

  const _onChangeVisible = () => {
    setVisible(!isVisible)
  }

  const _onNavigateInvite = () => {
    navigation.navigate(mainStack.invite_friend)
  }

  const _onSubmitCode = () => {
    if (code && code != '') {
      if (code == userInfo.invitationCode) {
        setError(t('error:text_warning_redeem_your_own_code'))
      } else {
        setError(null)
        _onChangeVisible()
        const data = {
          code: code
        }
        dispatch(redeemCode(data))
      }
    } else {
      setError(t('error:text_require_field'))
    }
  }

  const _onShowPopup = () => {
    Alert.alert(
      t('invites:text_redeem_success_title'),
      t('invites:text_redeem_successful', { points: 300 }),
      [
        {
          text: t('common:text_ok'),
          style: 'cancel'
        },
      ],
      { cancelable: true }
    );
  }

  const _onGetActivityName = item => {
    switch (item.activity) {
      case 'linked':
        const name = item.linkedUser ? (item.linkedUser.firstName + ' ' + item.linkedUser.lastName) : '';
        return t('invites:text_linked_user', { name })
      case 'sign_up':
        return t('auth:text_sign_up')
      case 'invited_by':
        return t('invites:text_invited_by')
      case 'donation':
        const productName = item.order && item.order.product.name
        return t('invites:text_pay_for_transaction', { product: productName, transaction: t('shop:text_donation') })
      case 'rent':
        const productName2 = item.order && item.order.product.name
        return t('invites:text_pay_for_transaction', { product: productName2, transaction: t('shop:text_rent') })
      case 'buy':
        const productName3 = item.order && item.order.product.name
        return t('invites:text_pay_for_transaction', { product: productName3, transaction: t('shop:text_buy_out')})
      default:
        return ''
    }
  }

  const _onRefreshError = value => {
    setError(value)
  }

  return {
    isVisible,
    code,
    listPoints,
    loading,
    userInfo,
    error,
    _onShowPopup,
    _onRefreshError,
    _onGetActivityName,
    _onNavigateInvite,
    _onChangeVisible,
    _onSubmitCode,
    _onChangeCode
  }
}

export {
  useMyPointsFacade
}