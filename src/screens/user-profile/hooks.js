import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, getProducts, bookmarkProfile } from './actions';
import { Alert, Linking } from 'react-native';

const uniqueArr = (data) => {
  const filteredArr = data.reduce((acc, current) => {
    const x = acc.find(item => item.id == current.id);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
  return filteredArr;
}

const useUserProfileFacade = (navigation, t) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth)
  const [currentUser,] = useState(user.toJS().user)
  const [userId,] = useState(navigation.getParam('userId'))
  const [listProducts, setList] = useState([])
  const [location, setLocation] = useState([])
  const [isRefreshing, setRefreshing] = useState(false)
  const [showDeactivated, setShow] = useState(false)
  const [visibleMap, setVisibleMap] = useState(false)
  const [loadingLoadMore, setLoadingLoadMore] = useState(false)
  const { loading, userInfo, products, nextPage } = useSelector(state => state.userProfile)

  useEffect(() => {
    const data = {
      userId: userId != currentUser.id && userId ? userId : 'me'
    }
    const data2 = {
      page: 0,
      limit: 10,
      userId: userId ? userId : 'me'
    }
    dispatch(getProducts(data2))
    dispatch(getUserInfo(data))
  }, [])

  useEffect(() => {
    if (products) {
      setRefreshing(false)
      setLoadingLoadMore(false)
      const listTemp = products.filter(item => item.isPublic)
      setList(uniqueArr(listTemp))
    }
  }, [products])

  useEffect(() => {
    if (userInfo && userInfo.location) {
      if (userInfo.deactivated) {
        setShow(true)
        return
      }
      let temp = userInfo.location.split(',');
      const userLocation = [temp[0], temp[1]]
      setLocation(userLocation)
    }
  }, [userInfo])

  useEffect(() => {
    if (showDeactivated) {
      _onShowPopUpDeletedAccount()
    }
  }, [showDeactivated])

  const _onRefreshing = () => {
    setRefreshing(true)
  }

  const _onLoadMore = () => {
    if (nextPage) {
      const data = {
        page: nextPage,
        limit: 10,
        userId: userId ? userId : 'me'
      }
      setLoadingLoadMore(true)
      dispatch(getProducts(data))
    }
  }

  const _onOpenGmail = () => {
    Linking.canOpenURL(`mailto:${userInfo.email}`)
      .then(supported => {
        if (!supported) {
        } else {
          return Linking.openURL(`mailto:${userInfo.email}`)
        }
      })
      .catch(err => {
        console.error('An error occurred', err)
      })
  }

  const _onChangeVisibleMap = () => {
    setVisibleMap(!visibleMap)
  }

  const _onBookmarkProfile = () => {
    dispatch(bookmarkProfile({
      id: userId,
      bookmarked: !userInfo.bookmarked
    }))
  }

  const _onShowPopUpDeletedAccount = () => {
    Alert.alert(
      t('profile:text_deactivated_user_title'),
      t('profile:text_deactivated_user_desc'),
      [
        {
          text: t('common:text_ok'),
          style: 'cancel'
        },
      ],
      { cancelable: true }
    );
  }

  return {
    loading,
    userInfo,
    listProducts,
    nextPage,
    currentUser,
    isRefreshing,
    loadingLoadMore,
    userId,
    location,
    visibleMap,
    _onBookmarkProfile,
    _onOpenGmail,
    _onRefreshing,
    _onLoadMore,
    _onChangeVisibleMap
  }
}

export {
  useUserProfileFacade
}