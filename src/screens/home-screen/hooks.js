import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getListProduct, getListDesigners, getListVideos, likeItem, bookmarkItem, checkMessaging } from './actions';
import { fetchCategories } from 'src/modules/category/actions';
import { getUnreadCount } from 'src/screens/notification/actions';
import notifee, { EventType }  from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { mainStack } from 'src/config/navigator';
import { getNotificationType } from 'src/utils/string';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { HOME_PRODUCTS_LIMIT_ITEM, HOME_DESIGNERS_LIMIT_ITEM, HOME_VIDEO_LIST_ITEM } from 'src/config/product';
import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import global from 'src/utils/global';

let lastMessageID = "";
let unsubscribeMessageHandler = null;
let unsubscribeNotifee = null;

const uniqueProducts = (data) => {
  const filteredArr = data.reduce((acc, current) => {
    const product = acc.find(item => item.id == current.id);
    if (!product) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
  return filteredArr;
}

const paddingToBottom = 20;

const useHomeFacade = (navigation, t) => {
  const dispatch = useDispatch();
  const { products, nextPage, designers, videos, scrollToTop, currentPageProduct } = useSelector(state => state.home)
  const { cart } = useSelector(state => state.productDetail)
  const user = useSelector(state => state.auth)
  const [userProfile, setProfile] = useState(user.toJS().user)
  const [location, setLocation] = useState()
  const [listProduct, setListProduct] = useState([])
  const [listDesigner, setDesigners] = useState([])
  const [listVideos, setVideos] = useState([])
  const [isShowLoadMore, setShow] = useState(false)
  const [shouldShowBadge, setShowBadge] = useState(false)
  const [shouldScrollToTop, setScrollToTop] = useState(null)
  const [isPullRefresh, setPullRefresh] = useState(false)

  const dataTemp = {
    page: 0,
    limit: HOME_DESIGNERS_LIMIT_ITEM,
  }

  const dataVideos = {
    page: 0,
    limit: HOME_VIDEO_LIST_ITEM,
    isDesigner: false,
    isVideo: true,
  }
  const data = {
    page: 0,
    limit: HOME_PRODUCTS_LIMIT_ITEM,
    isDesigner: false,
    isVideo: false,
  }

  useEffect(() => {
    const data = {
      page: 0,
      limit: HOME_PRODUCTS_LIMIT_ITEM,
      isDesigner: false,
      isVideo: false,
    }
    if (location) {
      data['location'] = location[0] + ',' + location[1]
    } else {
      _onGetCurrentLocation()
    }
    dispatch(getListProduct(data))
    dispatch(getListDesigners(dataTemp))
    dispatch(getListVideos(dataVideos))
    dispatch(getUnreadCount())
    dispatch(fetchCategories())
    userProfile.firebaseUID && dispatch(checkMessaging({
      userUID: userProfile.firebaseUID
    }))
    requestPermission()
    return () => {
      if (unsubscribeMessageHandler)
        unsubscribeMessageHandler();
      if (unsubscribeNotifee)
        unsubscribeNotifee();
    }
  }, [])

  useEffect(() => {
    if (cart) {
      cart.length > 0 ? setShowBadge(true) : setShowBadge(false)
    }
  }, [cart])

  useEffect(() => {
    if (user) {
      setProfile(user.toJS().user)
    }
  }, [user])

  useEffect(() => {
    setScrollToTop(true)
  }, [scrollToTop])

  useEffect(() => {
    if (location) {
      global.setLocation(location)
      const data = {
        page: 0,
        limit: HOME_PRODUCTS_LIMIT_ITEM,
        isDesigner: false,
        isVideo: false,
        location: location[0] + ',' + location[1]
      }
      dispatch(getListProduct(data))
    }
  }, [location])

  useEffect(() => {
    if (products) {
      isPullRefresh && setPullRefresh(!isPullRefresh)
      let newArr = [...listProduct]
      if (currentPageProduct == 0) {
        products.concat(newArr)
        setListProduct(uniqueProducts(products))
      } else {
        const temp = listProduct.concat(products)
        setListProduct(uniqueProducts(temp))
      }
      setShow(false)
    }
  }, [products])

  useEffect(() => {
    if (designers && designers.length > 0) {
      isPullRefresh && setPullRefresh(!isPullRefresh)
      setDesigners(designers)
    }
  }, [designers])

  useEffect(() => {
    if (videos && videos.length > 0) {
      isPullRefresh && setPullRefresh(!isPullRefresh)
      setVideos(videos)
    }
  }, [videos])

  const _onHandleLoadMore = () => {
    if (nextPage) {
      if (nextPage >= currentPageProduct) {
        setShow(true)
        const data = {
          page: nextPage,
          limit: HOME_PRODUCTS_LIMIT_ITEM,
          isDesigner: false,
          isVideo: false,
          location: location ? location[0] + ',' + location[1] : null
        }
        dispatch(getListProduct(data))
      }
    }
  }

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
        } else {
          dispatch(getListProduct(data))
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

  const navigateFromPushNotification = (remoteMessage) => {    
    if (remoteMessage) {
      if (!remoteMessage.data.type) {
        // empty
      }
      else if (getNotificationType(remoteMessage.data.type) == 'product') {
        navigation.navigate(mainStack.product_detail, {
          productId: remoteMessage.data.productId
        })
      } else if (getNotificationType(remoteMessage.data.type) == 'order') {
        navigation.navigate(mainStack.order_detail, {
          orderId: remoteMessage.data.orderId
        })
      } else if (getNotificationType(remoteMessage.data.type) == 'rating') {
        navigation.navigate(mainStack.my_ratings, {
          userId: remoteMessage.data.orderId
        })
      } else if (getNotificationType(remoteMessage.data.type) == 'profile') {
        navigation.navigate(mainStack.user_profile, {
          userId: remoteMessage.data.userId
        })
      } else if (getNotificationType(remoteMessage.data.type) == 'chat') {
        navigation.navigate(mainStack.conversation, {
          roomName: remoteMessage.data.roomId
        })
      }
    }
  }

  const requestPermission = () => {
    if (!unsubscribeNotifee) {
      unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {        
        if (type == EventType.PRESS) {
          try {
            navigateFromPushNotification(JSON.parse(detail.notification.data.data));
          } catch (e) {
            console.log("JSON Parse", e);
          }
        }
      });
    }
    if (!unsubscribeMessageHandler) {
      unsubscribeMessageHandler = messaging().onMessage(message => { // for app in foreground      
        if (lastMessageID === message.messageId)
          return;  
        lastMessageID = message.messageId;
        notifee.displayNotification({
          title: message.notification.title,
          body: message.notification.body,
          data: {
            "data": JSON.stringify(message)
          },
          android: {
            channelId: 'BorwForeground',
          },
        });
      })
    }
    messaging().onNotificationOpenedApp(remoteMessage => {
      navigateFromPushNotification(remoteMessage)
    });
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        navigateFromPushNotification(remoteMessage)
      });
  }

  const _onPullRefresh = () => {
    setPullRefresh(!isPullRefresh)
    const data = {
      page: 0,
      limit: HOME_PRODUCTS_LIMIT_ITEM,
      location: location ? location[0] + ',' + location[1] : null
    }
    dispatch(getListProduct(data))
    dispatch(getListDesigners(dataTemp))    
    dispatch(getListVideos(dataVideos))
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

  const _onScroll = ({ layoutMeasurement, contentOffset, contentSize }) => {
    if (layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom) {
      _onHandleLoadMore()
    } else if (contentOffset.y == 0) {
      _onPullRefresh()
    }
  };

  const _onScrolledToTop = () => {
    setScrollToTop(null)
  }

  const _onNavigateProfile = () => {

  }

  return {
    listProduct,
    listDesigner,
    listVideos,
    isShowLoadMore,
    userProfile,
    isPullRefresh,
    shouldScrollToTop,
    shouldShowBadge,
    _onBookmark,
    _onScrolledToTop,
    _onScroll,
    _onPullRefresh,
    _onLikeItem,
    _onHandleLoadMore,
    _onNavigateProfile
  }
}

export {
  useHomeFacade
}

