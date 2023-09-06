import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { getListFilter } from '../actions';
import { mainStack } from 'src/config/navigator';
import { useDispatch } from 'react-redux';
import { Alert, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import global from 'src/utils/global';

const types = [{
  name: 'Rent',
  id: 'isRent'
}, {
  name: 'Buy-out',
  id: 'isBuyOut'
}, {
  name: 'Donation',
  id: 'isDonation'
}]

const category = [{
  name: 'Clothing',
  id: 'isClothing'
}, {
  name: 'Accessories',
  id: 'isAccessories'
},
{
  name: 'Shoes',
  id: 'isShoes'
}]

const users = [{
  name: 'Women',
  id: 'isWomen'
}, {
  name: 'Kids',
  id: 'isKid'
}, {
  name: 'Men',
  id: 'isMen'
}]

const useFilterFacade = (navigation, _onChangeVisible, isDesignersOnly, formikValues, t) => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState(category);
  const [distance, setDistance] = useState(500 + 'm');
  const [location, setLocation] = useState()
  const [values, setValues] = useState()

  useEffect(() => {
    const temp = [...categories]
    if (temp.findIndex(item => item.id == 'isDesigner') == -1) {
      isDesignersOnly ? temp.splice(3, 1) : temp.push({
        name: 'Designer Only',
        id: 'isDesigner'
      })
    }
    setCategories(temp)
  }, [])

  useEffect(() => {
    if (formikValues) {
      formik.setValues(formikValues)
    }
  }, [formikValues])

  const formik = useFormik({
    initialValues: {
      isRent: false,
      isBuyOut: false,
      isDonation: false,
      isClothing: false,
      isAccessories: false,
      isShoes: false,
      isMen: false,
      isWomen: false,
      isKid: false,
      isDesigner: false,
      distanceLimit: -1
    },
    onSubmit: values => {
      const filtered = []
      for (const [key, value] of Object.entries(values)) {
        if (value) {
          filtered.push(key)
        }
      }
      navigation.navigate(mainStack.search, {
        filtered: filtered
      })
      if (location) {
        values.location = location
      } else {
        values.location = global.getLocation()
        dispatch(getListFilter(values))
      }
      if (values.distanceLimit == -1) {
        delete values.distanceLimit
        dispatch(getListFilter(values))
      } else if (!location && global.getLocation().length == 0) {
        _onGetCurrentLocation()
        setValues(values)
      } else {
        dispatch(getListFilter(values))
      }
    },
  })

  useEffect(() => {
    if (location) {
      global.setLocation(location)
      if (values) {
        const value = { ...values }
        value.location = location
        dispatch(getListFilter(value))
      }
    }
  }, [location])

  const _onGetCurrentLocation = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            'title': t('map:text_location_permission'),
            'message': t('map:text_location_permission_desc')
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            (position) => {
              const newLocation = [position.coords.latitude, position.coords.longitude]
              setLocation(newLocation)
            }, (error) => {
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true }
          );
        }
      } else {
        Geolocation.requestAuthorization('whenInUse').then(() => {
          Geolocation.getCurrentPosition((position) => {
            const newLocation = [position.coords.latitude, position.coords.longitude]
            setLocation(newLocation)
          }, (error) => {
            console.log(error.code, error.message);
          },
            { enableHighAccuracy: true }
          );
        })
      }
    } catch (error) {
      _onShowWarningLocation()
    }
  }

  const _onShowErrorGetLocation = (error) => {
    Alert.alert(
      t('error:text_warning_location_title'),
      error,
      [
        {
          text: t('common:text_ok'),
          style: 'cancel'
        },
      ],
      { cancelable: true }
    );
  }

  const _onChangeDistance = value => {
    if (value < 100001) {
      if (value > 1000) {
        let km = value / 1000;
        setDistance(km.toFixed(0) + 'km')
      } else {
        setDistance(value + 'm')
      }
      formik.setFieldValue('distanceLimit', value)
    } else if (value == 100001) {
      setDistance(t('shop:text_anywhere'))
    }
  }

  const _onHandleSubmit = () => {
    formik.handleSubmit()
    _onChangeVisible()
  }

  return {
    types,
    distance,
    categories,
    users,
    formik,
    _onChangeDistance,
    _onHandleSubmit
  }
}

export {
  useFilterFacade
}