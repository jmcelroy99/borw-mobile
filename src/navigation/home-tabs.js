import React from 'react';

import { createBottomTabNavigator } from 'react-navigation-tabs';

import MyShop from 'src/screens/shop/MyShop';
import HomeScreen from 'src/screens/home-screen';
import Messaging from 'src/screens/messaging';
import Notification from 'src/screens/notification';

import ProfileStack from './profile-stack';
import CartStack from './cart-stack';

import Tabbar from 'src/containers/Tabbar';

import { homeTabs } from 'src/config/navigator';

const Tabs = createBottomTabNavigator(
  {
    [homeTabs.home]: {
      screen: HomeScreen,
    },
    [homeTabs.shop]: {
      screen: MyShop,
    },
    [homeTabs.notification]: {
      screen: Notification,
    },
    [homeTabs.messaging]: {
      screen: Messaging,
    },
    [homeTabs.cart]: {
      screen: CartStack,
      navigationOptions: ({ navigation }) => {
        const {state: {index}} = navigation
        return {
          tabBarVisible: index === 0,
        }
      },
    },
    [homeTabs.me]: {
      screen: ProfileStack,
    },
  },
  {
    defaultNavigationOptions: {
      // tabBarVisible: false
    },
    tabBarComponent: props => <Tabbar {...props}/>,
  }
);

export default Tabs;
