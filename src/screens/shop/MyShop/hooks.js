import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mainStack } from 'src/config/navigator';
import { getMyProducts, deleteProduct, cloneProduct } from './actions';
import { Alert } from 'react-native';

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

const useMyShopFacade = (navigation, t) => {
  const dispatch = useDispatch()
  const { products, loading, currentPage, nextPage, shouldReload } = useSelector(state => state.addProduct)
  const [list, setList] = useState([])
  const [isRefreshing, setRefreshing] = useState(false);
  const [selectedList, setSelected] = useState([])

  useEffect(() => {
    const data = {
      page: 0,
      limit: 8,
      shouldReload: true
    }
    dispatch(getMyProducts(data))
  }, [])

  useEffect(() => {
    if (products) {
      setList(uniqueArr(products))
    }
  }, [products])

  useEffect(() => {
    if (isRefreshing) {
      setRefreshing(!isRefreshing)
    }
  }, [loading])

  const _onRefreshing = () => {
    const data = {
      page: 0,
      limit: 8
    }
    dispatch(getMyProducts(data))
    setList([])
  }

  const _onConfirmDelete = (id) => {
    Alert.alert(
      t('shop:text_ask_delete_product'),
      '',
      [
        {
          text: t('common:text_cancel'),
          style: "cancel"
        },
        {
          text: t('common:text_delete'),
          onPress: () => {
            dispatch(deleteProduct(id))
          }
        }
      ],
      { cancelable: true }
    );
  }

  const _onDeleteItem = id => {
    _onConfirmDelete(id)
    setSelected([])
  }

  const _onEdit = item => {
    setSelected([])
    navigation.navigate(mainStack.new_product, {
      edit: item
    });
  }

  const _onClone = id => {
    dispatch(cloneProduct(id))
    setSelected([])
  }

  const _onChangeSelected = id => {
    if (selectedList.find(i => i == id)) {
      setSelected([])
    } else {
      const temp = []
      temp.push(id)
      setSelected(temp)
    }
  }

  const _onAddProduct = () => {
    navigation.navigate(mainStack.new_product)
  }

  const _onLoadMore = () => {
    if (nextPage && nextPage > currentPage) {
      const data = {
        page: nextPage,
        limit: 8
      }
      dispatch(getMyProducts(data))
    }
  }

  return {
    list,
    selectedList,
    isRefreshing,
    loading,
    _onRefreshing,
    _onChangeSelected,
    _onDeleteItem,
    _onEdit,
    _onClone,
    _onAddProduct,
    _onLoadMore
  }
}

export {
  useMyShopFacade
}