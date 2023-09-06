import {authStack} from 'src/config/navigator';

import {createStackNavigator} from 'react-navigation-stack';

import Login from 'src/screens/auth/login';
import LoginMobile from 'src/screens/auth/login-mobile';
import Register from 'src/screens/auth/register';
import Forgot from 'src/screens/auth/forgot';
import VerifyPhone from 'src/screens/auth/verify-phone';
import ResetPassword from 'src/screens/auth/reset-password'

export default createStackNavigator(
  {
    [authStack.login]: Login,
    [authStack.register]: Register,
    [authStack.forgot]: Forgot,
    [authStack.verify_phone]: VerifyPhone,
    [authStack.reset_password]: ResetPassword,
  },
  {
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);
