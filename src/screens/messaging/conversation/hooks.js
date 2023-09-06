import { useState, useEffect } from 'react';
import { getCurrencyDisplay } from 'src/utils/string';
import global from 'src/utils/global';
import * as formula from 'src/utils/formulas';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkRoom, sendMessage, listenMessage, checkMuted,
  updateUnread, getRooms, deleteMessage, muteRoom, updateLastMessage,
} from '../actions';
import uuid from 'react-native-uuid';
import { Alert } from "react-native";
import { AVATAR_DEFAULT } from 'src/modules/common/constants';

const useConversationFacade = (navigation, t) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth)
  const currentUser = user.toJS().user
  const partner = navigation.getParam('partner')
  let product = navigation.getParam('product')
  let room = navigation.getParam('roomName')
  let { isExist } = useSelector(state => state.messaging)
  const { messages, loading, mutedBy } = useSelector(state => state.messaging)
  const [item,] = useState(product)
  const [roomName, setRoomName] = useState(room)
  const [isShowOptions, setShowOptions] = useState(false)
  const [shouldEnableCheckbox, setShowCheckBox] = useState(false)
  const [shouldAppend, setAppend] = useState(false)
  const [lastMessage, setLastMessage] = useState()
  const [isMutedBy, setMutedBy] = useState()
  const [checkedMessages, setChecked] = useState([])
  const [receiver, setReceiver] = useState('')
  const [sender,] = useState({ _id: currentUser.id, avatar: AVATAR_DEFAULT, _uid: currentUser.firebaseUID })
  const [listMessages, setListMessages] = useState(null)

  useEffect(() => {
    if (item) {
      const itemOwner = item.owner
      const partner = {
        id: itemOwner.id,
        uid: itemOwner.firebaseUID,
        name: itemOwner.firstName + ' ' + itemOwner.lastName,
        avatar: itemOwner.avatar
      }
      setReceiver(partner)
    }
  }, [item])

  useEffect(() => {
    if (messages) {
      const newMessages = messages.filter(item => !item.isDeletedFor || !(item.isDeletedFor.find(id => id == currentUser.id)))
      setListMessages(newMessages)
      if (newMessages.length > 0) {
        dispatch(updateUnread({
          roomName: roomName,
          _id: sender._uid,
        }))
        if (lastMessage) {
          const data = {
            roomName: roomName,
            sender: sender,
            content: lastMessage.text,
            messageOwner: lastMessage.user._id,
          }
          dispatch(updateLastMessage(data))
          setLastMessage(false)
        }
      }
    }
  }, [messages])

  useEffect(() => {
    if (mutedBy && mutedBy.length == 0) {
      setMutedBy(null)
      dispatch(listenMessage(roomName))
    } else if (mutedBy && mutedBy.length > 0) {
      setMutedBy(mutedBy[0])
    }
  }, [mutedBy])

  useEffect(() => {
    if (!roomName) {
      const roomId = generateRoomName()
      setRoomName(roomId)
      global.setRoomId(roomId)

      let receiver;
      if (product) {
        const productOwner = product.owner
        receiver = {
          id: productOwner.id,
          uid: productOwner.firebaseUID,
          name: productOwner.firstName + ' ' + productOwner.lastName,
          avatar: productOwner.avatar ? productOwner.avatar : AVATAR_DEFAULT
        }
      } else {
        receiver = {
          id: partner.id,
          uid: partner.uid,
          name: partner.name,
          avatar: partner.avatar ? partner.avatar : AVATAR_DEFAULT
        }
      }
      const sender = {
        id: currentUser.id,
        uid: currentUser.firebaseUID,
        name: currentUser.firstName + ' ' + currentUser.lastName,
        avatar: currentUser.avatar ? currentUser.avatar : AVATAR_DEFAULT
      }
      const participants = [receiver, sender]
      setAppend(product)
      const data = {
        roomName: roomId,
        senderId: currentUser.id,
        senderUID: currentUser.firebaseUID,
        receiverUID: product ? product.owner.firebaseUID : partner.uid,
        receiverId: product ? product.owner.id : partner.id,
        participants: participants
      }
      dispatch(checkRoom(data))
    } else {
      global.setRoomId(roomName)
      isExist = true
    }
  }, [])

  useEffect(() => {
    if (isExist) {
      dispatch(checkMuted(roomName ? roomName : generateRoomName()))
    }
  }, [isExist])

  const generateRoomName = () => {
    if (item) {
      if (sender._id < item.owner.id) {
        return sender._id + '|' + item.owner.id
      } else {
        return item.owner.id + '|' + sender._id
      }
    } else if (partner) {
      if (sender._id < partner.id) {
        return sender._id + '|' + partner.id
      } else {
        return partner.id + '|' + sender._id
      }
    }
  }

  const price = () => {
    if (product.isRent) {
      return formula.getFinalPrice(product.rentalPrice)
    } else if (product.isBuyOut) {
      return formula.getFinalPriceForBuyOut(product.price)
    }
  }

  const transaction = () => {
    if (product.isDonation) {
      return 'donation'
    } else if (product.isRent) {
      return 'rent'
    } else if (product.isBuyOut) {
      return 'buyout'
    }
  }

  const _onSendMessages = newMessages => {
    if (shouldAppend && product) {
      const message = [{
        _id: uuid.v4(),
        productId: product.id,
        name: product.name,
        photo: product.photos[0],
        insurance: product.price,
        pref: product.rentDuration && product.rentDuration.replace('|', ' '),
        currency: getCurrencyDisplay(product.currency),
        rentalPrice: price(),
        type: 'product',
        transaction: transaction(),
        createdAt: new Date(),
        roomName: roomName,
        user: {
          _id: sender._id,
          avatar: sender.avatar,
        },
      }]
      dispatch(sendMessage(message[0]))

      newMessages[0].type = 'text';
      newMessages[0].roomName = roomName;
      newMessages[0].receiverId = receiver.uid;
      newMessages[0].createdAt = new Date()
      newMessages[0].receiverUserId = receiver.id;

      dispatch(sendMessage(newMessages[0]))
      setAppend(false)
    } else {
      newMessages[0].type = 'text';
      newMessages[0].roomName = roomName;
      newMessages[0].receiverId = partner ? partner.uid : receiver.uid;
      newMessages[0].receiverUserId = partner ? partner.id : receiver.id;
      
      dispatch(sendMessage(newMessages[0]))
    }
  }

  const _onBackToMessages = () => {
    dispatch(getRooms(sender._uid))
    global.setRoomId('')
    navigation.goBack();
  }

  const _onShowModal = (value) => {
    typeof value === 'boolean' ? setShowOptions(value) : setShowOptions(!isShowOptions)
  }

  const _onDeleteMessage = () => {
    if (checkedMessages.length > 0) {
      Alert.alert(
        t('messaging:text_delete_messages_title', { count: checkedMessages.length }),
        t('messaging:text_delete_messages_desc'),
        [
          {
            text: t('actions:text_no'),
            style: 'cancel'
          },
          {
            text: t('actions:text_yes'),
            onPress: () => {
              const data = {
                senderId: sender._id,
                deletedMessagesId: checkedMessages,
                roomName: roomName
              }
              dispatch(deleteMessage(data))
              if (checkedMessages.length == listMessages.length) {
                const data = {
                  roomName: roomName,
                  sender: sender,
                  content: '',
                }
                dispatch(updateLastMessage(data))
              } else {
                const tempList = [...listMessages]
                const temp = tempList.filter(message => !checkedMessages.find(deleted => deleted == message._id))
                setLastMessage(temp[0])
              }
              const temp = [...listMessages]
              for (let index = 0; index < checkedMessages.length; index++) {
                const index = temp.findIndex(mess => mess._id == checkedMessages[index])
                if (index != -1) {
                  temp.splice(index, 1);
                }
              }
              setListMessages(temp)
              _onChangeOptions(false)
              setChecked([])
            }
          }
        ],
        { cancelable: true }
      );
    }
  }

  const _onCheckedMessage = id => {
    const index = checkedMessages.findIndex(item => item == id)
    if (index != -1) {
      const checkTemp = [...checkedMessages]
      checkTemp.splice(index, 1)
      setChecked(checkTemp)
    } else {
      const checkTemp = [...checkedMessages, id]
      setChecked(checkTemp)
    }
  }

  const _onChangeOptions = (value) => {
    typeof value === 'boolean' ? setShowCheckBox(value) : setShowCheckBox(!shouldEnableCheckbox)
  }

  const _onChangeMuted = () => {
    if (!isMutedBy) {
      Alert.alert(
        t('messaging:text_mute_user_title'),
        t('messaging:text_mute_user_desc'),
        [
          {
            text: t('actions:text_no'),
            style: 'cancel'
          },
          {
            text: t('actions:text_yes'),
            onPress: () => {
              const data = {
                senderId: sender._id,
                receiverId: partner.uid,
                senderUID: sender._uid,
                roomName: roomName
              }
              dispatch(muteRoom(data))
              _onShowModal(false)
            }
          }
        ],
        { cancelable: true }
      );
    } else {
      const data = {
        senderId: sender._uid,
        receiverId: partner.uid,
        senderUID: sender._uid,
        roomName: roomName,
        unMute: true
      }
      dispatch(muteRoom(data))
      _onShowModal(false)
    }
  }

  return {
    listMessages,
    receiver,
    sender,
    loading,
    isShowOptions,
    partner,
    shouldEnableCheckbox,
    checkedMessages,
    isMutedBy,
    _onChangeMuted,
    _onChangeOptions,
    _onCheckedMessage,
    _onDeleteMessage,
    _onShowModal,
    _onSendMessages,
    _onBackToMessages
  }
}

export {
  useConversationFacade
}