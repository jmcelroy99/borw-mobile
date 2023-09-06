import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { orderProduct } from './actions';
import { removeProductToCart, removeAllProductToCart } from '../product/product-detail/actions';
import * as formula from 'src/utils/formulas';
import { DELIVERY_METHODS } from 'src/modules/common/constants';

const useMyCartFacade = () => {
  const dispatch = useDispatch();
  const [list, setList] = useState([])
  const [totalPrice, setTotalPrice] = useState(0.0)
  const { cart } = useSelector(state => state.productDetail)
  const { orders, loading } = useSelector(state => state.myCart)
  const [shouldShowTotal, setShouldShowTotal] = useState(true)

  useEffect(() => {
    if (list && list.length > 0) {
      let currency = list[0].currency
      let total = 0.00
      for (let index = 0; index < list.length; index++) {
        if (currency != list[index].currency) {
          setShouldShowTotal(false)
          return
        }
        if (index == list.length - 1) {
          setShouldShowTotal(true)
        }
        if (list[index].isDonation && list[index].deliveryFee && list[index].deliveryMethod == DELIVERY_METHODS.BY_COURIER) {
          total += parseFloat(formula.getFinalPriceForDeliveryForDonation(list[index].deliveryFee))
        } else {
          if (list[index].totalPrice && list[index].totalPrice != 0) {
            total += parseFloat(list[index].totalPrice)
          }
        }
      }
      setTotalPrice(parseFloat(total))
    }
  }, [list])

  useEffect(() => {
    if (cart) {
      setList(cart)
    }
  }, [cart])

  const _onSubmitOrder = () => {
    dispatch(orderProduct(list))
  }

  const _onRemoveToCart = order => {
    dispatch(removeProductToCart(order))
  }

  const _onRemoveAllToCart = () => {
    dispatch(removeAllProductToCart())
  }

  return {
    list,
    orders,
    loading,
    totalPrice,
    shouldShowTotal,
    _onRemoveToCart,
    _onSubmitOrder
  }
}

export {
  useMyCartFacade,
}