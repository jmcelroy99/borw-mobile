import { useState, useEffect } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import { Alert, Platform, ActionSheetIOS } from 'react-native';

const useImageListFacade = (_onDeleteImage, t) => {
  const [image, setImage] = useState();
  const [firstImage, setFirstImage] = useState()
  const [selected, setSelected] = useState(null);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [isVisible, setVisible] = useState(false);

  const _onPickImage = () => {
    if (Platform.OS == 'android') {
      Alert.alert(
        t('common:text_select_image'),
        '',
        [
          {
            text: t('common:text_cancel'),
            style: 'cancel'
          },
          {
            text: t('common:text_select_from_library'),
            onPress: () => {
              _onPickFromGallery()
            }
          },
          {
            text: t('common:text_select_from_camera'),
            onPress: () => {
              _onPickFromCamera()
            }
          },
        ],
        { cancelable: true }
      );
    } else {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [t('common:text_cancel'), t('common:text_take_photo'), t('common:text_select_from_library')],
          cancelButtonIndex: 0
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            // cancel action
          } else if (buttonIndex === 1) {
            _onPickFromCamera()
          } else if (buttonIndex === 2) {
            _onPickFromGallery()
          }
        }
      );
    }
  }

  const _onPickFromCamera = () => {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
      _onImagePicked(image)
    });
  }

  const _onPickFromGallery = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      compressImageQuality: 0.7
    }).then(image => {
      _onImagePicked(image)
    });
  }

  const _onImagePicked = image => {
    let fileName = image.path;
    if (fileName) {
      const path = fileName.split("/")
      if (path.length > 0) {
        fileName = path[path.length - 1]
      } else {
        fileName = moment().format('YYYY-MM-DD-HH-mm-ss')
      }
    }
    const photo = {
      uri: image.path,
      name: fileName,
      type: image.mime
    }

    setImage(photo);
  }

  const _onConfirmDelete = () => {
    Alert.alert(
      t('shop:text_confirm_delete_image'),
      '',
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            setVisible(!isVisible)
            _onDeleteImage(selected.length > 0 && selected[0])
            selected.splice(0, 1)
          }
        }
      ],
      { cancelable: false }
    );
  }

  const _onChangeVisible = url => {
    if (selected !== null) {
      const list = [...selected];
      if (!url) {
        setSelected([])
      } else {
        list.push(url)
        setSelected(list)
      }
    } else {
      const list = []
      list.push(url)
      setSelected(list)
    }
  }

  useEffect(() => {
    selected !== null && setVisible(!isVisible)
  }, [selected])

  const _onHandleDelete = () => {
    _onConfirmDelete()
  }

  const _onShowFullScreen = (value) => {
    setShowFullScreen(value)
  }

  const _onSetFirstImage = index => {
    setFirstImage(index)
  }

  return {
    image,
    isVisible,
    showFullScreen,
    firstImage,
    _onSetFirstImage,
    _onShowFullScreen,
    _onPickImage,
    _onChangeVisible,
    _onHandleDelete,
  }
}

export {
  useImageListFacade
}