// @flow

import { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import globalConfig from '../utils/global';
import settings from '../../src/setting.json';

// import isArray from 'lodash/isArray';
// import isObject from 'lodash/isObject';

import { connect } from 'react-redux';
import { fetchSettingSuccess } from 'src/modules/common/actions';
import { isGettingStartSelector } from 'src/modules/common/selectors';
import { isLoginSelector } from 'src/modules/auth/selectors';
import { fetchCategories } from 'src/modules/category/actions';
import { rootSwitch, authStack } from 'src/config/navigator';
import { fetchConfig, fetchTemplate } from 'src/modules/common/service';
import AsyncStorage from '@react-native-community/async-storage';
import { homeTabs } from 'src/config/navigator';
import { fetchDataCartAsync } from 'src/screens/product/product-detail/actions';
import { fetchSetting } from 'src/screens/profile/settings/actions';
import SplashScreen from 'react-native-splash-screen';

type Props = {
  initSetting: Function,
  navigation: NavigationScreenProps,
};

class LoadingScreen extends Component<Props> {

  componentDidMount() {
    this.bootstrapAsync();
  }

  /**
   * Init data
   * @returns {Promise<void>}
   */
  bootstrapAsync = async () => {

    try {
      const {
        initSetting,
        fetchDataCartAsync,
        fetchSetting,
        navigation,
      } = this.props;

      const { configs, templates, ...rest } = settings;

      initSetting({
        settings: rest,
        configs: configs,
        templates: templates
      });

      const user = await AsyncStorage.getItem('user');
      if (user) {
        globalConfig.setUser(JSON.parse(user))
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          const token_temp = await AsyncStorage.getItem('token_temp')
          globalConfig.setToken(token_temp)
        } else {
          globalConfig.setToken(token)
        }

        const data = await AsyncStorage.getItem('myCart')
        if (data) {
          const myCart = JSON.parse(data);
          fetchDataCartAsync(myCart)
        }
        const setting = await AsyncStorage.getItem('setting')
        if (setting) {
          const mySetting = JSON.parse(setting);
          fetchSetting(mySetting)
        }
        navigation.navigate(homeTabs.home)
      } else {
        navigation.navigate(authStack.login)
      }

      SplashScreen.hide();
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    return null;
  }
}

const mapStateToProps = state => {
  return {
    isGettingStart: isGettingStartSelector(state),
    isLogin: isLoginSelector(state),
  };
};

const mapDispatchToProps = {
  initSetting: fetchSettingSuccess,
  fetchCategories: fetchCategories,
  fetchDataCartAsync: fetchDataCartAsync,
  fetchSetting: fetchSetting
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoadingScreen);
