import Carousel, { Pagination } from 'react-native-snap-carousel';
import React from 'react';
import { StyleSheet, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import {useImageListFacade} from './hooks';
import { isVideo } from 'src/utils/func';
import { Icon } from 'src/components/icons/Icon';

const W = Dimensions.get('screen').width

export default function ListImages({ data, _onChangeFirstImage, stop }) {
  const { activeSlide, _onUpdateActiveSlide } = useImageListFacade();
  const numberOfDots = data.length
  let _carousel = null;

  _renderItem = ({ item, index }) => {
    return (
      <View>
        <TouchableOpacity onPress={() => { _onChangeFirstImage(index);}}>
          {!stop && <View style={styles.indicator}>
            <Icon
                name="open-outline"
                type="ionicon"
                color="white"
                size={23}
              />
          </View>
          }
          {
            !isVideo(item) ?
          <Image
            style={styles.image}
            source={{
              uri: item && item !== '' ? item : '',
            }}
            resizeMode='cover'
          /> :
          <Video
            source={{uri: item}}
            style={styles.image}
            resizeMode="cover"
            repeat={true}
            muted={true}
            paused={stop || index != activeSlide}
            />
          }
        </TouchableOpacity>
      </View>
    );
  }

  _renderPagination = () => {

    return (
      <Pagination
        dotsLength={numberOfDots}
        activeDotIndex={activeSlide}
        containerStyle={[styles.pagination, {start: W / 2 - (numberOfDots * 22),}]}
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
      <Carousel
        ref={(c) => { _carousel = c; }}
        data={data}
        renderItem={_renderItem}
        sliderWidth={W}
        itemWidth={W}
        onSnapToItem={(index) => _onUpdateActiveSlide(index) }
      />
      {_renderPagination()}
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    width: W,
    height: W,
  },
  image: {
    width: W,
    height: W,
  },
  slide: {
    width: Dimensions.get('screen').width,
    height: 200,
  },
  pagination: { 
    position: 'absolute',
    top: W - 60,
    backgroundColor: 'transparent' 
  },
  indicator: {
    zIndex: 999,
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent' 
  }
})