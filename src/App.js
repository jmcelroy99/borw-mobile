/**
 *
 * Main app
 *
 *
 * App Name:          BorwApp
 * Description:       This is a short description of what the plugin does. It's displayed in the WordPress admin area.
 * Version:           1.1.0
 * Author:            NUS Technology
 *
 * @since             1.0.0
 *
 * @format
 * @flow
 */

import React, { useEffect, useState } from 'react';
import './config-i18n';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppRouter from './AppRouter';
import messaging from '@react-native-firebase/messaging';
import configureStore from './config-store';
import { getDemoSelector } from './modules/common/selectors';
import demoConfig from './utils/demo';
import globalConfig from './utils/global';
import { setBadgeNumber } from './utils/func';
import notifee, { AndroidImportance }  from '@notifee/react-native';

const { store, persistor } = configureStore();

export default function App() {
  const [shouldUpdate,] = useState(false)
  const [shouldReloadNotification, setShouldReloadNotification] = useState(false)
  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    setBadgeNumber(0)
    if (enabled) {
      messaging()
        .getToken()
        .then(token => {
          console.log("firebase token", token);
          globalConfig.setDeviceToken(token)
        });
      
      await notifee.createChannel({
        id: 'BorwForeground',
        name: 'Borw',
        lights: false,
        vibration: true,
        importance: AndroidImportance.DEFAULT,
      });
    }
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      setShouldReloadNotification(!shouldReloadNotification)
    });


    return unsubscribe;
  }

  useEffect(() => {
    store.subscribe(() => {
      const state = store.getState();
      demoConfig.setData(getDemoSelector(state).toJS());
    });

    requestPermission()
  }, [])

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppRouter shouldUpdateNoti={shouldUpdate}
            reloadNotification={shouldReloadNotification} />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
