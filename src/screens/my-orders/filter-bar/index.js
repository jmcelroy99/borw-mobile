import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useState } from 'react';
import { Text } from 'src/components';
import Icon from 'src/components/icons/Icon';
import * as colors from 'src/components/config/colors';
import { margin } from "src/components/config/spacing";
import { Badge } from 'react-native-elements';
import { icon } from 'src/utils/images';

export default function FilterBar({ t, _onNavigateMyCart, _onChooseIncoming, _onChooseOutgoing, _onChooseArchived, itemsInCart }) {
  const [isChoosen, setChosen] = useState('incoming')

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.element} onPress={_onNavigateMyCart}>
        <Image source={icon.cart} style={styles.cart} resizeMode='contain'/>
        {itemsInCart > 0 && <Badge
          value={itemsInCart}
          textStyle={{ color: colors.black }}
          badgeStyle={{ position: 'absolute', top: -22, backgroundColor: colors.selIcon, borderWidth: 0 }} />}
        <Text numberOfLines={1} h5 colorSecondary h5Style={styles.label}>{t('orders:text_my_cart')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.element} onPress={() => {
        _onChooseIncoming();
        setChosen('incoming')
      }}>
        <Icon containerStyle={styles.icon} name='arrow-down-bold' type='material-community'
          color={isChoosen == 'incoming' ? colors.selIcon : colors.border_color} size={26} />
        <Text numberOfLines={1}  h5 h5Style={{...styles.label, color: isChoosen == 'incoming' ? colors.selIcon : colors.border_color }}>{t('orders:text_incoming')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.element} onPress={() => {
        _onChooseOutgoing();
        setChosen('outgoing')
      }}>
        <Icon containerStyle={styles.icon} name='arrow-up-bold' type='material-community'
          color={isChoosen == 'outgoing' ? colors.selIcon : colors.border_color} size={26} />
        <Text numberOfLines={1}  h5 h5Style={{ ...styles.label, color: isChoosen == 'outgoing' ? colors.selIcon : colors.border_color }}>{t('orders:text_outgoing')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.element} onPress={() => {
        _onChooseArchived();
        setChosen('archived')
      }}>
        <Icon containerStyle={styles.icon} name='archive' type='material-community'
          color={isChoosen == 'archived' ? colors.selIcon : colors.border_color} size={26} />
        <Text numberOfLines={1}  h5 h5Style={{ ...styles.label, color: isChoosen == 'archived' ? colors.selIcon : colors.border_color }}>{t('orders:text_archived')}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginVertical: margin.base
  },
  icon: {
    marginEnd: margin.tiny,
  },
  label: {
    flexShrink: 1,
  },
  element: {
    flexShrink: 1,
    alignItems: 'center',
    flexDirection: 'row'
  },
  cart: {
    width: 60,
    height: 60,
    marginHorizontal: -margin.base,
  }
})