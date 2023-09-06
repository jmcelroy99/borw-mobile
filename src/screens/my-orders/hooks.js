import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getListOrders } from './actions';
import { mainStack } from 'src/config/navigator';

let currentPage = 0

const useMyOrdersFacade = (navigation) => {
  const dispatch = useDispatch();
  const { orders, nextPage, loading } = useSelector(state => state.orders)
  const { cart } = useSelector(state => state.productDetail)
  const [isRefresh, setRefresh] = useState(false)
  const [emptyResult, setEmpty] = useState(false)
  const [itemsInCart, setItems] = useState()
  const [type, setType] = useState('incoming')

  const _onNavigateOrderDetail = id => {
    navigation.navigate(mainStack.order_detail, {
      orderId: id
    })
  }

  const _onRefreshing = () => {
    setRefresh(true)
    const data = {
      page: 0,
      limit: 30
    }
    if (type == 'incoming') {
      data.incoming = true
    } else if (type == 'outgoing') {
      data.outgoing = true
    } else {
      data.archived = true
    } 
    dispatch(getListOrders(data))
  }

  const _onLoadMore = () => {
    if (nextPage) {
      if (nextPage >= currentPage) {
        currentPage += 1;
        const data = {
          page: nextPage == currentPage ? nextPage + 1 : nextPage,
          limit: 30
        }
        dispatch(getListOrders(data))
      }
    }
  }

  const _onChooseIncoming = () => {
    setType('incoming')
    const data = {
      page: 0,
      limit: 30,
      incoming: true
    }
    dispatch(getListOrders(data))
  }

  const _onChooseOutgoing = () => {
    setType('outgoing')
    const data = {
      page: 0,
      limit: 30,
      outgoing: true
    }
    dispatch(getListOrders(data))
  }

  const _onChooseArchived = () => {
    setType('archived')
    const data = {
      page: 0,
      limit: 30,
      archived: true
    }
    dispatch(getListOrders(data))
  }

  useEffect(() => {
    setType('incoming')
    const data = {
      page: 0,
      limit: 30,
      incoming: true
    }
    dispatch(getListOrders(data))
  }, [])
  
  useEffect(() => {
    if (cart) {
      setItems(cart.length)
    }
  }, [cart])

  useEffect(() => {
    if (orders && orders.length == 0 && !loading) {
      setEmpty(true)
    } else {
      setEmpty(false)
      setRefresh(false)
    }
  }, [orders])

  return {
    orders,
    isRefresh,
    loading,
    emptyResult,
    itemsInCart,
    _onChooseIncoming,
    _onChooseOutgoing,
    _onChooseArchived,
    _onLoadMore,
    _onRefreshing,
    _onNavigateOrderDetail
  }
}

export {
  useMyOrdersFacade
}

