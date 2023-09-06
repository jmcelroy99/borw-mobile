import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useImageListFacade } from './hooks';
import { margin } from 'src/components/config/spacing';
import { isVideo } from 'src/utils/func';
import { Icon } from 'src/components/icons/Icon';
import * as colors from 'src/components/config/colors';

const W = Dimensions.get('screen').width
const H = Dimensions.get('screen').height

const getMediaUri = (item) => {
  const uri = item && item !== '' ? item.uri ? item.uri : item :
      'https://s3.eu-central-1.amazonaws.com/storage.propmap.io/staging/uploads/user/avatar/25/user_account_profile_avatar_person_student_male-512.jpg';
  return uri;
}
export default function ImageFullScreen({ listImages, _onShowFullScreen, firstImage }) {
  const { activeSlide, firstItem, mute, _onUpdateActiveSlide, _onMute } = useImageListFacade(firstImage);
  
  _renderItem = ({ item, index }) => {
    const uri = getMediaUri(item);
    
    return (
      <View style={styles.containerImage}>
        {!isVideo(uri) ? <FastImage
          style={styles.image}
          source={{
            uri: uri,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        /> : 
          <View>
            <Video source={{uri: uri}} style={styles.image} muted={mute} repeat={true} paused={index != activeSlide} resizeMode="contain"/>
          </View>
        }

      </View>
    );
  }

  _renderPagination = () => {
    return (
      <Pagination
        dotsLength={listImages.length}
        activeDotIndex={activeSlide}
        containerStyle={{ backgroundColor: 'transparent' }}
        dotStyle={{
          width: 12,
          height: 12,
          borderRadius: 6,
          marginHorizontal: 0,
          backgroundColor: 'rgba(255,255,255,1)'
        }}
        inactiveDotStyle={{
          // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  return (
    <View>
      <Modal deviceHeight={H} isVisible={true}
         onBackButtonPress={() => {_onShowFullScreen(false)}} /*onBackdropPress={() => _onShowFullScreen(false)}*/>
        <View style={styles.closerapper}>              
          <Icon
            name="close-outline"
            type="ionicon"
            color="white"
            size={30}
            onPress = {() => {_onShowFullScreen(false)}}
          />
        </View>
        {listImages && isVideo(getMediaUri(listImages[activeSlide])) &&
         <View style={styles.iconWrapper}>
          <Icon
            name={mute ? "volume-mute-outline" : "volume-high-outline"}
            type="ionicon"
            color="white"
            size={23}
            onPress = {_onMute}
          />
          </View>}
        <View style={styles.containerContent}>
          <Carousel
            ref={(c) => { if(this) this._carousel = c; }}
            firstItem={firstItem}
            data={listImages}
            renderItem={_renderItem}
            sliderWidth={W}
            itemWidth={W - 32}
            onSnapToItem={(index) => _onUpdateActiveSlide(index)}
          />
          {_renderPagination()}
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  containerContent: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerImage: {
    width: W,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  image: {
    width: W - margin.big,
    height: "95%",
    borderRadius: 16,
  },
  iconWrapper: {
    zIndex: 10000,
    position: "absolute",
    top: 18,
    right: margin.big * 1.5 
  },
  closerapper: {
    zIndex: 10000,
    position: "absolute",
    top: 15,
    right: 0
  }
})

