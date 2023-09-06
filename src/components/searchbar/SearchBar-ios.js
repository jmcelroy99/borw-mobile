import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  StyleSheet,
  View,
  ActivityIndicator,
  Text as TextRN,
} from 'react-native';

import ViewPropTypes from '../config/ViewPropTypes';
import Input from '../input/Input';
import Icon from '../icons/Icon';
import Text from '../text/Text';
import ThemedView from '../themedview/ThemedView';
import { renderNode, nodeType } from '../helpers';
import { grey5 } from '../config/colors';
import { sizes } from '../config/fonts';
import { margin, padding, borderRadius } from '../config/spacing';

const PADDING_LEFT_CONTAINER = padding.large;
const PADDING_RIGHT_CONTAINER = padding.large + 3;

const defaultSearchIcon = {
  type: 'feather',
  size: 20,
  name: 'search',
  color: grey5,
};
const defaultClearIcon = {
  type: 'ionicon',
  name: 'ios-close-circle',
  size: 20,
  color: grey5,
};

class SearchBar extends Component {
  constructor(props) {
    super(props);
    const { value } = props;

    this.state = {
      hasFocus: false,
      isEmpty: value ? value === '' : true,
      cancelButtonWidth: null,
    };
  }

  focus = () => {
    this.input.focus();
  };

  blur = () => {
    this.input.blur();
  };

  clear = () => {
    this.input.clear();
    this.onChangeText('');
    this.props.onClear();
  };

  cancel = () => {
    this.blur();
    this.props.onCancel();
  };

  onFocus = () => {
    this.props.onFocus();
    UIManager.configureNextLayoutAnimation && LayoutAnimation.easeInEaseOut();

    this.setState({
      hasFocus: true,
    });
  };

  onBlur = () => {
    this.props.onBlur();
    UIManager.configureNextLayoutAnimation && LayoutAnimation.easeInEaseOut();

    this.setState({
      hasFocus: false,
    });
  };

  onChangeText = text => {
    this.props.onChangeText(text);
    this.setState({ isEmpty: text === '' });
  };

  render() {
    const {
      theme,
      cancelButtonProps,
      cancelButtonTitle,
      clearIcon,
      containerStyle,
      leftIconContainerStyle,
      rightIconContainerStyle,
      inputContainerStyle,
      inputStyle,
      placeholderTextColor,
      showLoading,
      loadingProps,
      searchIcon,
      ...attributes
    } = this.props;
    const { hasFocus, isEmpty } = this.state;

    const { style: loadingStyle, ...otherLoadingProps } = loadingProps;

    const {
      buttonStyle,
      buttonTextStyle,
      color: buttonColor,
      disabled: buttonDisabled,
      buttonDisabledStyle,
      buttonDisabledTextStyle,
      ...otherCancelButtonProps
    } = cancelButtonProps;

    return (
    );
  }
}

SearchBar.propTypes = {
  value: PropTypes.string,
  cancelButtonProps: PropTypes.object,
  cancelButtonTitle: PropTypes.string,
  clearIcon: nodeType,
  searchIcon: nodeType,
  loadingProps: PropTypes.object,
  showLoading: PropTypes.bool,
  onClear: PropTypes.func,
  onCancel: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChangeText: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  leftIconContainerStyle: ViewPropTypes.style,
  rightIconContainerStyle: ViewPropTypes.style,
  inputContainerStyle: ViewPropTypes.style,
  inputStyle: TextRN.propTypes.style,
  placeholderTextColor: PropTypes.string,
};

SearchBar.defaultProps = {
  value: '',
  cancelButtonTitle: 'Cancel',
  loadingProps: {},
  cancelButtonProps: {},
  showLoading: false,
  onClear: () => null,
  onCancel: () => null,
  onFocus: () => null,
  onBlur: () => null,
  onChangeText: () => null,
  placeholderTextColor: grey5,
  searchIcon: defaultSearchIcon,
  clearIcon: defaultClearIcon,
};

const styles = {
  container: {
    backgroundColor: '#f5f5f5',
    paddingVertical: padding.large,
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
  },
  input: theme => ({
    marginLeft: margin.small,
    fontSize: sizes.base,
    color: theme.colors.primary,
  }),
  inputContainer: theme => ({
    borderBottomWidth: 0,
    backgroundColor: theme.colors.bgColorSecondary,
    borderRadius: borderRadius.base,
    height: 46,
    marginLeft: PADDING_LEFT_CONTAINER,
    marginRight: PADDING_RIGHT_CONTAINER,
  }),
  rightIconContainerStyle: {
    marginRight: margin.large,
  },
  leftIconContainerStyle: {
    marginLeft: margin.large,
  },
  buttonTextStyle: {
    textAlign: 'center',
    paddingVertical: padding.small,
    paddingLeft: PADDING_LEFT_CONTAINER,
    paddingRight: PADDING_RIGHT_CONTAINER,
  },
  buttonTextDisabled: theme => ({
    color: theme.colors.disabled,
  }),
  cancelButtonContainer: {
    position: 'absolute',
  },
};

export default SearchBar;
