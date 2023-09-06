import { StyleSheet, View, ActivityIndicator, } from 'react-native'
import React from 'react'
import * as colors from 'src/components/config/colors';

const LoadingView = ({ style, color, child }) => {
  return (
    <View style={[styles.container, style,]}>
      <ActivityIndicator
        color={color ? color : colors.selIcon}
        size='large' />
      {/* {child} */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    zIndex: 9999,
  },
})

export default LoadingView
