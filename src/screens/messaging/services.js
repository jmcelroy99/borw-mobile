import firestore from '@react-native-firebase/firestore';
import request2 from 'src/utils/fetch2';
import globalConfig from 'src/utils/global';

/**
 * API create room
 * @param data
 * @returns {Promise<unknown>}
 */
export const createRoom = async (data) => {
  await firestore()
    .collection('ListRoom')
    .doc(data.roomName)
    .set({
      createdAt: new Date(),
      participants: data.participants
    });
  await firestore()
    .collection('ListRoom')
    .doc(data.roomName)
    .collection('Messages')
    .add({
      createdAt: new Date(),
    })
  return true
}

/**
 * API check room
 * @param data
 * @returns {Promise<unknown>}
 */
export const checkRoom = async (data) => {
  return await firestore()
    .collection('ListRoom')
    .doc(data)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot._exists) {
        return documentSnapshot
      }
    });
}

/**
 * API add room to list
 * @param data
 * @returns {Promise<unknown>}
 */
export const addRoom = async (data) => {
  await firestore()
    .collection('UserList')
    .doc(data.sender.toString())
    .collection('conversations')
    .doc(data.roomName)
    .set({
      lastMessage: '',
      _id: data.roomName,
      createdAt: new Date(),
      updatedAt: new Date(),
      participants: data.participants
    });
  await firestore()
    .collection('UserList')
    .doc(data.receiver.toString())
    .collection('conversations')
    .doc(data.roomName)
    .set({
      lastMessage: '',
      _id: data.roomName,
      createdAt: new Date(),
      updatedAt: new Date(),
      participants: data.participants
    });
  return true
}

/**
 * API update last message
 * @param data
 * @returns {Promise<unknown>}
 */
export const updateLastMessage = async (data) => {
  firestore()
    .collection('UserList')
    .doc(data.sender._uid.toString())
    .collection('conversations')
    .doc(data.roomName)
    .update({
      lastMessage: {
        content: data.content,
        senderId: data.messageOwner ? data.messageOwner : data.sender._id,
        senderUID: data.sender._uid
      },
      updatedAt: new Date(),
    });
  if (data.receiver) {
    firestore()
      .collection('UserList')
      .doc(data.receiver.toString())
      .collection('conversations')
      .doc(data.roomName)
      .update({
        lastMessage: {
          content: data.content,
          senderId: data.sender._id,
          senderUID: data.sender._uid
        },
        unread: 'true',
        updatedAt: new Date(),
      });
  }
  return true
}

/**
 * API delete message
 * @param data
 * @returns {Promise<unknown>}
 */
export const deleteMessage = async (data) => {
  data.deletedMessagesId.forEach(id => {
    firestore()
      .collection('ListRoom')
      .doc(data.roomName)
      .collection('Messages')
      .doc(id)
      .update({
        isDeletedFor: firestore.FieldValue.arrayUnion(data.senderId)
      })
  });
  return true
}

/**
 * API mute room
 * @param data
 * @returns {Promise<unknown>}
 */
export const muteRoom = async (data) => {
  if (data.unMute) {
    firestore()
      .collection('UserList')
      .doc(data.senderUID)
      .collection('conversations')
      .doc(data.roomName)
      .update({
        isMutedBy: []
      })

    firestore()
      .collection('UserList')
      .doc(data.receiverId)
      .collection('conversations')
      .doc(data.roomName)
      .update({
        isMutedBy: []
      })

    firestore()
      .collection('ListRoom')
      .doc(data.roomName)
      .update({
        isMutedBy: []
      })
      .then(() => { return true })

  } else {
    firestore()
      .collection('UserList')
      .doc(data.senderUID)
      .collection('conversations')
      .doc(data.roomName)
      .update({
        isMutedBy: firestore.FieldValue.arrayUnion(data.senderId)
      })

    firestore()
      .collection('UserList')
      .doc(data.receiverId)
      .collection('conversations')
      .doc(data.roomName)
      .update({
        isMutedBy: firestore.FieldValue.arrayUnion(data.senderId)
      })

    firestore()
      .collection('ListRoom')
      .doc(data.roomName)
      .update({
        isMutedBy: firestore.FieldValue.arrayUnion(data.senderId)
      })
      .then(() => {
        return true
      })
  }
}

/**
 * API check room
 * @param data
 * @returns {Promise<unknown>}
 */
export const checkUser = async (data) => {
  return await firestore()
    .collection('UserList')
    .doc(data.toString())
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        return documentSnapshot
      }
    });
}

/**
 * API get rooms
 * @param data
 * @returns {Promise<unknown>}
 */
export const getListRooms = async (data) => {
  try {
    return await firestore()
      .collection('UserList')
      .doc(data.toString())
      .collection('conversations')
      .orderBy('updatedAt')
      .get()
      .then(documentSnapshot => {
        return documentSnapshot.docs
      });
  } catch (e) {
    console.log(e);
    return [];
  }
}

/**
 * API create user
 * @param data
 * @returns {Promise<unknown>}
 */
export const createUser = async (data) => {
  return await firestore()
    .collection('UserList')
    .doc(data.toString())
    .set({
      createdAt: new Date()
    })
    .then(() => {
      firestore()
        .collection('UserList')
        .doc(data.toString())
        .collection('ListRoom')
        .add({
          createdAt: new Date()
        })
        .then(() => {
          return true
        })
    })
}

/**
 * API send message
 * @param data
 * @param receiverId
 * @returns {Promise<unknown>}
 */
export const sendMessage = async (data) => {
  let sender = globalConfig.getUser();
  let senderName = `${sender.firstName} ${sender.lastName}`;
  switch (data.type) {
    case 'product':
      return await firestore()
        .collection('ListRoom')
        .doc(data.roomName)
        .collection('Messages')
        .doc(data._id)
        .set({
          _id: data._id,
          productId: data.productId,
          name: data.name,
          insurance: data.insurance,
          pref: data.pref,
          currency: data.currency,
          rentalPrice: data.rentalPrice,
          type: 'product',
          transaction: data.transaction,
          createdAt: data.createdAt,
          user: data.user,
          photo: data.photo
        })
        .then(() => {
          return true
        });
    case 'text':
      return await firestore()
        .collection('ListRoom')
        .doc(data.roomName)
        .collection('Messages')
        .doc(data._id)
        .set({
          _id: data._id,
          text: data.text,
          createdAt: data.createdAt,
          user: data.user,
          type: 'text',
        })
        .then(() => {
          sendPushNotification(data.receiverUserId, senderName, data.text, data.roomName);
          return true
        });
    default:
      break;
  }
}

/**
 * API send push notification
 * @param 
 * @returns {Promise<unknown>}
 */
export const sendPushNotification = async (userId, title, message, roomId, productId = null, orderId = null, type = "chat",) => {
  return await request2.post(`/api/v1/notifications`, {
    userId, title, message, type, roomId, orderId, productId 
  });
}

/**
 * API get user info
 * @param data
 * @returns {Promise<unknown>}
 */
export const getUserInfo = async (data) => {
  return await request2.getUserInfo(`/api/v1/users/${data.userId}`);
}

/**
 * API update notification message
 * @param data
 * @returns {Promise<unknown>}
 */
export const updateMessageNotification = async (data) => {
  firestore()
    .collection('UserList')
    .doc(data.userUID)
    .set({
      newMessage: data.update,
      avatar: data.avatar,
      firstName: data.firstName,
      lastName: data.lastName
    });
  return true
}

