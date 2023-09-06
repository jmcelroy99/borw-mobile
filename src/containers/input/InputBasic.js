import React from 'react';
import {StyleSheet, TextInput, Platform, I18nManager} from 'react-native';
import {ThemeConsumer} from 'src/components';
import fonts, {lineHeights, sizes} from 'src/components/config/fonts';
import {padding} from 'src/components/config/spacing';

const InputBasic = ({
  placeholderTextColor,
  style,
  placeholder,
  multiline,
  numberOfLines,
  inputRef,
  onEndEditing,
  notCapital,
  ...rest
}) => {

  return (
    <ThemeConsumer>
      {({theme}) => (
        <TextInput
          {...rest}
          ref={inputRef}
          autoCapitalize={notCapital ? 'none' : 'sentences'}
          placeholder={placeholder}
          placeholderTextColor={
            placeholderTextColor ? placeholderTextColor : theme.ViewLabel.color
          }
          onEndEditing={onEndEditing}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          style={[
            styles.input,
            {
              color: theme.colors.primary,
            },
            multiline && styles.inputMultiline,
            multiline && {
              height: numberOfLines * 20 + 2 * padding.base,
            },
            style && style,
          ]}
        />
      )}
    </ThemeConsumer>
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: sizes.h4,
    lineHeight: lineHeights.base,
    textAlignVertical: 'center',
    ...fonts.regular,
    ...Platform.select({
      android: {
        textAlign: I18nManager.isRTL ? 'right' : 'left',
      },
      ios: {
        writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
      },
    }),
  },
  inputMultiline: {
    textAlignVertical: 'top',
    paddingVertical: padding.small,
  },
});

InputBasic.defaultProps = {
  autoCapitalize: 'none',
  underlineColorAndroid: 'transparent',
  numberOfLines: 3,
};

export default InputBasic;
