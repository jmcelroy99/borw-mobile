import { useState } from 'react';
import { Alert, Platform, ActionSheetIOS } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import * as VideoPicker from 'react-native-image-picker';
import { ProcessingManager } from 'react-native-video-processing';

if (Platform.OS === 'android') {
  var RNGRP = require('react-native-get-real-path');
}
const MAX_VIDEO_DURATION = 15;

const useImageListFacade = (_onDeleteImage, t) => {
  const [image, setImage] = useState();
  const [firstImage, setFirstImage] = useState(0)
  const [selected, setSelected] = useState([]);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const [isVisiblePickModal, setImageVideoPicker] = useState(false);

  const _onPickImage = () => {
    setImageVideoPicker(true);    
  }

  const _onPickFromCamera = () => {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
      _onImagePicked(image)
      setImageVideoPicker(!isVisiblePickModal)
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
      setImageVideoPicker(!isVisiblePickModal)
    });
  }

  const _onPickVideoFromCamera = () => {
    ImagePicker.openCamera({
      mediaType: 'video',
    }).then(async (image) => {
      try {
        const options = {
            startTime: 0,
            endTime: MAX_VIDEO_DURATION,
        };
        let filePath = image.path;
        if (image.duration > MAX_VIDEO_DURATION) {
          if (Platform.OS === 'android') {
            filePath = await RNGRP.getRealPathFromURI(filePath)
          }
          filePath = await ProcessingManager.trim(filePath, options)
        }
        _onVideoPicked({
            fileName: image.filename,
            uri: filePath,
            type: ""
        });
        setImageVideoPicker(!isVisiblePickModal)
      } catch (e) {
        console.log("Video record error", e);
      }
    });
  }

  const _onPickVideoFromGallery = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
    }).then(async image => {
      try {
        const options = {
            startTime: 0,
            endTime: MAX_VIDEO_DURATION,
        };
        let filePath = image.path;
        if (image.duration > MAX_VIDEO_DURATION) {
          if (Platform.OS === 'android') {
            filePath = await RNGRP.getRealPathFromURI(filePath)
          }
          filePath = await ProcessingManager.trim(filePath, options)
        }
        _onVideoPicked({
            fileName: image.filename,
            uri: filePath,
            type: ""
        });
        setImageVideoPicker(!isVisiblePickModal)
      } catch (e) {
        console.log("Video upload error", e);
      }
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

  const _onVideoPicked = video => {
    let fileName = video.fileName;
    if (fileName) {
      const path = fileName.split("/")
      if (path.length > 0) {
        fileName = path[path.length - 1]
      } else {
        fileName = moment().format('YYYY-MM-DD-HH-mm-ss')
      }
    }
    const photo = {
      uri: video.uri,
      name: fileName,
      type: video.type
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
          text: "Yes", onPress: () => {
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
    const list = [...selected];
    if (!url) {
      setSelected([])
    } else {
      list.push(url)
      setSelected(list)
    }
    setVisible(!isVisible)
  }

  const _onHandleDelete = () => {
    _onConfirmDelete()
  }

  const _onShowFullScreen = (value) => {
    setShowFullScreen(value)
  }

  const _onSetFirstImage = index => {
    index && setFirstImage(index)
  }

  const _onClosePickerModel = (buttonIndex) => {
    switch(buttonIndex) {
      case 1:
        _onPickFromGallery()
        break;
      case 2:
        _onPickFromCamera()
        break;
      case 3:
        _onPickVideoFromGallery()
        break;
      case 4:
        _onPickVideoFromCamera()
        break;
      default:
        setImageVideoPicker(!isVisiblePickModal)
        break;
    }
  }

  return {
    image,
    isVisible,
    showFullScreen,
    firstImage,
    isVisiblePickModal,
    _onSetFirstImage,
    _onShowFullScreen,
    _onPickImage,
    _onChangeVisible,
    _onHandleDelete,
    _onClosePickerModel,
  }
}

export {
  useImageListFacade
}