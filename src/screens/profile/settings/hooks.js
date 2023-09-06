import globalConfig from 'src/utils/global';
import { useState, useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import { STRIPE, linkSocialNetwork, legalLink } from 'src/config/api';
import { verifyTokenStripe, updateSetting, deleteAccount } from './actions';
import { useSelector } from 'react-redux';
import { mainStack } from 'src/config/navigator';
import { URL } from 'react-native-url-polyfill';
import { signOut } from 'src/modules/auth/actions';
import { changeLanguage } from 'src/modules/common/actions';

const useSettingsFacade = (navigation, t, dispatch) => {
  const currencyList = [{
    label: 'Euro (€)',
    value: 'eur'
  },
  {
    label: 'British Pound (£)',
    value: 'gbp'
  },
  {
    label: 'US Dollar ($)',
    value: 'usd'
  }];

  const methodsInitial = [
    {
      name: 'by hand',
      value: true
    },
    {
      name: 'by courier',
      value: true
    }
  ]

  const sizeList = [
    {
      value: 'UK',
      name: 'uk'
    },
    {
      value: 'EU',
      name: 'eu'
    },
    {
      value: 'US',
      name: 'us'
    },
    {
      value: 'AU',
      name: 'au'
    },
  ]

  const languages = [
    {
      label: t('setting:text_english'),
      value: 'en'
    },
    {
      label: t('setting:text_greek'),
      value: 'el'
    },
    {
      label: t('setting:text_italian'),
      value: 'it'
    },
  ]

  const [isLoading, setLoading] = useState(false)
  const [stripe, setStripe] = useState()
  const [currency, setCurrency] = useState(currencyList[0].value)
  const [isVisible, setVisible] = useState(false)
  const [methods, setMethods] = useState(methodsInitial)
  const [lang, setLang] = useState(languages[0].value)
  const [size, setSize] = useState(sizeList[0].value)
  const [loadingStripe, setLoadingStripe] = useState(false)
  const state = useSelector(state => state.common)
  const language = state.toJS().language
  const { loading, connectStripeSuccess, appSetting } = useSelector(state => state.setting);

  useEffect(() => {
    if (globalConfig.getUser()) {
      setStripe(STRIPE(globalConfig.getUser()))
    }
  }, [])

  useEffect(() => {
    if (language) {
      switch (language) {
        case 'en':
          setLang(languages[0].value)
          break;
        case 'el':
          setLang(languages[1].value)
          break;
        case 'it':
          setLang(languages[2].value)
          break;
        default:
          break;
      }
    }
  }, [language])

  useEffect(() => {
    if (appSetting) {
      switch (appSetting) {
        case 'en':
          setLang(languages[0].value)
          break;
        default:
          break;
      }

      if (appSetting.deliveryMethod.length == 2) {
        setMethods(methodsInitial)
      } else if (appSetting.deliveryMethod.length == 1 && appSetting.deliveryMethod[0] == 'hand') {
        const tempMethods = [...methodsInitial]
        tempMethods[1].value = false
        setMethods(tempMethods)
      } else {
        const tempMethods = [...methodsInitial]
        tempMethods[0].value = false
        setMethods(tempMethods)
      }

      switch (appSetting.currency) {
        case 'gbp':
          setCurrency(currencyList[1].value)
          break;
        case 'usd':
          setCurrency(currencyList[2].value)
          break
        case 'eur':
          setCurrency(currencyList[0].value)
          break
        default:
          break;
      }

      switch (appSetting.size) {
        case 'EU':
          setSize(sizeList[1].value)
          break;
        case 'UK':
          setSize(sizeList[0].value)
          break;
        case 'US':
          setSize(sizeList[2].value)
          break;
        case 'AU':
          setSize(sizeList[3].value)
          break;
        default:
          break;
      }
    }
  }, [appSetting])

  useEffect(() => {
    if (connectStripeSuccess) {
      Alert.alert(
        t('setting:text_connected_with_stripe_success'),
        '',
        [
          {
            text: t('common:text_ok'),
            style: 'cancel'
          },
        ],
        { cancelable: true }
      );
    }
  }, [connectStripeSuccess])

  useEffect(() => {
    setLoading(loading)
  }, [loading])

  const _onLogOutConfirmation = () => {
    Alert.alert(
      t('auth:text_log_out_confirmation'),
      '',
      [
        {
          text: t('actions:text_no'),
          style: 'cancel'
        },
        {
          text: t('actions:text_yes'),
          onPress: () => {
            _onLogOut()
          }
        }
      ],
      { cancelable: true }
    );
  }

  const _onAddPaymentMethods = () => {
    setVisible(!isVisible)
  }

  const _onLogOut = () => {
    setLoading(true)
    dispatch(signOut())
  }

  const _onChangeVisible = () => {
    setVisible(!isVisible)
  }

  const _onWebViewStateChange = (value) => {
    const url = new URL(value);
    const code = url.searchParams.get("code");
    if (code) {
      _onChangeVisible();
      const data = {
        token: code
      }
      dispatch(verifyTokenStripe(data))
    }
  }

  const getLang = () => {
    switch (lang) {
      case languages[0].value:
        return 'en'
      default:
        break;
    }
  }

  const _onChangeCurrency = value => {
    value != currency && setCurrency(value)
    const currency = currencyList.find(item => item.value == value)
    const delivery = []
    methods.forEach(element => {
      if (element.name == 'by hand' && element.value) {
        delivery.push('hand')
      } else if (element.name == 'by courier' && element.value) {
        delivery.push('courier')
      }
    });
    const data = {
      currency: currency.value,
      deliveryMethod: delivery,
      size: size,
      language: getLang()
    }
    dispatch(updateSetting(data))
  }

  const _onNavigateMyRatings = () => {
    navigation.navigate(mainStack.my_ratings)
  }

  const _onNavigateMyPoints = () => {
    navigation.navigate(mainStack.my_points)
  }

  const _onNavigateEditProfile = () => {
    navigation.navigate(mainStack.edit_profile)
  }

  const _onNavigateOrder = () => {
    navigation.navigate(mainStack.my_orders)
  }

  const _onNavigateBookmark = () => {
    navigation.navigate(mainStack.my_bookmark)
  }

  const _onChangeLoadingIndicator = (value) => {
    setLoadingStripe(value)
  }

  const _onContactUs = () => {
    navigation.navigate(mainStack.contact_us)
  }

  const _onDeleteConfirm = () => {
    Alert.alert(
      t('auth:text_delete_account_confirmation'),
      '',
      [
        {
          text: t('actions:text_no'),
          style: 'cancel'
        },
        {
          text: t('actions:text_yes'),
          onPress: () => {
            dispatch(deleteAccount())
          }
        }
      ],
      { cancelable: true }
    );
  }

  const _onOpenUrlFailed = () => {
    Alert.alert(
      t('setting:text_open_url_failed_title'),
      t('setting:text_open_url_failed_desc'),
      [
        {
          text: t('common:text_ok'),
          style: 'cancel'
        },
      ],
      { cancelable: true }
    );
  }

  const _onWarningMethods = () => {
    Alert.alert(
      t('product:text_cannot_disable_method'),
      t('product:text_select_at_least_method'),
      [
        {
          text: t('common:text_ok'),
          style: 'cancel'
        },
      ],
      { cancelable: true }
    );
  }

  const _onPrepareDataForUpdateSetting = (temp) => {
    const curr = currencyList.find(item => item.value == currency)
    const delivery = []
    temp.forEach(element => {
      if (element.name == 'by hand' && element.value) {
        delivery.push('hand')
      } else if (element.name == 'by courier' && element.value) {
        delivery.push('courier')
      }
    });
    const data = {
      currency: curr.value,
      deliveryMethod: delivery,
      size: size,
      language: getLang()
    }
    dispatch(updateSetting(data))
  }

  const _onPrepareDataForUpdateSettingLang = (value) => {
    const delivery = []
    methods.forEach(element => {
      if (element.name == 'by hand' && element.value) {
        delivery.push('hand')
      } else if (element.name == 'by courier' && element.value) {
        delivery.push('courier')
      }
    });
    const curr = currencyList.find(item => item.value == currency)
    const data = {
      currency: curr.value,
      deliveryMethod: delivery,
      size: size,
      language: value
    }
    dispatch(updateSetting(data))
  }

  const _onChangeByCourier = value => {
    if (!value && !methods[0].value) {
      _onWarningMethods()
      return
    }
    const temp = [...methods]
    temp[1].value = value
    setMethods(temp)
    _onPrepareDataForUpdateSetting(temp)
  }

  const _onChangeByHand = value => {
    if (!value && !methods[1].value) {
      _onWarningMethods()
      return
    }
    const temp = [...methods]
    temp[0].value = value
    setMethods(temp)
    _onPrepareDataForUpdateSetting(temp)
  }

  const _onChangeSize = value => {
    value != size && setSize(value)

    const curr = currencyList.find(item => item.value == currency)
    const delivery = []
    methods.forEach(element => {
      if (element.name == 'by hand' && element.value) {
        delivery.push('hand')
      } else if (element.name == 'by courier' && element.value) {
        delivery.push('courier')
      }
    });
    const data = {
      currency: curr.value,
      deliveryMethod: delivery,
      size: value,
      language: getLang()
    }
    dispatch(updateSetting(data))
  }

  const _onChangeLang = value => {
    value != lang && setLang(value)
    switch (value) {
      case languages[0].value:
        dispatch(changeLanguage(languages[0].value))
        _onPrepareDataForUpdateSettingLang(languages[0].value)
        break;
      case languages[1].value:
        dispatch(changeLanguage(languages[1].value))
        _onPrepareDataForUpdateSettingLang(languages[1].value)
        break;
      case languages[2].value:
        dispatch(changeLanguage(languages[2].value))
        _onPrepareDataForUpdateSettingLang(languages[2].value)
        break;
      default:
        break;
    }
  }

  const _onOpenLinkUrl = value => {
    switch (value) {
      case 'twitter': {
        const canOpenUrl = Linking.canOpenURL(linkSocialNetwork.twitter)
        if (canOpenUrl) {
          Linking.openURL(linkSocialNetwork.twitter)
        } else {
          _onOpenUrlFailed()
        }
        break;
      }
      case 'facebook': {
        const canOpenUrl = Linking.canOpenURL(linkSocialNetwork.facebook)
        if (canOpenUrl) {
          Linking.openURL(linkSocialNetwork.facebook)
        } else {
          _onOpenUrlFailed()
        }
        break;
      }
      case 'youtube': {
        const canOpenUrl = Linking.canOpenURL(linkSocialNetwork.youtube)
        if (canOpenUrl) {
          Linking.openURL(linkSocialNetwork.youtube)
        } else {
          _onOpenUrlFailed()
        }
        break;
      }
      case 'instagram': {
        const canOpenUrl = Linking.canOpenURL(linkSocialNetwork.instagram)
        if (canOpenUrl) {
          Linking.openURL(linkSocialNetwork.instagram)
        } else {
          _onOpenUrlFailed()
        }
        break;
      }
      case 'linkedin': {
        const canOpenUrl = Linking.canOpenURL(linkSocialNetwork.linkedIn)
        if (canOpenUrl) {
          Linking.openURL(linkSocialNetwork.linkedIn)
        } else {
          _onOpenUrlFailed()
        }
        break;
      }
      case 'tc': {
        const canOpenUrl = Linking.canOpenURL(legalLink.termsConditions)
        if (canOpenUrl) {
          Linking.openURL(legalLink.termsConditions)
        } else {
          _onOpenUrlFailed()
        }
        break;
      }
      case 'pp': {
        const canOpenUrl = Linking.canOpenURL(legalLink.privacyPolicy)
        if (canOpenUrl) {
          Linking.openURL(legalLink.privacyPolicy)
        } else {
          _onOpenUrlFailed()
        }
        break;
      }
      case 'bm': {
        const canOpenUrl = Linking.canOpenURL(legalLink.borwMembership)
        if (canOpenUrl) {
          Linking.openURL(legalLink.borwMembership)
        } else {
          _onOpenUrlFailed()
        }
        break;
      }
      case 'how': {
        const canOpenUrl = Linking.canOpenURL(legalLink.howItWorks)
        if (canOpenUrl) {
          Linking.openURL(legalLink.howItWorks)
        } else {
          _onOpenUrlFailed()
        }
        break;
      }
      case 'faqs': {
        const canOpenUrl = Linking.canOpenURL(legalLink.faqs)
        if (canOpenUrl) {
          Linking.openURL(legalLink.faqs)
        } else {
          _onOpenUrlFailed()
        }
        break;
      }
      case 'os': {
        const canOpenUrl = Linking.canOpenURL(legalLink.ourStory)
        if (canOpenUrl) {
          Linking.openURL(legalLink.ourStory)
        } else {
          _onOpenUrlFailed()
        }
        break;
      }
      case 'sg': {
        const canOpenUrl = Linking.canOpenURL(legalLink.sizingGuide)
        if (canOpenUrl) {
          Linking.openURL(legalLink.sizingGuide)
        } else {
          _onOpenUrlFailed()
        }
        break;
      }
      default:
        break;
    }
  }

  return {
    _onLogOutConfirmation,
    _onAddPaymentMethods,
    _onChangeVisible,
    _onWebViewStateChange,
    _onNavigateMyRatings,
    _onNavigateMyPoints,
    _onNavigateEditProfile,
    _onNavigateOrder,
    _onChangeLoadingIndicator,
    _onOpenLinkUrl,
    _onContactUs,
    _onChangeCurrency,
    _onChangeByCourier,
    _onChangeByHand,
    _onChangeSize,
    _onChangeLang,
    _onNavigateBookmark,
    _onDeleteConfirm,
    sizeList,
    lang,
    languages,
    size,
    currency,
    methods,
    currencyList,
    isVisible,
    loadingStripe,
    stripe,
    isLoading,
    loading
  }
}

export {
  useSettingsFacade
}