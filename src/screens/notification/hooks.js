import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications, markAsRead, getUnreadCount } from "./actions";
import { mainStack } from 'src/config/navigator';
import { getNotificationType } from 'src/utils/string';

const useNotificationFacade = (navigation) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth)
  const { notifications, nextPage, currentPage, unreadSuccess, loading } = useSelector(state => state.notification)
  const [userProfile,] = useState(user.toJS().user)
  const [isRefreshing, setRefreshing] = useState(false)
  const [isLoadMore, setLoadMore] = useState(false)

  useEffect(() => {
    const data = {
      page: 0,
      limit: 8
    }
    dispatch(getNotifications(data))
    dispatch(getUnreadCount())
  }, [])

  // useEffect(() => {
  //   navigation.addListener('didFocus', () => {
  //     console.log("did focus");
  //     return;
  //     const data = {
  //       page: 0,
  //       limit: 8
  //     }
  //     dispatch(getNotifications(data))
  //     dispatch(getUnreadCount())
  //   });

  // }, [navigation])

  useEffect(() => {
    if (unreadSuccess) {
      dispatch(getUnreadCount())
    }
  }, [unreadSuccess])

  useEffect(() => {
    if (notifications) {
      setLoadMore(false)
      setRefreshing(false)
    }
  }, [notifications])

  const _onRefreshing = () => {
    setRefreshing(!isRefreshing)
    const data = {
      page: 0,
      limit: 8
    }
    dispatch(getNotifications(data))
  }

  const _onClickNotification = (id, type, productId, orderId, isRead, userId) => {
    if (!isRead) {
      const data = {
        notificationId: id
      }
      dispatch(markAsRead(data))
    }
    if (getNotificationType(type) == 'product' && productId) {
      navigation.navigate(mainStack.product_detail, {
        productId: productId
      })
    } else if (getNotificationType(type) == 'order' && orderId) {
      navigation.navigate(mainStack.order_detail, {
        orderId
      })
    } else if (getNotificationType(type) == 'rating' && userId) {
      navigation.navigate(mainStack.my_ratings)
    } else if (getNotificationType(type) == 'profile' && userId) {
      navigation.navigate(mainStack.user_profile, {
        userId
      })
    }
  }

  const _onLoadMore = () => {
    if (nextPage && nextPage > currentPage) {
      setLoadMore(true)
      const data = {
        page: nextPage,
        limit: 8
      }
      dispatch(getNotifications(data))
    }
  }

  return {
    loading,
    currentPage,
    notifications,
    isRefreshing,
    isLoadMore,
    _onRefreshing,
    _onClickNotification,
    _onLoadMore
  }
}

export {
  useNotificationFacade
}