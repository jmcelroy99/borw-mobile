import React from 'react';
import { connect } from 'react-redux';

import { StyleSheet, ScrollView, KeyboardAvoidingView, Image, Dimensions } from 'react-native';
import { Text, ThemedView } from 'src/components';
import Container from 'src/containers/Container';
import Input from 'src/containers/input/Input';
import Button from 'src/containers/Button';
import TextHtml from 'src/containers/TextHtml';
import { imagesTheme } from 'src/config/images';

import { authStack } from 'src/config/navigator';

import { signInWithEmail } from 'src/modules/auth/actions';
import { authSelector } from 'src/modules/auth/selectors';
import { requiredLoginSelector } from 'src/modules/common/selectors';
import { margin } from 'src/components/config/spacing';
import { isValidPassword } from 'src/utils/string';

import { changeColor } from 'src/utils/text-html';
import * as colors from 'src/components/config/colors';
console.disableYellowBox = true;

class LoginScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: {
        message: null,
        errors: null,
      },
    }
  }

  handleLogin = () => {
    const { username, password } = this.state;
    this.props.dispatch(signInWithEmail({ 
      username, 
      password,
    }));
  };

  checkFormatPassword = (value, t) => {
    if (!isValidPassword(value)) {
      this.setState({
        error: {
          errors: {
            ...this.state.error.errors,
            password: t('validators:text_wrong_format_password'),
          }
        }
      })
    } else {
      this.setState({
        error: {
          errors: {
            ...this.state.error.errors,
            password: null,
          }
        }
      })
    }
  }

  render() {
    const {
      navigation,
      auth: { pending, loginError },
      requiredLogin,
      screenProps: { t, theme },
    } = this.props;
    const {
      username,
      password,
      error: { message, errors },
    } = this.state;

    return (
      <ThemedView isFullView>
        <KeyboardAvoidingView behavior="height" style={styles.keyboard}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}>
            <Image style={styles.logo} source={imagesTheme.dark.icon} resizeMode='contain'/>
            <Container style={{ flex: 1 }}>
              {message ? (
                <TextHtml
                  value={message}
                  style={changeColor(theme.colors.error)}
                />
              ) : null}
              <Text
                style={styles.textUserName}
                colorSecondary={true}
                secondary={styles.textColor}
                medium>
                {t('auth:text_email_address_and_phone')}
              </Text>
              <Input
                notCapital={true}
                placeholder={t('inputs:text_example_username')}
                value={username}
                onChangeText={value => this.setState({ username: value })}
                error={errors && errors.username}
              />
              <Text
                style={styles.textPassword}
                colorSecondary={true}
                secondary={styles.textColor}
                medium>
                {t('auth:text_password')}
              </Text>
              <Input
                placeholder={t('auth:text_password')}
                value={password}
                secureTextEntry
                onChangeText={value => {
                  this.setState({ password: value });
                  this.checkFormatPassword(value, t)
                }}
              />
              <Button
                buttonStyle={{ backgroundColor: colors.selIcon }}
                titleStyle={{ color: colors.black }}
                title={t('common:text_signin')}
                loading={pending}
                onPress={this.handleLogin}
                containerStyle={styles.button}
              />
              <Text
                onPress={() => { navigation.navigate(authStack.forgot) }}
                style={styles.textForgot}
                medium>
                {t('auth:text_forgot')}
              </Text>
            </Container>
            <Container style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }}>
              <Text h6 style={styles.textAccount}>
                {t('auth:text_new_borw')}
              </Text>
              <Text h5 bold style={[styles.textAccount, { marginStart: 8, color: colors.selIcon }]} onPress={() => {
                this.props.navigation.navigate(authStack.register)
              }}>
                {t('auth:text_sign_up')}
              </Text>
            </Container>
          </ScrollView>
        </KeyboardAvoidingView>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    height: Dimensions.get('screen').height,
    paddingTop: Dimensions.get('screen').height >= 812 ? 120 : 80,
    paddingBottom: margin.big + margin.base
  },
  textForgot: {
    textAlign: 'center',
    color: colors.white
  },
  logo: {
    width: 300,
    height: 130,
    alignSelf: 'center',
    resizeMode: 'cover',
    marginBottom: Dimensions.get('screen').height >= 812 ? 90 : 70,
  },
  textTitle: {
    fontSize: 30,
    marginTop: 16,
    textAlign: 'center',
  },
  textUserName: {
    textAlign: 'left',
    marginStart: 8,
    marginBottom: -4,
  },
  textPassword: {
    textAlign: 'left',
    marginStart: 8,
    marginTop: 8,
    marginBottom: -4,
  },
  textColor: {
    color: colors.text_color
  },
  viewOr: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divOr: {
    flex: 1,
  },
  textOr: {
    marginHorizontal: margin.base,
  },
  textAccount: {
    textAlign: 'center',
    marginBottom: margin.base,
    color: colors.white
  },
  button: {
    marginVertical: margin.big,
  },
  viewSocial: {
    marginBottom: margin.big,
  },
});

const mapStateToProps = state => {
  return {
    auth: authSelector(state),
    requiredLogin: requiredLoginSelector(state),
  };
};

export default connect(mapStateToProps)(LoginScreen);
