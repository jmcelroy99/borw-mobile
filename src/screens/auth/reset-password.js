import React from 'react';

import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
} from 'react-native';
import { Header, ThemedView } from 'src/components';
import Container from 'src/containers/Container';
import Button from 'src/containers/Button';
import Input from 'src/containers/input/Input';
import { TextHeader, IconHeader } from 'src/containers/HeaderComponent';

import { changePassword } from 'src/modules/auth/actions';
import { authSelector } from 'src/modules/auth/selectors';
import { configsSelector, languageSelector } from 'src/modules/common/selectors';
import { authStack } from 'src/config/navigator';

import { sizes } from 'src/components/config/fonts';
import { margin, padding } from 'src/components/config/spacing';
import { lineHeights } from 'src/components/config/fonts';
import { isEqual, isValidPassword } from 'src/utils/string';
import * as colors from 'src/components/config/colors';

class ResetPasswordScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      newPassword: '',
      confirmNewPassword: '',
      confirmResult: null,
      visibleModal: false,
      loading: false,
      isSubmit: null,
      error: {
        message: null,
        messageConfirm: null,
        errors: null,
      },
    };
    this.confirmation = null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.changePasswordSuccess !== this.props.auth.changePasswordSuccess &&
      prevState.isSubmit === this.state.isSubmit && this.state.isSubmit) {
      this.props.navigation.navigate(authStack.login)
    }
  }

  changeData = (value) => {
    this.setState({
      ...this.state,
      ...value,
    })
  };

  checkFormatPassword = (value, t) => {
    if (!isValidPassword(value)) {
      this.setState({
        error: {
          ...this.state.error,
          message: t('error:text_error_password'),
        }
      }, () => {
        if (this.state.confirmNewPassword != '') {
          this.checkConfirmPassword(value, this.state.confirmNewPassword, t)
        }
      })
    } else {
      this.setState({
        error: {
          ...this.state.error,
          message: null,
        }
      }, () => {
        if (this.state.confirmNewPassword != '') {
          this.checkConfirmPassword(value, this.state.confirmNewPassword, t)
        }
      })
    }
  }

  checkConfirmPassword = (password, confirmPassword, t) => {
    if (!isEqual(password, confirmPassword)) {
      this.setState({
        error: {
          ...this.state.error,
          messageConfirm: t('error:text_password_and_confirm_mismatch'),
        }
      })
    } else {
      this.setState({
        error: {
          ...this.state.error,
          messageConfirm: null,
        }
      })
    }
  }

  onSubmit = () => {
    const { newPassword, error } = this.state;
    if (newPassword != '' && error.message == null && error.messageConfirm == null) {
      this.setState({
        isSubmit: true
      }, () => {
        this.props.dispatch(changePassword(newPassword))
      })
    }
  }

  render() {
    const {
      navigation,
      auth: { pendingChangePassword, error },
      screenProps: { t, theme },
    } = this.props;
    const {
      newPassword,
      confirmNewPassword,
      error: { message, errors, messageConfirm },
      loading,
    } = this.state;

    return (
      <ThemedView isFullView>
        <Header
          backgroundColor={colors.black}
          leftComponent={<IconHeader color={colors.unSelIcon} />}
          centerComponent={<TextHeader titleStyle={{ color: colors.white }} title={t('common:text_new_password')} />}
        />
        <Container style={{ flex: 0.7, justifyContent: 'center' }}>
          <View style={styles.containerCode}>
            <Input
              label={t('auth:text_new_password')}
              value={newPassword}
              secureTextEntry
              onChangeText={(value) => {
                this.setState({
                  newPassword: value
                }, () => {
                  this.checkFormatPassword(value, t)
                })
              }}
              error={message}
            />
            <Input
              label={t('auth:text_confirm_new_password')}
              value={confirmNewPassword}
              secureTextEntry
              onChangeText={(value) => {
                this.setState({
                  confirmNewPassword: value
                }, () => {
                  this.checkConfirmPassword(this.state.newPassword, value, t)
                })
              }}
              error={messageConfirm}
            />
          </View>
          <Button
            buttonStyle={{ backgroundColor: colors.selIcon }}
            titleStyle={{ color: colors.black }}
            style={styles.buttonVerify}
            title={t('common:text_submit')}
            onPress={() => this.onSubmit()}
            loading={loading || pendingChangePassword}
          />
        </Container>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 0.7,
  },
  viewSwitch: {
    marginVertical: margin.big,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textPolicy: {
    lineHeight: lineHeights.h4,
    textAlign: 'left',
    marginBottom: margin.big
  },
  resendCode: {
    textAlign: 'center',
    marginTop: margin.big
  },
  changePhone: {
    textAlign: 'center',
  },
  containerCode: {
    marginBottom: margin.big
  },
  viewAccount: {
    marginVertical: margin.big,
  },
  textHaveAccount: {
    paddingVertical: padding.small,
    marginTop: margin.base,
    marginBottom: margin.big,
    textAlign: 'center',
  },
  inputCode: {
    marginVertical: margin.big,
  },
  inputPhoneNo: {
  },
  inputDigit: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    fontSize: sizes.h3,
    textAlign: 'center',
    width: 28,
    height: 40
  },
  buttonVerify: {
    marginTop: margin.big
  }
});

const mapStateToProps = (state) => {
  const configs = configsSelector(state);
  return {
    auth: authSelector(state),
    language: languageSelector(state),
    enablePhoneNumber: configs.get('toggleLoginSMS'),
  };
};

export default connect(mapStateToProps)(ResetPasswordScreen);
