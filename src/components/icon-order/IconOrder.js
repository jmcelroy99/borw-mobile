import React from 'react';
import { StyleSheet, Image, TouchableWithoutFeedback, View } from 'react-native';
import { margin } from 'src/components/config/spacing';
import { Badge } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { icon } from 'src/utils/images';

export default function IconOrder({ style, _onPress }) {
  const { cart } = useSelector(state => state.productDetail)

  return (
    <TouchableWithoutFeedback onPress={_onPress}>
      <View>
        {cart && cart.length > 0 && <Badge
          status='error'
          badgeStyle={styles.badge} />}
        <Image
          resizeMode='contain'
          source={icon.order}
          style={styles.icon} />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  containerIcons: {
    marginTop: margin.small,
    flexDirection: 'row'
  },
  badge: {
    position: 'absolute',
    end: -4,
    top: 10
  },
  icon: {
    width: 56,
    height: 56,
    marginBottom: -6,
    marginEnd: -margin.base
  }
})