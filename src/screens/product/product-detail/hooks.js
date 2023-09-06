import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendComment, getComments } from './actions';
import { getLikesList, getProductDetail, deleteComment } from './actions';
import { Alert } from "react-native";
import { getCategoryName } from 'src/utils/category';
import { mainStack } from 'src/config/navigator';

const useProductDetailFacade = (navigation, t) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth)
  const [currentUser,] = useState(user.toJS().user)
  const productId = navigation.getParam('productId')
  const addedToCart = navigation.getParam('addedToCart')
  const viewComments = navigation.getParam('viewComments')
  let { likesList, comments, sendSuccess, cart,
    deleteSuccess, product, loading } = useSelector(state => state.productDetail)
  const [shouldShowComments, setShowComments] = useState(false)
  const [productDetail, setProduct] = useState()
  const [commentList, setCommentList] = useState([])
  const { data } = useSelector(state => state.category)
  const [showFullScreen, setFullScreen] = useState(false);
  const [firstImage, setFirstImage] = useState(0);

  useEffect(() => {
    sendSuccess = null;
    deleteSuccess = null;
  }, [])

  useEffect(() => {
    if (productId) {
      dispatch(getProductDetail(productId))
      dispatch(getComments(productId))
      dispatch(getLikesList(productId))
    }
  }, [productId])

  useEffect(() => {
    setShowComments(viewComments)
  }, [viewComments])

  useEffect(() => {
    if (sendSuccess) {
      dispatch(getComments(product.id))
    }
  }, [sendSuccess])

  useEffect(() => {
    if (comments) {
      setCommentList(comments)
    } else setCommentList([])
  }, [comments])

  useEffect(() => {
    if (deleteSuccess) {
      dispatch(getComments(product.id))
    }
  }, [deleteSuccess])

  useEffect(() => {
    if (cart && productDetail) {
      const item = cart.findIndex(item => item.id == productDetail.id)
      const newProduct = { ...product }
      newProduct.added = !(item == -1)
      setProduct(newProduct)
    }
  }, [cart])

  useEffect(() => {
    if (addedToCart && productDetail) {
      const newProduct = { ...product }
      newProduct.added = true
      setProduct(newProduct)
    }
  }, [addedToCart])

  useEffect(() => {
    if (product) {
      const newProduct = { ...product }
      newProduct.categoryName = getCategoryName(product.categoryId, data)
      if (cart && cart.length > 0) {
        const index = cart.findIndex(item => item.id == product.id)
        if (index != -1) {
          newProduct.added = true
        }
      }
      setProduct(newProduct)
    }else {
      setProduct(null)
    }
  }, [product])

  const _onVerifyUser = () => {
      return true
  }

  const _onAlertEmail = () => {
    Alert.alert(
      t('notifications:text_complete_your_profile_title'),
      t('notifications:text_complete_your_profile_desc') + `\n` + t('notifications:text_verify_email'),
      [
        {
          text: t('notifications:text_edit_profile'),
          onPress: () => {
            navigation.navigate(mainStack.edit_profile)
          },
        },
      ],
      { cancelable: true }
    );
  }

  const _onAlertAddress = () => {
    Alert.alert(
      t('notifications:text_complete_your_profile_title'),
      t('notifications:text_complete_your_profile_desc') + `\n` + t('notifications:text_add_address'),
      [
        {
          text: t('notifications:text_edit_profile'),
          onPress: () => {
            navigation.navigate(mainStack.edit_profile)
          },
        },
      ],
      { cancelable: true }
    );
  }

  const _onAlertEmailAddress = () => {
    Alert.alert(
      t('notifications:text_complete_your_profile_title'),
      t('notifications:text_complete_your_profile_desc') + `\n` + t('notifications:text_verify_email') + `\n` + t('notifications:text_add_address'),
      [
        {
          text: t('notifications:text_edit_profile'),
          onPress: () => {
            navigation.navigate(mainStack.edit_profile)
          },
        },
      ],
      { cancelable: true }
    );
  }

  const _onSendComment = (comment, productId) => {
    const data = {
      content: comment,
      productId
    }
    dispatch(sendComment(data))
  }

  const _onWarningOwner = () => {
    Alert.alert(
      t('product:text_warning_owner'),
      '',
      [
        {
          text: t('actions:text_yes'),
          style: 'cancel'
        },
      ],
      { cancelable: true }
    );
  }

  const _onDeleteComment = (id, productId) => {
    Alert.alert(
      t('product:text_delete_comment_confirm'),
      '',
      [
        {
          text: t('actions:text_no'),
          style: 'cancel'
        },
        {
          text: t('actions:text_yes'),
          onPress: () => {
            const data = {
              id,
              productId
            }
            dispatch(deleteComment(data))
          }
        }
      ],
      { cancelable: true }
    );
  }

  const _onNavigateMessage = () => {
    navigation.navigate(mainStack.conversation, {
      product: product
    })
  }

  const _onShowFullScreen = (value) => {
    setFullScreen(value);
  }

  const _onChangeFirstImage = (value) => {
    setFirstImage(value);
  }

  return {
    productDetail,
    commentList,
    likesList,
    loading,
    currentUser,
    data,
    shouldShowComments,
    showFullScreen,
    firstImage,
    _onNavigateMessage,
    _onWarningOwner,
    _onDeleteComment,
    _onSendComment,
    _onVerifyUser,
    _onShowFullScreen,
    _onChangeFirstImage
  }
}

export {
  useProductDetailFacade
}