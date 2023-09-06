import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Text, Icon, Modal, ImageFullScreen } from 'src/components';
import { margin } from 'src/components/config/spacing';
import React, { useEffect } from 'react';
import { border_color, darkColors } from 'src/components/config/colors';
import { useImageListFacade } from './hooks';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import Button from 'src/containers/Button';
import * as colors from "src/components/config/colors";
import { isVideo } from 'src/utils/func';

const W = Dimensions.get('screen').width - margin.big
const H = Dimensions.get('screen').height
export default function ImageList({ images, t, _onImagePicked, error, _onDeleteImage, shouldEnable }) {
  const { image, isVisible, showFullScreen, firstImage, isVisiblePickModal, _onSetFirstImage,
    _onChangeVisible, _onPickImage, _onHandleDelete, _onShowFullScreen, _onClosePickerModel } = useImageListFacade(_onDeleteImage, t);
  const maxLength = 8

  useEffect(() => {
    if (image) {
      _onImagePicked(image)
    }
  }, [image])
  
  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        {images.map((item, index) => (
          <TouchableOpacity onPress={() => { _onSetFirstImage(index); _onChangeVisible(item) }}>
            {!isVideo(item.uri) ? <FastImage
              style={styles.image}
              source={item.uri ? {
                uri: item.uri, priority:
                  FastImage.priority.normal
              } : item ? {
                uri: item,
                priority: FastImage.priority.normal
              } : images.person}
              resizeMode={FastImage.resizeMode.cover}
            /> : <Video source={{uri: item.uri}} style={styles.image} resizeMode="cover" repeat={true} muted={true}/>}
          </TouchableOpacity>
        ))}
        {images.length < maxLength && shouldEnable &&
          <TouchableOpacity style={styles.addImage} 
            onPress={() => _onPickImage()}>
            <Icon name='camera-retro' type='font-awesome' size={24} color={colors.white} />
            <Text h6 h6Style={styles.textAddImage}>{t('shop:text_add_photo_video')}</Text>
          </TouchableOpacity>}
      </View>
      {error && <Text style={styles.textError}>{error}</Text>}

      <Modal
        visible={isVisible}
        topLeftElement={() => { return null }}
        headerStyle={{ marginStart: margin.small }}
        setModalVisible={() => _onChangeVisible()}
        ratioHeight={Platform.OS === 'ios' && H >= 812 ? 0.25 : 0.3}>
        <View style={{ justifyContent: 'space-evenly', flex: 1 }}>
          {shouldEnable && <Button
            title={t('shop:text_delete_image')}
            onPress={() => _onHandleDelete()}
            containerStyle={styles.button}
          />}
          <Button
            title={t('shop:text_view_image')}
            onPress={() => {
              _onChangeVisible();
              setTimeout(() => {
                _onShowFullScreen(true)
              }, 400);
            }}
            containerStyle={[styles.button]}
          />
          <Button
            title={t('common:text_cancel')}
            onPress={() => {
              _onChangeVisible();
            }}
            containerStyle={[styles.button, { marginBottom: margin.big }]}
          />
        </View>
      </Modal>
      <Modal
        backgroundColor={colors.gray_modal}
        visible={isVisiblePickModal}
        centerElement={(<Text style={{ textAlign: 'center', marginStart: margin.big * 1.4 }} h3 colorSecondary medium>{t('common:text_select_video_image')}</Text>)}
        headerStyle={{ marginStart: margin.small }}
        setModalVisible={_onClosePickerModel}
        ratioHeight={Platform.OS === 'ios' && H >= 812 ? 0.35 : 0.4}>
        <View style={{ justifyContent: 'space-evenly', flex: 0.95, }}>
          <Button
            buttonStyle={{ backgroundColor: colors.selIcon }}
            titleStyle={{ color: colors.black }}
            title={t('common:text_select_from_library')}
            onPress={() => _onClosePickerModel(1)}
            containerStyle={styles.buttonModal} />
          <Button
            buttonStyle={{ backgroundColor: colors.selIcon }}
            titleStyle={{ color: colors.black }}
            title={t('common:text_select_from_camera')}
            onPress={() => _onClosePickerModel(2)}
            containerStyle={styles.buttonModal} />
          <Button
            buttonStyle={{ backgroundColor: colors.selIcon }}
            titleStyle={{ color: colors.black }}
            title={t('common:text_select_video_from_library')}
            onPress={() => _onClosePickerModel(3)}
            containerStyle={styles.buttonModal} />
          <Button
            buttonStyle={{ backgroundColor: colors.selIcon }}
            titleStyle={{ color: colors.black }}
            title={t('common:text_select_video_from_camera')}
            onPress={() => _onClosePickerModel(4)}
            containerStyle={styles.buttonModal} />
        </View>
      </Modal>
      {showFullScreen && <ImageFullScreen firstImage={firstImage}
        listImages={images} _onShowFullScreen={value => _onShowFullScreen(value)} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: margin.base,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  containerImage: {
    marginBottom: margin.base,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  viewImage: {
    marginTop: margin.small,
    marginHorizontal: 1,
    overflow: 'hidden',
  },
  modal: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  button: {
    backgroundColor: colors.border_color,
    marginVertical: margin.tiny,
    marginHorizontal: margin.base
  },
  image: {
    width: (W - 16) / 4,
    height: 90,
    borderRadius: margin.base,
    marginTop: margin.small,
    marginEnd: 4,
  },
  textAddImage: {
    marginTop: margin.small,
    color: colors.white,
    textAlign: 'center'
  },
  textError: {
    fontSize: 10,
    lineHeight: 15,
    color: darkColors.colors.error
  },
  addImage: {
    width: (W - 8) / 4,
    height: 90,
    borderWidth: 1,
    borderRadius: margin.base,
    borderColor: border_color,
    marginTop: margin.small,
    marginHorizontal: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray_icon_ban
  },
  bottomSheet: {
    width: 300,
    height: 500,
  }
})