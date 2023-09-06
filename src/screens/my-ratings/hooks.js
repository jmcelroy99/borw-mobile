import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Animated } from 'react-native';
import { getRatingFromBuyers, getRatingFromSellers } from "./actions";
import global from 'src/utils/global';

const useMyRatingsFacade = (W, navigation) => {
  const currentUser = global.getUser();
  const dispatch = useDispatch();
  const userId = navigation.getParam('userId')
  const [totalAverage, setTotalAverage] = useState(0.0)
  const [currentTab, setCurrentTab] = useState(0)
  const [ratingsList, setRatingsList] = useState(null)
  const [isRefreshing, setRefreshing] = useState(false)
  const [moveAnimation, setAnimation] = useState(new Animated.ValueXY({ x: 0, y: 0 }))
  const { ratingsFromSellers, ratingsFromBuyers, currentSellerPage, currentBuyerPage,
    nextSellerPage, nextBuyerPage, loading, totalSellers, sellersAverage,
    totalBuyers, buyersAverage} = useSelector(state => state.myRatings)

  useEffect(() => {
    setRefreshing(true)
    const data = {
      limit: 8,
      page: 0,
      userId: userId ? userId : currentUser.id
    }
    dispatch(getRatingFromSellers(data))
    dispatch(getRatingFromBuyers(data))
  }, [])

  useEffect(() => {
    setRefreshing(false)
  }, [ratingsFromSellers, ratingsFromBuyers])

  useEffect(() => {
    if (sellersAverage, buyersAverage) {
      if (buyersAverage == 0.0) {
        setTotalAverage(parseFloat(sellersAverage))
        return;
      } else if (sellersAverage == 0.0) {
        setTotalAverage(parseFloat(buyersAverage))
        return;
      }
      const average = (sellersAverage * totalSellers + buyersAverage * totalBuyers) / (totalSellers + totalBuyers)
      setTotalAverage(parseFloat(average))
    }
  }, [sellersAverage, buyersAverage])

  useEffect(() => {
    if (currentTab == 0 || !currentTab) {
      Animated.spring(moveAnimation, {
        toValue: {
          x: 0,
          y: 0,
        },
      }).start();
    } else if (currentTab == 1) {
      Animated.spring(moveAnimation, {
        toValue: {
          x: W / 2,
          y: 0,
        },
      }).start();
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

  const _onRefreshing = () => {
    setRefreshing(true)
    const data = {
      limit: 8,
      page: 0,
      userId: userId ? userId : currentUser.id
    }
    dispatch(getRatingFromSellers(data))
    dispatch(getRatingFromBuyers(data))
  }

  const _onLoadMore = () => {
    if (currentTab == 0 || !currentTab) {
      if (nextSellerPage && currentSellerPage < nextSellerPage) {
        const data = {
          limit: 8,
          page: nextSellerPage,
          userId: currentUser.id
        }
        dispatch(getRatingFromSellers(data))
      }
    } else if (currentTab == 1) {
      if (nextBuyerPage && currentBuyerPage < nextBuyerPage) {
        const data = {
          limit: 8,
          page: nextBuyerPage,
          userId: currentUser.id
        }
        dispatch(getRatingFromBuyers(data))
      }
    }
  }

  return {
    totalAverage,
    moveAnimation,
    currentTab,
    isRefreshing,
    sellersAverage,
    totalSellers,
    buyersAverage,
    totalBuyers,
    loading,
    ratingsFromSellers,
    ratingsFromBuyers,
    _onChangeTab,
    _onRefreshing,
    _onLoadMore
  }
}

export {
  useMyRatingsFacade
}