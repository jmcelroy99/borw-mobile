import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListSearch, getListFilter } from './actions';
import { useFormik } from 'formik';
import global from 'src/utils/global';
import { likeItem } from 'src/screens/home-screen/actions';

const types = [{
  name: 'Rent',
  id: 'isRent'
}, {
  name: 'Buy-out',
  id: 'isBuyOut'
}, {
  name: 'Donation',
  id: 'isDonation'
}]

const category = [{
  name: 'Clothing',
  id: 'isClothing'
}, {
  name: 'Accessories',
  id: 'isAccessories'
},
{
  name: 'Shoes',
  id: 'isShoes'
}]

const users = [{
  name: 'Women',
  id: 'isWomen'
}, {
  name: 'Kid',
  id: 'isKid'
}, {
  name: 'Men',
  id: 'isMen'
}]

const useSearchAndFilterFacade = (props) => {
  const user = global.getUser();
  const isFilter = props.navigation.getParam('isFilter');
  const isDesignersOnly = props.navigation.getParam('isDesignersOnly');
  const filtered = props.navigation.getParam('filtered');
  const dispatch = useDispatch();
  const [categories, setCategories] = useState(category);
  const [search, setSearch] = useState('');
  const [distance, setDistance] = useState(500 + 'm');
  const [data, setData] = useState([]);
  const [isVisible, setVisible] = useState(isFilter);
  const { products, loading } = useSelector(state => state.search);

  useEffect(() => {
    const temp = [...categories]
    isDesignersOnly ? temp.splice(3, 1) : temp.push({
      name: 'Designer Only',
      id: 'isDesigner'
    })
    setCategories(temp)

    if (filtered) {
      const values = {
        isRent: filtered.findIndex(item => item == 'isRent') != -1,
        isBuyOut: filtered.findIndex(item => item == 'isBuyOut') != -1,
        isDonation: filtered.findIndex(item => item == 'isDonation') != -1,
        isClothing: filtered.findIndex(item => item == 'isClothing') != -1,
        isAccessories: filtered.findIndex(item => item == 'isAccessories') != -1,
        isShoes: filtered.findIndex(item => item == 'isShoes') != -1,
        isMen: filtered.findIndex(item => item == 'isMen') != -1,
        isWomen: filtered.findIndex(item => item == 'isWomen') != -1,
        isKid: filtered.findIndex(item => item == 'isKid') != -1,
        isDesigner: filtered.findIndex(item => item == 'isDesigner') != -1,
      }
      formik.setValues(values)
    }
  }, [])

  const formik = useFormik({
    initialValues: {
      isRent: false,
      isBuyOut: false,
      isDonation: false,
      isClothing: false,
      isAccessories: false,
      isShoes: false,
      isMen: false,
      isWomen: false,
      isKid: false,
      isDesigner: false,
    },
    onSubmit: values => {
      dispatch(getListFilter(values))
    },
  })

  const _onUpdateSearch = (value) => {
    setSearch(value)
    if (value == '') {
      setData([])
    }
  }

  useEffect(() => {
    if (products) {
      setData([])
      setData(products)
    }
  }, [products])

  const _onSubmitSearch = (value) => {
    if (value != '') {
      dispatch(getListSearch(value))
    } else {
      setData([])
    }
  }

  const _onChangeVisible = () => {
    setVisible(!isVisible)
  }

  const _onHandleSubmit = () => {
    formik.handleSubmit()
    _onChangeVisible()
  }

  useEffect(() => {
    _onSubmitSearch(search)
  }, [search])

  const _onChangeDistance = value => {
    if (value < 100001) {
      if (value > 1000) {
        let km = value / 1000;
        setDistance(km.toFixed(0) + 'km')
      } else {
        setDistance(value + 'm')
      }
    } else if (value == 100001) {
      setDistance('Anywhere')
    }
  }

  const _onLikeItem = (id, isLike) => {
    const newData = [...data]
    const itemSearch = newData.find(search => search.id == id)
    if (itemSearch) {
      itemSearch.liked = !itemSearch.liked
      itemSearch.likes = isLike ? ++itemSearch.likes : --itemSearch.likes
      setData(newData)
    }
    const obj = {
      id,
      liked: isLike
    }
    dispatch(likeItem(obj))
  }

  return {
    search,
    data,
    loading,
    isVisible,
    types,
    categories,
    users,
    user,
    formik,
    distance,
    _onLikeItem,
    _onChangeDistance,
    _onHandleSubmit,
    _onChangeVisible,
    _onUpdateSearch,
    _onSubmitSearch
  }
}

export {
  useSearchAndFilterFacade
}