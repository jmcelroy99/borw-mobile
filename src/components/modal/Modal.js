import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Modal, TouchableOpacity, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import Icon  from '../icons/Icon';
import { withTheme }  from '../config';
import * as colors from 'src/components/config/colors';
import { padding, borderRadius } from '../config/spacing';

const { height: heightWindow } = Dimensions.get('window');

const getHeightView = (heightFull = heightWindow, ratio = 0.5) => {
    return (heightFull)*ratio;
};

class ModalSelect extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: this.props.visible,
      opacity: new Animated.Value(0),
      height: getHeightView(heightWindow,props.ratio),
    };
  }

  animation = (type = 'open', cb = () => {}) => {
    const toValue = type === 'open' ? 0.5 : 0;
    const duration = 350;
    Animated.timing(this.state.opacity, {
      toValue,
      duration,
    }).start(cb);
  };

  onShow = () => {
    this.animation();
  };

  componentDidUpdate(preProps) {
    const { visible } = this.props;
    // Close
    if (!visible && preProps.visible !== visible) {
      this.animation('close', () => this.setState({ visible }));
    }
    // Open
    if (visible && preProps.visible !== visible) {
      this.setState({ visible });
    }
  }

  render() {
    const { theme, centerElement, topLeftElement, topRightElement, noBorder, underTopElement, ratioHeight, children, setModalVisible, backgroundColor, paddingContent, headerStyle } = this.props;
    const { opacity, visible, height } = this.state;

    const topLeft = topLeftElement ? (
      topLeftElement
    ) : (
      <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 12 }}>
        <Icon name="x" type="feather" size={18} color={colors.unSelIcon}/>
      </TouchableOpacity>
    );

    const topRight = topRightElement ? topRightElement : null;

    const bottom = opacity.interpolate({
      inputRange: [0, 0.5],
      outputRange: [-height, 0],
    });

    return (
      <Modal transparent visible={visible} onShow={this.onShow}>
        <View style={styles.container} onLayout={(event) => {
          let {height: heightFull} = event.nativeEvent.layout;
          this.setState({
            height: getHeightView(heightFull, ratioHeight),
          });
        }}>
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: backgroundColor ? backgroundColor : colors.black,
              opacity: 0,
            }}
          >
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setModalVisible(false)} />
          </Animated.View>
          <Animated.View
            style={[
              styles.modal,
              {
                height: height,
                backgroundColor: backgroundColor ? backgroundColor : colors.black,
                bottom: bottom,
                borderTopLeftRadius: noBorder ? 0 : borderRadius.big,
                borderTopRightRadius: noBorder ? 0 : borderRadius.big,
              },
            ]}
          >
            {/*Header*/}
            <View style={[styles.header, headerStyle, {justifyContent: !centerElement ? 'space-between' : null,}
              ]}>
              {topLeft}
              {centerElement}
              {topRight}
            </View>

            {underTopElement}

            {/*Content*/}
            <View style={{ flex: 1, paddingHorizontal: paddingContent ? paddingContent : 0 }}>{children}</View>
          </Animated.View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    overflow: 'hidden',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.black
  },
  header: {
    padding: Platform.OS === 'android' ? padding.small : padding.base,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

ModalSelect.propTypes = {
  visible: PropTypes.bool,
  setModalVisible: PropTypes.func,
  ratioHeight: PropTypes.number,
  topRightElement: PropTypes.node,
};

ModalSelect.defaultProps = {
  topBottomElement: null,
  visible: false,
  ratioHeight: 0.5,
};

export default withTheme(ModalSelect, 'Modal');
