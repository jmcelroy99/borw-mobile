import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  connectWithFacebook, disconnectWithFacebook, disconnectWithGoogle, updateGoogleAccountFromAsync, verifyEmail,
  connectWithGoogle, getUserInfo, updateUserInfo, updateFacebookAccountFromAsync, removeTemporatySocialAccount
} from './actions';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { GoogleSignin } from '@react-native-community/google-signin';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-community/async-storage';
import * as Actions from 'src/screens/user-profile/actions';

const useEditProfileFacade = (t, navigation) => {
  const dispatch = useDispatch()
  const shouldRefresh = navigation.getParam('shouldRefresh')
  const [isSubmit, setSubmit] = useState(false)
  const [isAlreadyChanged, setChangedEmail] = useState(false)
  const [isVisible, setVisible] = useState(false)
  const [showModalAvatar, setShow] = useState(false)
  const [isChangeBusiness, setChangeBusiness] = useState(false)
  const [value, setValue] = useState()
  const [type, setType] = useState()
  const [user, setUser] = useState()
  const [defaultAddress, setDefaultAddress] = useState()
  let { updateProfileSuccess, verifyEmailSuccess } = useSelector(state => state.editProfile)
  const { accountGoogle, accountFacebook, userInfo, loading } = useSelector(state => state.editProfile)

  useEffect(() => {
    verifyEmailSuccess = null;
    if (Platform.OS === 'android') {
      GoogleSignin.configure();
    } else {
      GoogleSignin.configure({
        iosClientId: '410788751750-uo3a71skhg11pp9r2kl1d61056ec3m6j.apps.googleusercontent.com',
        webClientId: '410788751750-uo3a71skhg11pp9r2kl1d61056ec3m6j.apps.googleusercontent.com'
      })
    }

    dispatch(getUserInfo())
    getFacebookAccountAsync()
    getGoogleAccountAsync()
  }, [])

  useEffect(() => {
    if (verifyEmailSuccess) {
      _onVerifyEmail()
    }
  }, [verifyEmailSuccess])

  useEffect(() => {
    if (updateProfileSuccess) {
      dispatch(getUserInfo())
      if (shouldRefresh) {
        const data = {
          userId: 'me'
        }
        dispatch(Actions.getUserInfo(data))
      }
    }
  }, [updateProfileSuccess])

  useEffect(() => {
    updateProfileSuccess = null

    if (userInfo) {
      const tempUser = { ...userInfo }
      tempUser.avatar = {
        uri: userInfo.avatar
      }
      setUser(tempUser)

      const values = {
        lastName: userInfo.lastName,
        firstName: userInfo.firstName,
        bio: userInfo.bio || '',
        address: userInfo.address || defaultAddress || '',
        email: userInfo.email,
        location: userInfo.location,
        phoneNumber: userInfo.phoneNumber,
        businessName: userInfo.businessName || '',
        website: userInfo.website || '',
        companyPhone: userInfo.companyPhone || '',
        VAT: userInfo.VAT || '',
        businessDetails: userInfo.businessDetails || '',
        socialAvatar: '',
        googleUID: '',
        facebookUID: '',
        newEmail: '',
        isChangeEmail: false,
        isChangeBusiness: false,
        isBusiness: userInfo.isBusiness,
        isVerified: userInfo.verifiedEmail,
        isPublicEmail: (userInfo.settings.privateInfos.findIndex(item => item == 'email') == -1),
        isPublicAddress: (userInfo.settings.privateInfos.findIndex(item => item == 'address') == -1),
        isPublicPhone: (userInfo.settings.privateInfos.findIndex(item => item == 'phoneNumber') == -1),
      }
      formik.setValues(values)
    }
  }, [userInfo])

  const editProfileValidateSchema = Yup.object().shape({
    isBusiness: Boolean(),
    isChangeEmail: Boolean(),
    isChangeBusiness: Boolean(),
    lastName: Yup.string().trim()
      .min(2, t('error:text_minimum_length_for_last_name'))
      .max(32, t('error:text_maximum_length_for_last_name'))
      .matches('^([^0-9]*)$', t('error:text_warning_name_contains_number'))
      .required(t('error:text_require_field')),
    firstName: Yup.string().trim()
      .min(2, t('error:text_minimum_length_for_first_name'))
      .max(32, t('error:text_maximum_length_for_first_name'))
      .matches('^([^0-9]*)$', t('error:text_warning_name_contains_number'))
      .required(t('error:text_require_field')),
    bio: Yup.string()
      .matches(/^([^\s])/, t('error:text_warning_name_contains_number')),
    address: Yup.string().trim()
      .required(t('error:text_require_field')),
    email: Yup.string().trim()
      .required(t('error:text_require_field')),
    phoneNumber: Yup.string().trim()
      .required(t('error:text_require_field')),
    businessName: Yup.string().trim()
      .when('isBusiness', {
        is: true,
        then: Yup.string().required(t('error:text_require_field'))
      })
      .min(2, t('error:text_invalid_length_for_business_name'))
      .max(25, t('error:text_invalid_length_for_business_name')),
    newEmail: Yup.string().trim()
      .when('isChangeEmail', {
        is: true,
        then: Yup.string().required(t('error:text_require_field'))
      })
      .email(t('error:text_email_format_wrong')),
    companyPhone: Yup.string().trim()
      .matches(`^([+][0-9]*)$`, t('error:text_warning_phone_invalid'))
  })

  const formik = useFormik({
    initialValues: {
      lastName: '',
      firstName: '',
      bio: '',
      address: '',
      email: '',
      location: '',
      phoneNumber: '',
      businessName: '',
      website: '',
      companyPhone: '',
      VAT: '',
      businessDetails: '',
      socialAvatar: '',
      googleUID: '',
      facebookUID: '',
      newEmail: '',
      isFocused: false,
      isChangeBusiness: false,
      isBusiness: false,
      isVerified: false,
      isPublicEmail: false,
      isPublicAddress: false,
      isPublicPhone: false,
    },
    validationSchema: editProfileValidateSchema,
    validateOnMount: true,
    onSubmit: values => {
      if (values.socialAvatar == '') {
        values.avatar = { ...user.avatar }
      }
      if (accountGoogle) {
        values.googleUID = accountGoogle.user.id
        values.accountGoogle = accountGoogle
      }
      if (accountFacebook) {
        values.facebookUID = accountFacebook.id
        values.accountFacebook = accountFacebook
      }
      dispatch(updateUserInfo(values))
    },
  })

  const getFacebookAccountAsync = async () => {
    try {
      const facebook = await AsyncStorage.getItem('facebookAccount');
      facebook && dispatch(updateFacebookAccountFromAsync(JSON.parse(facebook)))
    } catch (error) {
      console.log('Has error while get data: ', error)
    }
  }

  const getGoogleAccountAsync = async () => {
    try {
      const google = await AsyncStorage.getItem('googleAccount');
      google && dispatch(updateGoogleAccountFromAsync(JSON.parse(google)))
    } catch (error) {
      console.log('Has error while get data: ', error)
    }
  }

  const _onSubmit = () => {
    setSubmit(true)
    formik.handleSubmit()
  }

  const _onFocusPhoneNo = () => {
    Alert.alert(
      t('profile:text_cannot_change_phone_title'),
      t('profile:text_cannot_change_phone_desc'),
      [
        {
          text: t('common:text_ok'),
          style: 'cancel'
        },
      ],
      { cancelable: true }
    );
  }

  const _onChangeEmail = () => {
    if (!formik.values['isVerified']) {
      Alert.alert(
        t('profile:text_verify_email_title'),
        t('profile:text_verify_email_desc'),
        [
          {
            text: t('profile:text_verify_email_action'),
            onPress: () => {
              dispatch(verifyEmail())
            },
          },
          {
            text: t('common:text_cancel'),
            style: 'cancel'
          },
        ],
        { cancelable: true }
      );
    }
  }

  const _onVerifyEmail = () => {
    Alert.alert(
      t('profile:text_check_inbox_title'),
      t('profile:text_check_inbox_desc', { email: userInfo.email }),
      [
        {
          text: t('common:text_ok'),
          style: 'cancel'
        },
      ],
      { cancelable: true }
    );
  }

  const _onFocusEmail = () => {
    Alert.alert(
      t('profile:text_change_email_title'),
      t('profile:text_change_email_desc'),
      [
        {
          text: t('common:text_cancel'),
          style: 'cancel'
        },
        {
          text: t('common:text_ok'),
          onPress: () => {
            _onShowModalChangeEmail()
          }
        },
      ],
      { cancelable: true }
    );
  }

  const _onChangeVisible = (type) => {
    switch (type) {
      case 'phone':
        setValue(formik.values['isPublicPhone'])
        setType('phone')
        break;
      case 'email':
        setValue(formik.values['isPublicEmail'])
        setType('email')
        break;
      case 'address':
        setValue(formik.values['isPublicAddress'])
        setType('address')
        break;
      default:
        break;
    }
    setVisible(!isVisible)
  }

  const _onSetEmail = value => {
    if (!isAlreadyChanged) {
      setChangedEmail(true)
    }
    formik.setFieldValue('newEmail', value)
  }

  const _onChangePrivacy = (value, type) => {
    _onChangeVisible();
    switch (type) {
      case 'phone':
        formik.setFieldValue('isPublicPhone', value)
        break;
      case 'email':
        formik.setFieldValue('isPublicEmail', value)
        break;
      case 'address':
        formik.setFieldValue('isPublicAddress', value)
        break;
      default:
        break;
    }
  }

  const _onConnectFacebook = () => {
    if (!accountFacebook) {
      dispatch(connectWithFacebook())
    } else {
      Alert.alert(
        t('profile:text_change_linked_facebook_title'),
        t('profile:text_change_linked_facebook_desc'),
        [
          {
            text: t('common:text_cancel'),
            style: 'cancel'
          },
          {
            text: t('profile:text_change'),
            onPress: () => {
              dispatch(connectWithFacebook())
            }
          },
          {
            text: t('profile:text_remove'),
            onPress: () => {
              dispatch(disconnectWithFacebook())
            }
          },
        ],
        { cancelable: true }
      );
    }
  }

  const _onConnectGoogle = () => {
    if (!accountGoogle) {
      dispatch(connectWithGoogle())
    } else {
      Alert.alert(
        t('profile:text_change_linked_google_title'),
        t('profile:text_change_linked_google_desc'),
        [
          {
            text: t('common:text_cancel'),
            style: 'cancel'
          },
          {
            text: t('profile:text_change'),
            onPress: () => {
              dispatch(disconnectWithGoogle())
              setTimeout(() => {
                dispatch(connectWithGoogle())
              }, 250);
            }
          },
          {
            text: t('profile:text_remove'),
            onPress: () => {
              dispatch(disconnectWithGoogle())
            }
          },
        ],
        { cancelable: true }
      );
    }
  }

  const _onChangeAvatar = () => {
    setShow(!showModalAvatar)
  }

  const _onSetDefaultAddress = address => {
    address != defaultAddress && setDefaultAddress(address)
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
    const tempUser = { ...user }
    tempUser.avatar = photo
    setUser(tempUser)
    formik.setFieldValue('socialAvatar', '')
  }

  const _onChooseImageAvatar = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      let fileName = response.fileName;
      if (!fileName) {
        const path = response.uri.split("/")
        if (path.length > 0) {
          fileName = path[path.length - 1]
        } else {
          fileName = moment().format('YYYY-MM-DD-HH-mm-ss')
        }
      }
      const image = {
        uri: response.uri,
        name: fileName,
        type: response.type
      }
      const tempUser = { ...user }
      tempUser.avatar = image
      setUser(tempUser)
      formik.setFieldValue('socialAvatar', '')
    }
  }

  const _onChooseOption = (option) => {
    setShow(!showModalAvatar)
    setTimeout(() => {
      switch (option) {
        case 1:
          _onPickFromCamera()
          break;
        case 2:
          _onPickFromGallery()
          break;
        case 3:
          if (accountFacebook) {
            const tempUser = { ...user }
            tempUser.avatar = {
              uri: accountFacebook.avatar
            }
            setUser(tempUser)
            formik.setFieldValue('socialAvatar', accountFacebook.avatar)
          }
          break;
        case 4:
          if (accountGoogle) {
            const tempUser = { ...user }
            tempUser.avatar = {
              uri: accountGoogle.user.photo
            }
            setUser(tempUser)
            formik.setFieldValue('socialAvatar', accountGoogle.user.photo)
          }
          break;
        case 5:
          const tempUser = { ...user }
          tempUser.avatar = {
            uri: null
          }
          setUser(tempUser)
          formik.setFieldValue('socialAvatar', '')
          break;
        default:
          break;
      }
    }, 550);
  }

  const _onNavigateBack = () => {
    dispatch(removeTemporatySocialAccount())
    navigation.goBack()
  }

  const _onShowModalChangeEmail = () => {
    setChangedEmail(false)
    if (formik.values['isChangeEmail']) {
      formik.setFieldValue('newEmail', '')
    }
    formik.setFieldValue('isChangeEmail', !formik.values['isChangeEmail'])
  }

  const _onChangeNewEmail = () => {
    if (formik.errors && formik.errors.newEmail) {
      return;
    }
    _onShowModalChangeEmail()
    const values = {
      email: formik.values['newEmail'],
      isChangeEmail: true
    }
    dispatch(updateUserInfo(values))
  }

  const _onChangeBusiness = (value) => {
    setChangeBusiness(value)
  }

  return {
    user,
    value,
    formik,
    isVisible,
    isSubmit,
    type,
    showModalAvatar,
    accountGoogle,
    accountFacebook,
    loading,
    isChangeBusiness,
    isAlreadyChanged,
    _onSetEmail,
    _onSetDefaultAddress,
    _onChangeNewEmail,
    _onShowModalChangeEmail,
    _onNavigateBack,
    _onChooseOption,
    _onChangeAvatar,
    _onSubmit,
    _onFocusPhoneNo,
    _onChangeEmail,
    _onFocusEmail,
    _onChangeVisible,
    _onChangePrivacy,
    _onConnectFacebook,
    _onConnectGoogle,
    _onChangeBusiness
  }
}

export {
  useEditProfileFacade
}