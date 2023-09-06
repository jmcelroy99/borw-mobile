import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'src/components';

const TextHeader = ({ title, subtitle, size, titleStyle, subtitleStyle, containerStyle, type, onPress }) => {

  if (type === 'button') {
    return (
      <TouchableOpacity style={[styles.button, containerStyle && containerStyle]} onPress={onPress}>
        <Text h6 colorThird style={titleStyle && titleStyle}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
  if (!size) {
    return (
      <View style={[styles.container, containerStyle && containerStyle]}>
        <Text style={titleStyle && titleStyle} h4 medium numberOfLines={1}>
          {title}
        </Text>
        {typeof subtitle === 'string' ? (
          <Text h6 colorThird style={subtitleStyle && subtitleStyle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    );
  } else {
    return (
      <View style={[styles.container, containerStyle && containerStyle]}>
        <Text style={titleStyle && titleStyle} h5 medium numberOfLines={1}>
          {title}
        </Text>
        {typeof subtitle === 'string' ? (
          <Text h6 colorThird style={subtitleStyle && subtitleStyle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    padding: 6
  }
});

TextHeader.propTypes = {};

TextHeader.defaultProps = {
  type: 'default',
  title: '',
  onPress: () => { },
};

export default TextHeader;
