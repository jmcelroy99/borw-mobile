import React from 'react';

import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Header, Text, ThemedView } from 'src/components';
import Container from 'src/containers/Container';
import Button from 'src/containers/Button';
import TextHtml from 'src/containers/TextHtml';
import { TextHeader, IconHeader } from 'src/containers/HeaderComponent';
import Modal from 'src/components/modal/Modal';
import InputMobile from 'src/containers/input/InputMobile';
import globalConfig from 'src/utils/global';
import { signUpWithEmail, signUpWithOtp, checkOTP, checkVerifyCodeResetPass, forgotPassword } from 'src/modules/auth/actions';
import { authSelector } from 'src/modules/auth/selectors';
import { configsSelector, languageSelector } from 'src/modules/common/selectors';
import Icon from 'react-native-vector-icons/Feather';
import { homeTabs } from 'src/config/navigator';
import { authStack } from 'src/config/navigator';

import { sizes } from 'src/components/config/fonts';
import { margin, padding } from 'src/components/config/spacing';
import { lineHeights } from 'src/components/config/fonts';
import { changeColor } from 'src/utils/text-html';
import { INITIAL_COUNTRY } from 'src/config/config-input-phone-number';
import AsyncStorage from '@react-native-community/async-storage';
import * as colors from 'src/components/config/colors';

class VerifyPhoneScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props, context) {
    super(props, context);
    const newPhoneNumber = this.props.navigation.getParam('phoneNumber');
    const phone = (this.props.navigation.getParam('phone'))
    this.state = {
      data: {
        phone_number: phone ? phone : '',
        country_no: '',
        new_phone_number: newPhoneNumber ? newPhoneNumber : '',
        otp: '',
      },
      isSubmit: false,
      isForgot: JSON.stringify(this.props.navigation.getParam('isForgot')),
      visibleModal: false,
      loading: false,
      error: {
        message: null,
        errors: null,
      },
    };
    this.confirmation = null;
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  changeData = (value) => {
    this.setState({
      data: {
        ...this.state.data,
        ...value,
      },
    })
  };

  changeNewPhone = (value) => {
    this.setState({
      data: {
        ...this.state.data,
        new_phone_number: value,
      },
      visibleModal: !this.state.visibleModal
    }, () => {
      if (this.state.data.new_phone_number) {
        this.setState({
          data: {
            ...this.state.data,
            phone_number: this.state.data.new_phone_number
          }
        })
        this.resendVerificationCode(this.state.data.new_phone_number);
      }
    })
  }

  resendVerificationCode = (newPhone) => {
    if (this.state.isForgot) {
      this.props.dispatch(forgotPassword(this.state.data.new_phone_number))
    } else {
      newPhone ? this.props.dispatch(signUpWithOtp(newPhone)) : this.props.dispatch(signUpWithOtp(this.state.data.phone_number))
    }
  }

  checkInputPhoneValid = (phone, code, t) => {
    if (!phone || phone == '') {
      this.setState({
        ...this.state,
        error: {
          errors: {
            message: '',
            phone_number: t('auth:text_error_remove_country_code')
          }
        }
      })
    } else if (phone.charAt(0) == '+') {
      this.setState({
        ...this.state,
        error: {
          message: null,
          errors: null,
        },
        data: {
          new_phone_number: phone
        }
      })
    } else {
      this.setState({
        ...this.state,
        error: {
          message: null,
          errors: null,
        },
        data: {
          new_phone_number: code + phone
        }
      })
    }
  }

  verifyCode = () => {
    const { new_phone_number, digit1, digit2, digit3, digit4, digit5, digit6 } = this.state.data;
    this.setState({
      ...this.state,
      isSubmit: true
    }, () => {
      const verificationCode = digit1 + digit2 + digit3 + digit4 + digit5 + digit6
      if (!this.state.isForgot) {
        this.props.dispatch(checkOTP(verificationCode))
      } else {
        const data = {
          phoneNumber: new_phone_number,
          otp: verificationCode
        }
        this.props.dispatch(checkVerifyCodeResetPass(data))
      }
    })
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.checkOTPForgotSuccess !== this.props.auth.checkOTPForgotSuccess &&
      prevProps.isForgot !== this.props.auth.isForgot &&
      prevState.isSubmit === this.state.isSubmit && this.state.isSubmit) {
      this.props.navigation.navigate(authStack.reset_password)
    } else if (this.props.auth.checkOTPSuccess && prevProps.checkOTPSuccess !== this.props.auth.checkOTPSuccess) {
      const user = await AsyncStorage.getItem('user_temp')
      globalConfig.setUser(user)
      const token = await AsyncStorage.getItem('token_temp')

      if (token == '' && token) {
        globalConfig.setToken(token)
      }
      AsyncStorage.setItem, 'user', JSON.stringify(user);
      AsyncStorage.setItem, 'token', token;
      this.props.navigation.navigate(homeTabs.home)
    }
  }

  render() {
    const {
      auth: { pending },
      screenProps: { t, theme },
    } = this.props;
    const {
      data: {
        digit1,
        digit2,
        digit3,
        digit4,
        digit5,
        digit6,
        phone_number,
        new_phone_number,
      },
      error: { message, errors },
      visibleModal,
      loading,
      isForgot
    } = this.state;
    return (
      <ThemedView isFullView>
        <Header
          backgroundColor={colors.black}
          centerComponent={<TextHeader titleStyle={{ color: colors.white }} title={t('common:text_verify_phone_number')} />}
        />
        <Container style={{ flex: 0.7, justifyContent: 'center' }}>
          {message ? (
            <TextHtml
              value={message}
              style={changeColor(theme.colors.error)}
            />
          ) : null}
          <Text style={styles.textPolicy} colorSecondary>
            {t('auth:text_input_verification_code')}
          </Text>
          <View style={styles.containerCode}>
            <TextInput
              ref={(input) => { this.firstTextInput = input; }}
              style={styles.inputDigit}
              value={digit1}
              maxLength={1}
              keyboardType='numeric'
              onChangeText={(value) => {
                this.changeData({ digit1: value });
                value !== '' ? this.secondTextInput.focus() : null
              }}
            />
            <TextInput
              ref={(input) => { this.secondTextInput = input; }}
              style={styles.inputDigit}
              value={digit2}
              maxLength={1}
              keyboardType='numeric'
              onChangeText={(value) => {
                this.changeData({ digit2: value });
                value !== '' ? this.thirdTextInput.focus() : this.firstTextInput.focus()
              }}
            />
            <TextInput
              ref={(input) => { this.thirdTextInput = input; }}
              style={styles.inputDigit}
              value={digit3}
              maxLength={1}
              keyboardType='numeric'
              onChangeText={(value) => {
                this.changeData({ digit3: value });
                value !== '' ? this.fourthTextInput.focus() : this.secondTextInput.focus()
              }}
            />
            <TextInput
              ref={(input) => { this.fourthTextInput = input; }}
              style={styles.inputDigit}
              value={digit4}
              keyboardType='numeric'
              maxLength={1}
              onChangeText={(value) => {
                this.changeData({ digit4: value });
                value !== '' ? this.fifthTextInput.focus() : this.thirdTextInput.focus()
              }}
            />
            <TextInput
              ref={(input) => { this.fifthTextInput = input; }}
              style={styles.inputDigit}
              value={digit5}
              maxLength={1}
              keyboardType='numeric'
              onChangeText={(value) => {
                this.changeData({ digit5: value });
                value !== '' ? this.sixthTextInput.focus() : this.fourthTextInput.focus()
              }}
            />
            <TextInput
              ref={(input) => { this.sixthTextInput = input; }}
              style={styles.inputDigit}
              value={digit6}
              keyboardType='numeric'
              maxLength={1}
              onChangeText={(value) => {
                if (value == '') {
                  this.fifthTextInput.focus()
                }
                this.changeData({ digit6: value });
              }}
            />
          </View>
          <Button
            buttonStyle={{ backgroundColor: colors.selIcon }}
            titleStyle={{ color: colors.black }}
            style={styles.buttonVerify}
            title={t('auth:text_verify')}
            onPress={() => this.verifyCode()}
            loading={loading || pending}
          />
          {!isForgot && <Text
            style={styles.changePhone}
            colorSecondary
            medium
            onPress={() => this.setState({
              visibleModal: !visibleModal
            })}>
            {t('auth:text_change_phone_number')}
          </Text>}
          <Text
            style={[styles.textPolicy, styles.resendCode]}
            colorSecondary
            medium
            onPress={() => this.resendVerificationCode()}>
            {t('auth:text_resend_verification_code')}
          </Text>
          <Modal
            visible={visibleModal}
            backgroundColor={colors.gray_modal}
            paddingContent={margin.base}
            ratioHeight={0.6}
            topRightElement={(
              <TouchableOpacity onPress={() => this.changeNewPhone(new_phone_number)}>
                <Icon name='check' size={18} color={colors.unSelIcon} />
              </TouchableOpacity>
            )}
            setModalVisible={(visible) => this.setState({
              visibleModal: visible
            })}>
            <Text colorSecondary>
              {t('auth:text_change_phone_no')}
            </Text>
            <InputMobile
              autoFormat={true}
              value={phone_number}
              initialCountry={INITIAL_COUNTRY}
              onChangePhoneNumber={({ value, code }) => this.checkInputPhoneValid(value, code, t)}
              error={errors && errors.phone_number}
            />
          </Modal>
        </Container>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
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
    marginTop: margin.base * 1.2,
    textAlign: 'center',
  },
  containerCode: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    borderColor: colors.border_color,
    borderRadius: 4,
    fontSize: sizes.h3,
    color: colors.white,
    textAlign: 'center',
    width: 28,
    height: 42
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

export default connect(mapStateToProps)(VerifyPhoneScreen);
