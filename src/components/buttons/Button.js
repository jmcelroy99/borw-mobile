import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  Text as TextRN,
  TouchableNativeFeedback,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from 'react-native';

import { withTheme, ViewPropTypes } from '../config';
import { renderNode, nodeType, conditionalStyle, color } from '../helpers';
import * as colors from 'src/components/config/colors';
import Icon from '../icons/Icon';
import Text from '../text/Text';
import { fonts } from '../../components/config/index';

const defaultLoadingProps = (type, theme) => ({
  color: type === 'solid' ? theme.colors.bgColor : theme.colors.primary,
  size: 'small',
});

class Button extends Component {
  componentDidMount() {
    const { linearGradientProps, ViewComponent } = this.props;
    if (linearGradientProps && !global.Expo && !ViewComponent) {
      /* eslint-disable no-console */
      console.error(
        `You need to pass a ViewComponent to use linearGradientProps !\nExample: ViewComponent={require('react-native-linear-gradient')}`
      );
    }
  }

  render() {
    const {
      TouchableComponent,
      containerStyle,
      onPress,
      buttonStyle,
      borderColor,
      type,
      size,
      loading,
      loadingStyle,
      loadingProps: passedLoadingProps,
      title,
      titleProps,
      titleStyle,
      icon,
      iconContainerStyle,
      iconRight,
      disabled,
      disabledStyle,
      disabledTitleStyle,
      raised,
      height,
      linearGradientProps,
      ViewComponent = !disabled && linearGradientProps && global.Expo ? global.Expo.LinearGradient : View,
      theme,
      backgroundColor,
      ...attributes
    } = this.props;

    if (Platform.OS === 'android' && (buttonStyle.borderRadius && !attributes.background)) {
      if (Platform.Version >= 21) {
        attributes.background = TouchableNativeFeedback.Ripple('ThemeAttrAndroid', false);
      } else {
        attributes.background = TouchableNativeFeedback.SelectableBackground();
      }
    }

    const loadingProps = {
      ...defaultLoadingProps(type, theme),
      ...passedLoadingProps,
    };
    const textProps = size === 'small' ? {
      h6: true,
      medium: false,
      ...titleProps,
    } : titleProps;
    const buttonClick = onPress && !loading ? onPress : () => console.log('Loading...');
    return (
      <View
        style={StyleSheet.flatten([
          styles.container,
          containerStyle,
          raised && !disabled && styles.raised(type),
        ])}
      >
        <TouchableComponent onPress={buttonClick} activeOpacity={0.3} disabled={disabled} {...attributes}>
          <ViewComponent
            {...linearGradientProps}
            style={StyleSheet.flatten([
              styles.button(type, size, height, theme, backgroundColor, borderColor),
              buttonStyle,
              disabled && styles.disabled(type, theme),
              disabled && disabledStyle,
            ])}
          >
            {loading && (
              <ActivityIndicator
                style={StyleSheet.flatten([styles.loading, loadingStyle])}
                color={colors.black}
                size={loadingProps.size}
              />
            )}

            {!loading &&
              icon &&
              !iconRight &&
              renderNode(Icon, icon, {
                containerStyle: StyleSheet.flatten([styles.iconContainer, iconContainerStyle]),
              })}

            {!loading && !!title && (
              <Text
                style={StyleSheet.flatten([
                  styles.title(type, theme),
                  titleStyle,
                  disabled && styles.disabledTitle(theme),
                  disabled && disabledTitleStyle,
                  {
                    fontFamily: fonts.light.fontFamily
                  }
                ])}
                medium
                {...textProps}
              >
                {title}
              </Text>
            )}

            {!loading &&
              icon &&
              iconRight &&
              renderNode(Icon, icon, {
                containerStyle: StyleSheet.flatten([styles.iconContainer, iconContainerStyle]),
              })}
          </ViewComponent>
        </TouchableComponent>
      </View>
    );
  }
}

Button.propTypes = {
  title: PropTypes.string,
  titleStyle: TextRN.propTypes.style,
  titleProps: PropTypes.object,
  buttonStyle: ViewPropTypes.style,
  type: PropTypes.oneOf(['solid', 'clear', 'outline']),
  size: PropTypes.oneOf(['big', 'small']),
  loading: PropTypes.bool,
  loadingStyle: ViewPropTypes.style,
  loadingProps: PropTypes.object,
  onPress: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  icon: nodeType,
  iconContainerStyle: ViewPropTypes.style,
  iconRight: PropTypes.bool,
  linearGradientProps: PropTypes.object,
  TouchableComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  ViewComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  disabled: PropTypes.bool,
  disabledStyle: ViewPropTypes.style,
  disabledTitleStyle: TextRN.propTypes.style,
  raised: PropTypes.bool,
  theme: PropTypes.object,
};

Button.defaultProps = {
  title: '',
  iconRight: false,
  TouchableComponent: Platform.select({
    android: TouchableNativeFeedback,
    default: TouchableOpacity,
  }),
  onPress: () => console.log('Please attach a method to this component'),
  type: 'solid',
  size: 'big',
  buttonStyle: {
    borderRadius: 3,
  },
  disabled: false,
  raised: false,
  loading: false,
};

const styles = {
  button: (type, size, height, theme, backgroundColor, borderColor) => ({
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    backgroundColor: type === 'solid' ? colors.button_color : backgroundColor ? backgroundColor : 'transparent',
    minHeight: size === 'huge' ? height : 42,
    paddingHorizontal: 12,
    borderWidth: type !== 'clear' ? 1 : 0,
    borderColor: type === 'outline' ? theme.Button.outlineBorderColor : borderColor ? borderColor : colors.button_color,
  }),
  disabled: (type, theme) => ({
    ...conditionalStyle(type === 'solid', {
      backgroundColor: theme.colors.disabled,
    }),
    ...conditionalStyle(type !== 'clear', {
      borderColor: theme.colors.disabled,
    }),
  }),
  disabledTitle: theme => ({
    color: color(theme.colors.disabled).darken(0.3),
  }),
  title: (type, theme) => ({
    color: type === 'solid' ? theme.Button.color : theme.Button.outlineColor,
    // fontSize: 16,
    textAlign: 'center',
    // lineHeight: 20,
    // paddingTop: 2,
    // paddingBottom: 1,
    // ...fonts.medium,
  }),
  iconContainer: {
    marginHorizontal: 5,
  },
  raised: type =>
    type !== 'clear' && {
      backgroundColor: '#fff',
      ...Platform.select({
        android: {
          elevation: 4,
        },
        default: {
          shadowColor: 'rgba(0,0,0, .4)',
          shadowOffset: { height: 1, width: 1 },
          shadowOpacity: 1,
          shadowRadius: 1,
        },
      }),
    },
  loading: {
    marginVertical: 2,
  },
};

export { Button };
export default withTheme(Button, 'Button');
