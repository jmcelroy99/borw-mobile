import React from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import { Icon, withTheme } from 'src/components';
import InputBasic from './InputBasic';
import ViewLabel, { MIN_HEIGHT } from '../ViewLabel';
import * as colors from 'src/components/config/colors';
import { padding, margin } from 'src/components/config/spacing';
import { fonts } from '../../components/config/index';


class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSecure: props.secureTextEntry,
      isHeading: props.value || props.defaultValue,
    };
    this.input = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({
        isHeading: this.props.value,
      });
    }
  }

  handleFocus = (data, shouldBlur) => {
    shouldBlur && Keyboard.dismiss()
    this.setState({ isHeading: true });
    if (this.props.onFocus) {
      this.props.onFocus(data);
    }
  };
  onChange = value => {
    this.setState(
      {
        value,
      },
      () => {
        if (this.props.onChangeText) {
          this.props.onChangeText(value);
        }
      },
    );
  };
  handleBlur = data => {
    if (data.nativeEvent.text == '') {
      const { value } = this.state;
      this.setState({ isHeading: value || (this.input.current && this.input.current._lastNativeText) });
      if (this.props.onBlur) {
        this.props.onBlur(data);
      }
    }
  };

  render() {
    const {
      label,
      error,
      placeholder,
      secureTextEntry,
      theme,
      style,
      multiline,
      editable,
      flex,
      onEndEditing,
      notCapital,
      shouldBlur,
      customAction,
      customIcon,
      customIconColor,
      iconType,
      iconSize,
      backgroundColor,
      onPress,
      LeftComponent,
      containerStyle,
      ...rest
    } = this.props;
    const { isSecure, isHeading } = this.state;
    return (
      <ViewLabel label={label} error={error} backgroundColor={backgroundColor} isHeading={isHeading} flex={flex ? flex : null}>
        <View style={[styles.viewInput, containerStyle]}>
          {LeftComponent && <LeftComponent />}
          <InputBasic
            {...rest}
            placeholder={placeholder}
            inputRef={this.input}
            testID="RN-text-input"
            onBlur={this.handleBlur}
            onFocus={(data) => this.handleFocus(data, shouldBlur)}
            secureTextEntry={isSecure}
            notCapital={notCapital}
            multiline={multiline}
            editable={editable}
            onEndEditing={onEndEditing}
            style={[
              styles.input,
              !multiline && {
                height: MIN_HEIGHT,
              },
              style ? style : {color: colors.white},
              {
                fontFamily: fonts.regular.fontFamily
              } 
            ]}
          />
          {secureTextEntry && (
            <Icon
              name={isSecure ? 'eye' : 'eye-off'}
              color={colors.grey4}
              size={15}
              containerStyle={styles.viewIcon}
              iconStyle={styles.icon}
              underlayColor="transparent"
              onPress={() =>
                this.setState({
                  isSecure: !isSecure,
                })
              }
            />
          )}
          {customIcon && (
            <Icon
              name={customIcon}
              color={customIconColor}
              type={iconType}
              size={iconSize}
              containerStyle={styles.viewIcon}
              iconStyle={styles.icon}
              underlayColor="transparent"
              onPress={onPress}
            />
          )}
        </View>
      </ViewLabel>
    );
  }
}

const styles = StyleSheet.create({
  viewInput: {
    flexDirection: 'row',
    alignItems: 'center',
    color: colors.white,
  },
  input: {
    flex: 1,
    fontFamily: fonts.regular.fontFamily,
    paddingHorizontal: padding.large,
    paddingTop: margin.small,
  },
  viewIcon: {
    marginRight: margin.large,
  },
  icon: {
    paddingVertical: padding.base,
  },
});

export default withTheme(Input);
