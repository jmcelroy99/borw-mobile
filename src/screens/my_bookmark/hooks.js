import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBookmarkedProducts, getBookmarkedProfiles } from './actions';
import { Animated } from 'react-native';
import { mainStack } from 'src/config/navigator';
import { useFocusEffect } from '@react-navigation/native';

const useMyBookmarkFacade = (W, navigation) => {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState(-1)
  const [isRefreshing, setRefreshing] = useState(false)
  const [loadingLoadMore, setLoading] = useState(false)
  const [moveAnimation, setAnimation] = useState(new Animated.ValueXY({ x: 0, y: 0 }))
  const { loading, bookmarkedProducts, bookmarkedProfiles, nextPageProfiles,
    nextPageProducts, currentPageProducts, currentPageProfiles } = useSelector(state => state.bookmark)

  const dataBookmarked = {
    page: 0,
    limit: 10
  }

  // useEffect(() => {
  //   setCurrentTab(0)
  //   setTimeout(() => {
  //     dispatch(getBookmarkedProducts(dataBookmarked))
  //   }, 400);
  // }, [])

  useEffect(() => {
    navigation.addListener('didFocus', () => {
      setCurrentTab(0)
      // setTimeout(() => {
        dispatch(getBookmarkedProducts(dataBookmarked))
        dispatch(getBookmarkedProfiles(dataBookmarked))
      // }, 400);
    });

  }, [navigation])


  useEffect(() => {
    if (bookmarkedProfiles || bookmarkedProducts) {
      setRefreshing(false)
      setLoading(false)
    }
  }, [bookmarkedProducts, bookmarkedProfiles])

  useEffect(() => {
    if (currentTab == 0) {
      Animated.spring(moveAnimation, {
        toValue: {
          x: 0,
          y: 0,
        },
      }).start();

      setTimeout(() => {
        dispatch(getBookmarkedProducts(dataBookmarked))
      }, 350);
    } else if (currentTab == 1) {
      Animated.spring(moveAnimation, {
        toValue: {
          x: W / 2,
          y: 0,
        },
      }).start();

      setTimeout(() => {
        dispatch(getBookmarkedProfiles(dataBookmarked))
      }, 350);
    }
  }, [moveAnimation])

  useEffect(() => {
    if (currentTab == 0) {
      setAnimation(new Animated.ValueXY({ x: W / 2, y: 0 }))
    } else if (currentTab == 1) {
      setAnimation(new Animated.ValueXY({ x: 0, y: 0 }))
    }
  }, [currentTab])

  const _onChangeTab = (value) => {
    setCurrentTab(value)
  }

  const _onNavigateProduct = id => {
    navigation.navigate(mainStack.product_detail, {
      productId: id
    })
  }

  const _onNavigateProfile = id => {
    navigation.navigate(mainStack.user_profile, {
      userId: id
    })
  }

  const _onRefreshing = () => {
    setRefreshing(true)
    if (currentTab == 0 || !currentTab) {
      dispatch(getBookmarkedProducts(dataBookmarked))
    } else {
      dispatch(getBookmarkedProfiles(dataBookmarked))
    }
  }

  const _onLoadMore = () => {
    if (currentTab == 0 || !currentTab) {
      if (nextPageProducts && nextPageProducts > currentPageProducts) {
        setLoading(true)
        const data = {
          page: nextPageProducts,
          limit: 10
        }
        dispatch(getBookmarkedProducts(data))
      }
    } else {
      if (nextPageProfiles && nextPageProfiles > currentPageProfiles) {
        setLoading(true)
        const data = {
          page: nextPageProfiles,
          limit: 10
        }
        dispatch(getBookmarkedProfiles(data))
      }
    }
  }

  return {
    loading,
    moveAnimation,
    currentTab,
    bookmarkedProducts,
    bookmarkedProfiles,
    isRefreshing,
    loadingLoadMore,
    _onNavigateProfile,
    _onLoadMore,
    _onRefreshing,
    _onNavigateProduct,
    _onChangeTab,
  }
}

export {
  useMyBookmarkFacade,
}