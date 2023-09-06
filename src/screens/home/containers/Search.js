import React from 'react';
import {connect} from 'react-redux';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Icon, Text, withTheme} from 'src/components';
import Container from 'src/containers/Container';

import {languageSelector} from 'src/modules/common/selectors';
import {mainStack} from 'src/config/navigator';
import NavigationServices from 'src/utils/navigation';
import {borderRadius, margin, padding} from 'src/components/config/spacing';
import * as colors from 'src/components/config/colors';

class Search extends React.Component {
  render() {
    const {fields, theme, language, shouldCurved} = this.props;
    if (!fields || typeof fields !== 'object' || Object.keys(fields).length < 1) {
      return null;
    }
    const title = fields.placeholder ? fields.placeholder : null;
    const styleText =
      title && title.style
        ? title.style.fontSize
          ? {
              ...title.style,
              lineHeight: title.style.fontSize * 1.4,
            }
          : title.style
        : {};
    return (
      <Container disable={!fields.boxed ? 'all' : 'none'}>
        <TouchableOpacity
          style={[
            styles.container,
            {
              backgroundColor: colors.black,
              borderRadius: borderRadius.big * 2,
              borderColor: colors.text_color,
              borderWidth: 2,
            },
          ]}
          onPress={() => NavigationServices.navigate(mainStack.search)}>
          <Icon name="search" size={20} color={colors.text_color}/>
          {title && title.text ? (
            <Text
              h5
              colorThird
              numberOfLines={1}
              style={styles.text}
              h5Style={styleText}>
              {title.text}
            </Text>
          ) : null}
        </TouchableOpacity>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: padding.large - 1,
    marginTop: margin.small,
    overflow: 'hidden',
  },
  text: {
    flex: 1,
    marginLeft: margin.small,
  },
});

const mapStateToProps = state => ({
  language: languageSelector(state),
});

export default connect(mapStateToProps)(withTheme(Search));
