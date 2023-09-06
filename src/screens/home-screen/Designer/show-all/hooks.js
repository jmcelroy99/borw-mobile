import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getListDesigners, likeItem } from '../../actions';
import global from 'src/utils/global';
import { Alert, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { bookmarkItem } from 'src/screens/home-screen/actions';

const useDesignersFacade = (t) => {
  const user = global.getUser();
  const dispatch = useDispatch();
  const [location, setLocation] = useState()
  const { designers, loading, nextPageDesigners, currentPageDesigner } = useSelector(state => state.home)

  useEffect(() => {
    _onGetCurrentLocation()
    const data = {
      page: 0,
      limit: 15,
    }
    dispatch(getListDesigners(data))
  }, [])

  useEffect(() => {
    if (location) {
      const data = {
        page: 0,
        limit: 15,
        location: location[0] + ',' + location[1]
      }
      dispatch(getListDesigners(data))
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
              _onShowWarningLocation()
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true }
          );
          Geolocation.getCurrentPosition(location => {
            const newLocation = [location.coords.latitude, location.coords.longitude]
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
              setLocation(newLocation)
            }, (error) => {
              console.log(error.code, error.message);
            },
              { enableHighAccuracy: true }
            );
          } else {
            _onShowErrorGetLocation()
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

  const _onLikeItem = (id, isLike) => {
    const data = {
      id,
      liked: isLike
    }
    dispatch(likeItem(data))
  }

  const _onBookmark = (id, isBookmark) => {
    const data = {
      id,
      bookmarked: isBookmark
    }
    dispatch(bookmarkItem(data))
  }

  const _onLoadMore = () => {
    if (nextPageDesigners && nextPageDesigners > currentPageDesigner) {
      if (location) {
        const data = {
          page: nextPageDesigners,
          limit: 15,
          location: location[0] + ',' + location[1]
        }
        dispatch(getListDesigners(data))
      } else {
        const data = {
          page: nextPageDesigners,
          limit: 15,
        }
        dispatch(getListDesigners(data))
      }
    }
  }

  return {
    designers,
    loading,
    user,
    _onLikeItem,
    _onBookmark,
    _onLoadMore
  }
}

export {
  useDesignersFacade
}