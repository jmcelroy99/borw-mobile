import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Text } from 'src/components';
import { margin, borderRadius } from 'src/components/config/spacing';
import * as colors from 'src/components/config/colors';
import Icon from 'src/components/icons/Icon';
import Button from 'src/containers/Button';
import Modal from 'react-native-modal';
import Input from 'src/containers/input/Input';
import { sizes } from 'src/components/config/fonts';
import FastImage from 'react-native-fast-image';
import { AirbnbRating } from 'react-native-elements';
import { _onGetStar } from 'src/utils/formulas';
import { images, icon } from 'src/utils/images';

export default function RatingModal({ isVisible, _onChangeVisible, _onSubmitRating, t,
  receiverId, isComplete, ratingValue, partnerAvatar, rated }) {
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(5)

  let arrayFullStar = []
  let arrayEmptyStar = []
  if (ratingValue) {
    for (let index = 0; index < _onGetStar(parseFloat(ratingValue)).toFixed(0); index++) {
      arrayFullStar.push(index)
    }
    for (let index = 0; index < 5 - parseInt(_onGetStar(parseFloat(ratingValue)).toFixed(0)); index++) {
      arrayEmptyStar.push(index)
    }
  }

  if (ratingValue) {
    return (
      <View style={styles.container}>
        <Modal isVisible={isVisible}>
          <View style={styles.containerContent}>
            <TouchableOpacity style={styles.close} onPress={() => _onChangeVisible()}>
              <Icon name='close' type='material' size={28} color={colors.selIcon} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Text style={{ flex: 1, textAlign: 'center' }} h3 colorSecondary>{t('actions:text_thank_you_rating')}</Text>
            </View>
            <FastImage
              style={styles.image}
              source={partnerAvatar ? {
                uri: partnerAvatar,
                priority: FastImage.priority.normal
              } : images.person}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={{ flexDirection: 'row' }}>
              {arrayFullStar.map((item, index) => {
                if (index == arrayFullStar.length - 1 && parseFloat(ratingValue) % 1 !== 0) {
                  return (
                    <Image source={icon.halfStar} style={styles.star} resizeMode='contain' />
                  )
                } else {
                  return (
                    <Image source={icon.fullStar} style={styles.star} resizeMode='contain' />
                  )
                }
              })}
              {arrayEmptyStar.map(() => {
                return (
                  <Image source={icon.emptyStar} style={styles.star} resizeMode='contain' />
                )
              })}
            </View>
          </View>
        </Modal>
      </View>
    )
  } else if (!rated) {
    return (
      <View style={styles.container}>
        <Modal isVisible={isVisible}>
          <View style={styles.containerContent}>
            <TouchableOpacity style={styles.close} onPress={() => _onChangeVisible()}>
              <Icon name='close' type='material' size={28} color={colors.selIcon} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Text style={{ flex: 1, textAlign: 'center', marginBottom: -margin.base }} h3 colorSecondary>{t('actions:text_rate_partner')}</Text>
            </View>
            <AirbnbRating
              defaultRating={5}
              count={5}
              reviews={["", "", "", "", ""]}
              onFinishRating={value => setRating(value)}
              style={{ paddingVertical: margin.base }}
            />
            <View style={styles.comment}>
              <Input

                label={t('actions:text_leave_a_comment')}
                value={comment}
                flex={1}
                onChangeText={value => setComment(value)}
                style={{ fontSize: sizes.h4, color: colors.white }}
                multiline
              />
            </View>
            <Button title={t('common:text_submit')}
              buttonStyle={{ backgroundColor: colors.selIcon }}
              titleStyle={{ color: colors.black }}
              onPress={() => _onSubmitRating(comment, rating, receiverId)} />
          </View>
        </Modal>
      </View>
    )
  } else return null
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    paddingHorizontal: margin.base,
  },
  containerContent: {
    height: 320,
    borderRadius: borderRadius.large,
    paddingVertical: margin.big,
    backgroundColor: colors.black,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: margin.big,
    borderWidth: 2,
    borderColor: colors.selIcon
  },
  comment: {
    flexDirection: 'row',
    paddingHorizontal: margin.base,
    marginBottom: margin.base
  },
  close: {
    position: 'absolute',
    top: margin.small,
    end: margin.base,
  },
  star: {
    width: 90,
    height: 90,
    marginHorizontal: - margin.base * 2,
    marginVertical: - margin.base * 1.5,
  },
})

