import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAddressByLocation } from 'src/screens/shop/MapView/actions';
import globalConfig from 'src/utils/global';
import { likeItem, bookmarkItem } from 'src/screens/home-screen/actions';

const useProductDetailFacade = (item, userId, likesList, navigation) => {
  const dispatch = useDispatch();
  const [liked, setLiked] = useState()
  const [address, setAddress] = useState()
  const [bookmarked, setBookmarked] = useState()
  const [isVisible, setVisible] = useState(false)
  const [isViewMore, setViewMore] = useState(false)
  const [url, setUrl] = useState()
  const [categoryName,] = useState(item.categoryName)
  const viewLikeList = navigation.getParam('viewLikeList')
  const { formattedAddress } = useSelector(state => state.location)

  useEffect(() => {
    if (item.location) {
      const location = []
      const temp = item.location && item.location.split(',');
      if (temp && temp.length >= 2) {
        location.push(parseFloat(temp[0]))
        location.push(parseFloat(temp[1]))
        const addressUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location[0]
          },${location[1]
          }&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:A%7C${location[0]
          },${location[1]}&key=${globalConfig.getGoogleAPIKey()}`;
        setUrl(addressUrl)
        _onGetAddress(temp)
      }
    }
  }, [item.location])

  useEffect(() => {
    setBookmarked(item.bookmarked)
  }, [item.bookmarked])

  useEffect(() => {
    if (formattedAddress && !address) {
      setAddress(formattedAddress)
    }
  }, [formattedAddress])

  useEffect(() => {
    if (likesList) {
      const index = likesList.findIndex(like => like.user.id == userId)
      const likeInfo = {
        likes: likesList.length,
        isLiked: index != -1
      }
      setLiked(likeInfo)
      _showLikeList(viewLikeList)
    }
  }, [likesList])

  const _onGetAddress = location => {
    dispatch(getAddressByLocation(location))
  }

  const _onLikeItem = (id, isLike) => {
    const temp = { ...liked }
    temp.likes = isLike ? ++temp.likes : --temp.likes
    temp.isLiked = isLike
    setLiked(temp)
    const data = {
      id,
      liked: isLike
    }
    dispatch(likeItem(data))
  }

  const _onBookmarkItem = () => {
    const data = {
      id: item.id,
      bookmarked: !bookmarked
    }
    dispatch(bookmarkItem(data))
    setBookmarked(!bookmarked)
  }

  const _showLikeList = (value) => {
    setVisible(value)
  }

  const _onChangeVisible = () => {
    setVisible(!isVisible)
  }

  const _onViewMore = () => {
    setViewMore(!isViewMore)
  }

  return {
    _onViewMore,
    _onGetAddress,
    _onLikeItem,
    _onChangeVisible,
    _onBookmarkItem,
    bookmarked,
    isViewMore,
    isVisible,
    categoryName,
    liked,
    url,
    address
  }
}

export {
  useProductDetailFacade
}