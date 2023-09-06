import { useState, useEffect } from 'react';
import globalConfig from '../../../utils/global';
import { Alert, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getLocationByAddress, getAddressByLocation } from './actions';
import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const config = {
  authorizationLevel: 'whenInUse'
}

Geolocation.setRNConfiguration(config);

const useMapViewFacade = (editableLocation, onUpdateAddress, editableAddress, t) => {
  const dispatch = useDispatch()
  const { data, formattedAddress } = useSelector(state => state.location)
  const [location, setLocation] = useState([])
  const [editLocation,] = useState(editableLocation)
  const [markerCoordinates, setMarkerCoordinates] = useState({})
  const [isVisible, setVisible] = useState(false)
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')
  const [address, setAddress] = useState(editableAddress)

  useEffect(() => {
    if (data) {
      const newLocation = [data.lat, data.lng]
      setLocation(newLocation)
      _onInitMapPreviewUrl(newLocation)
    }
  }, [data])

  useEffect(() => {
    if (formattedAddress) {
      setAddress(formattedAddress)
    } else {
      setAddress('')
    }
  }, [formattedAddress])

  useEffect(() => {
    if (location && location.length > 0) {
      _onGetAdress(location)
    }
  }, [location])

  useEffect(() => {
    const newLoc = [51.517381, -0.127758]
    const value = {
      x: {
        latitude: newLoc[0],
        longitude: newLoc[1]
      }
    }
    _onInitMapPreviewUrl(newLoc)
    _onChangeMarker(value)
    setLocation(newLoc)
  }, [])

  useEffect(() => {
    if (address) {
      onUpdateAddress(address)
    }
  }, [address])

  useEffect(() => {
    if (editLocation) {
      let temp = editLocation.split(',');
      if (!temp[0] || !temp[1]) {
        temp = [51.517381, -0.127758]
      }
      const marker = {
        latitude: parseFloat(temp[0]),
        longitude: parseFloat(temp[1])
      }
      setMarkerCoordinates(marker)
      setLocation(temp)
      _onInitMapPreviewUrl(temp)
      _onGetAdress(temp)
    }
  }, [editLocation])

  const _onGetAdress = (location) => {
    dispatch(getAddressByLocation(location))
  }

  const _onAddressSubmit = () => {
    dispatch(getLocationByAddress(address))
  }

  const _onChangePreviewLocation = () => {
    _onInitMapPreviewUrl(location)
    setVisible(!isVisible);
  }

  const _onUserTapped = value => {
    _onChangeMarker(value);
  }

  const _onChangeMarker = value => {
    let marker
    if (!value) {
      marker = {
        latitude: value ? value.latitude : 51.507351,
        longitude: value ? value.longitude : -0.127758
      }
    } else {
      marker = {
        latitude: value.x.latitude,
        longitude: value.x.longitude
      }
      const newLocation = [value.x.latitude, value.x.longitude]
      setLocation(newLocation)
    }
    setMarkerCoordinates(marker)
  }

  const _onInitMapPreviewUrl = location => {
    if (location) {
      const url = `https://maps.googleapis.com/maps/api/staticmap?center=${location[0]
        },${location[1]
        }&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:A%7C${location[0]
        },${location[1]}&key=${globalConfig.getGoogleAPIKey()}`;
      setImagePreviewUrl(url)
    }
  }

  const _onChangeVisible = () => {
    setVisible(!isVisible)
  }

  const _onChangeAddress = value => {
    if (address !== value) {
      setAddress(value)
    }
  }

  const _onGetCurrentLocation = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            'title': 'Location Permission',
            'message': 'Borw App needs access to your location.'
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            (position) => {
              const newLocation = [position.coords.latitude, position.coords.longitude]
              _onInitMapPreviewUrl(newLocation)
              _onChangeMarker({ x: { latitude: newLocation[0], longitude: newLocation[1] } })
              setLocation(newLocation)
            }, (error) => {
              _onShowWarningLocation()
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true }
          );
          Geolocation.getCurrentPosition(location => {
            const newLocation = [location.coords.latitude, location.coords.longitude]
            _onInitMapPreviewUrl(newLocation)
            _onChangeMarker({ x: { latitude: newLocation[0], longitude: newLocation[1] } })
            setLocation(newLocation)
          });
        } else {
          _onShowWarningLocation()
        }
      } else {
        Geolocation.requestAuthorization('whenInUse').then((result) => {
          if (result == 'granted') {
            Geolocation.getCurrentPosition((position) => {
              const newLocation = [position.coords.latitude, position.coords.longitude]
              _onInitMapPreviewUrl(newLocation)
              _onChangeMarker({ x: { latitude: newLocation[0], longitude: newLocation[1] } })
              setLocation(newLocation)
            }, (error) => {
              _onShowErrorGetLocation(error)
              console.log(error.code, error.message);
            },
              { enableHighAccuracy: true }
            );
          } else {
            _onShowWarningLocation()
          }
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

  const _onShowWarningLocation = () => {
    Alert.alert(
      t('error:text_warning_location_title'),
      t('error:text_warning_location_desc'),
      [
        {
          text: t('common:text_ok'),
          style: 'cancel'
        },
      ],
      { cancelable: true }
    );
  }

  const _onChangeLocation = location => {
    setLocation([location.lat, location.long])
  }

  return {
    location,
    address,
    isVisible,
    imagePreviewUrl,
    markerCoordinates,
    _onInitMapPreviewUrl,
    _onAddressSubmit,
    _onChangePreviewLocation,
    _onUserTapped,
    _onChangeMarker,
    _onChangeVisible,
    _onGetCurrentLocation,
    _onChangeLocation,
    _onChangeAddress,
    _onGetAdress
  }
}

export {
  useMapViewFacade,
}