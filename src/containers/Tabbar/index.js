import React, { useState, useCallback, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Text, SafeAreaView } from 'src/components';
import IconTabbar from './IconTabbar';
import { homeTabs } from 'src/config/navigator';
import { configsSelector } from 'src/modules/common/selectors';
import { grey5, selIcon, black } from 'src/components/config/colors';
import { sizes } from 'src/components/config/fonts';
import { scrollToTop } from 'src/screens/home-screen/actions';
import { getRooms } from 'src/screens/messaging/actions';
import global from 'src/utils/global';
import { Badge } from 'react-native-elements';
import { getMyProducts } from 'src/screens/shop/MyShop/actions';
import { icon } from 'src/utils/images';

const tabbarIcons = {
  home: {
    name: 'home'
  },
  shop: {
    name: 'wardrobe-outline'
  },
  notifications: {
    name: 'notifications'
  },
  message: {
    name: 'message'
  },
  more: {
    name: 'dots-horizontal'
  }
}

const Tabbar = (props) => {
  const dispatch = useDispatch();
  const [selectedScreen, setSelected] = useState('')
  const user = global.getUser();
  const { unreadCount } = useSelector(state => state.notification)
  const { messageStatus } = useSelector(state => state.messaging)
  const [updateMessaging, setUpdate] = useState(false)
  const [updateNotification, setUpdateNotification] = useState(false)

  useEffect(() => {
    if (typeof messageStatus === "boolean") {
      setUpdate(messageStatus)
    }
  }, [messageStatus])

  useEffect(() => {
    if (unreadCount > 0) {
      setUpdateNotification(true)
    }
  }, [unreadCount])

  const {
    screenProps: { t, theme },
    navigation
  } = props;

  const data = [
    {
      iconName: tabbarIcons.home.name,
      name: t('common:text_home'),
      router: homeTabs.home,
      isShow: true,
    },
    {
      iconName: tabbarIcons.shop.name,
      type: 'material-community',
      name: t('common:text_shop'),
      router: homeTabs.shop,
      isShow: true,
    },
    {
      iconName: tabbarIcons.notifications.name,
      name: t('common:text_notification'),
      type: 'material',
      router: homeTabs.notification,
      isShow: true,
    },
    {
      iconName: tabbarIcons.message.name,
      type: 'material',
      name: t('common:text_message'),
      router: homeTabs.messaging,
      isShow: true,
    },
    {
      iconName: tabbarIcons.more.name,
      name: t('profile:text_title_setting'),
      type: 'material-community',
      router: homeTabs.me,
      iconProps: {
        size: 23,
      },
      isShow: true,
    },
  ];

  const _tabbarOnPress = useCallback((tab) => {
    if (tab.iconName == tabbarIcons.home.name && (selectedScreen == tabbarIcons.home.name || selectedScreen == '')) {
      dispatch(scrollToTop())
    } else if (tab.iconName == tabbarIcons.message.name) {
      dispatch(getRooms(user.firebaseUID))
    } else if (tab.iconName == tabbarIcons.shop.name) {
      const data = {
        page: 0,
        limit: 8
      }
      dispatch(getMyProducts(data))
    }
    setSelected(tab.iconName)
    navigation.navigate(tab.router)
  }, [selectedScreen, user])

  const _renderTabbarItem = useCallback((tab, index) => {
    return tab.isShow ? <TabbarItem tab={tab} index={index} messageStatus={updateMessaging}
      onPress={_tabbarOnPress} navigation={navigation} theme={theme} unreadCount={unreadCount} /> : null
  }, [navigation, theme, updateMessaging, unreadCount])

  return (
    <SafeAreaView forceInset={{ bottom: 'always' }} style={[styles.container]}>
      {data.map(_renderTabbarItem)}
    </SafeAreaView>
  )
};

const TabbarItem = ({ tab, index, onPress, navigation, theme, unreadCount, messageStatus }) => {
  const _onTabbarPress = useCallback(() => {
    onPress && onPress(tab)
  })

  return (
    <TouchableOpacity
      key={index}
      style={styles.item}
      onPress={_onTabbarPress}>
      {(unreadCount > 0 && index == 2)|| (index == 3 && messageStatus) && <Badge
        status='error'
        badgeStyle={styles.badge} />}
      {index == 0 && <Image
        source={navigation.state.index === index ? icon.homeSelected : icon.homeUnselected}
        style={styles.icon}
        resizeMode='contain'
      />}
      {index == 1 && <Image
        source={navigation.state.index === index ? icon.wardrobeSelected : icon.wardrobeUnselected}
        style={styles.icon}
        resizeMode='contain'
      />}
      {index == 2 && <Image
        source={navigation.state.index === index ? icon.notificationSelected : icon.notificationUnselected}
        style={styles.icon}
        resizeMode='contain'
      />}
      {index == 3 && <Image
        source={navigation.state.index === index ? icon.messagingSelected : icon.messagingUnselected}
        style={styles.icon}
        resizeMode='contain'
      />}
      {index == 4 && <Image
        source={navigation.state.index === index || (navigation.state.index == 5 && index == 4) ? icon.settingSelected : icon.settingUnselected}
        style={styles.icon}
        resizeMode='contain'
      />}
      <Text medium style={[
        styles.text,
        {
          color: navigation.state.index === index || (navigation.state.index == 5 && index == 4) ? selIcon : grey5
        },
      ]}>{tab.name}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    backgroundColor: black
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: sizes.h6 - 2,
    lineHeight: 15,
    marginTop: 5,
  },
  badge: {
    position: 'absolute',
    end: -16,
    top: 20
  },
  icon: { 
    width: 52, 
    height: 46, 
    marginBottom: -12,
    marginTop: 4,
  }
});

const mapStateToProps = state => {
  return {
    configs: configsSelector(state),
  }
};

export default connect(mapStateToProps)(Tabbar);
