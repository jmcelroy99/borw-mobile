import { useDispatch, useSelector } from 'react-redux';
import { getRooms, getUserInfo, updateMessageNotification } from './actions';
import { useEffect, useState } from 'react';

const useMessagingFacade = () => {
  const user = useSelector(state => state.auth)
  const currentUser = user.toJS().user
  //console.log("Firebase", currentUser) //bug
  const dispatch = useDispatch();
  const [actualList, setActualList] = useState()
  const { listRooms, loadingGetRooms, userInfo } = useSelector(state => state.messaging)

  useEffect(() => {
    dispatch(getRooms(currentUser.firebaseUID))
  }, [])

  useEffect(() => {
    if (listRooms) {
      const rooms = [...listRooms].filter(room => room._data.lastMessage && room._data.lastMessage.content != '')
      setActualList(rooms)
      rooms.forEach(element => {
        const participant = element._data.participants.filter(participant => participant.id && participant.id != currentUser.id)
        if (participant && participant[0]) {
          participant[0].id && _onGetUserInfo(participant[0].id)
        }
      });
    }
  }, [listRooms])

  useEffect(() => {
    if (actualList) {
      let update = false
      actualList.forEach(element => {
        if (element._data.unread != 0) {
          update = true
        }
      });
      if (!update) {
        // Call API update new message field
        const data = {
          userUID: currentUser.firebaseUID,
          update: false,
          avatar: currentUser.avatar,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName
        }
        dispatch(updateMessageNotification(data))
      }
    }
  }, [actualList])

  useEffect(() => {
    if (userInfo && actualList) {
      const userId = userInfo.id
      const listRooms = [...actualList]
      const rooms = listRooms.filter(room => room._data._id.includes(userId))
      rooms.forEach(room => {
        const participant = room._data.participants.filter(user => user.id == userId)
        if (participant[0].avatar && participant[0].avatar.localeCompare(userInfo.avatar) != 0) {
          participant[0].avatar = userInfo.avatar
          participant[0].name = userInfo.firstName + ' ' + userInfo.lastName
          participant[0].id = userId
          participant[0].uid = userInfo.firebaseUID
        }
      });
      setActualList(listRooms)
    }
  }, [userInfo])

  _onGetUserInfo = id => {
    const data = {
      userId: id
    }
    dispatch(getUserInfo(data))
  }

  return {
    listRooms,
    loadingGetRooms,
    user,
    currentUser,
    actualList,
    _onGetUserInfo
  }
}

export {
  useMessagingFacade
}