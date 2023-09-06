import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as colors from 'src/components/config/colors';

export default function FloatingButton({ addProduct }) {
  return (
    <TouchableOpacity style={styles.fab} onPress={() => addProduct()}>
      <MaterialIcons name='add' size={40} color={colors.white}/>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.gray_icon_ban,
    position: 'absolute',
    bottom: 16,
    right: 16,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
