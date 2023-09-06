import React from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Linking,
  Dimensions,
  View,
} from 'react-native';
import { Header, Text, ThemedView } from 'src/components';
import Container from 'src/containers/Container';
import Input from 'src/containers/input/Input';
import InputMobile from 'src/containers/input/InputMobile';
import Button from 'src/containers/Button';
import TextHtml from 'src/containers/TextHtml';
import { TextHeader, IconHeader } from 'src/containers/HeaderComponent';
import ModalVerify from './containers/ModalVerify';

import { signUpWithEmail } from 'src/modules/auth/actions';
import { authSelector } from 'src/modules/auth/selectors';
import { configsSelector, languageSelector } from 'src/modules/common/selectors';
import * as colors from 'src/components/config/colors';
import { Dropdown } from 'react-native-material-dropdown';
import { authStack } from 'src/config/navigator';
import { margin, padding, borderRadius } from 'src/components/config/spacing';
import { lineHeights } from 'src/components/config/fonts';
import { changeColor } from 'src/utils/text-html';
import { INITIAL_COUNTRY } from 'src/config/config-input-phone-number';
import { isValidName, isValidPassword, isNotContainNumber, isValidEmail, isEqual } from 'src/utils/string';
import { legalLink } from 'src/config/api';
import { changeLanguage } from 'src/modules/common/actions';

class RegisterScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        country_no: '',
        confirm_password: '',
        phoneNumber: '',
      },
      user: null,
      lang: '',
      confirmResult: null,
      visibleModal: false,
      loading: false,
      error: {
        message: null,
        errors: null,
      },
    };
    this.confirmation = null;
  }

  languages = [
    {
      label: this.props.screenProps.t('setting:text_english'),
      value: 'en'
    },
    {
      label: this.props.screenProps.t('setting:text_greek'),
      value: 'el'
    },
    {
      label: this.props.screenProps.t('setting:text_italian'),
      value: 'it'
    },
  ]

  componentDidMount() {
    switch (this.props.language) {
      case this.languages[0].value:
        this.setState({
          lang: this.languages[0].value
        })
        break;
      case this.languages[1].value:
        this.setState({
          lang: this.languages[1].value
        })
        break;
      case this.languages[2].value:
        this.setState({
          lang: this.languages[2].value
        })
        break;
      default:
        break;
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.auth.userCreated && prevProps.auth.userCreated != this.props.auth.userCreated) {
      const { country_no, phoneNumber } = this.state.data
      this.props.navigation.navigate(authStack.verify_phone, {
        phone: country_no + phoneNumber
      })
    } else if (prevProps.auth.signUpError != this.props.auth.signUpError) {
      this.setState({
        ...this.state,
        error: {
          message: this.props.auth.signUpError
        }
      })
    }
    if (this.props.language != prevProps.language) {
      this.languages = [
        {
          label: this.props.screenProps.t('setting:text_english'),
          value: 'en'
        },
        {
          label: this.props.screenProps.t('setting:text_greek'),
          value: 'el'
        },
        {
          label: this.props.screenProps.t('setting:text_italian'),
          value: 'it'
        },
      ]
      switch (this.props.language) {
        case this.languages[0].value:
          this.setState({
            lang: this.languages[0].value
          })
          break;
        case this.languages[1].value:
          this.setState({
            lang: this.languages[1].value
          })
          break;
        case this.languages[2].value:
          this.setState({
            lang: this.languages[2].value
          })
          break;
        default:
          break;
      }
    }
  }

  changeData = (value) => {
    this.setState({
      data: {
        ...this.state.data,
        ...value,
      },
      error: {
        message: null,
        errors: null
      }
    });
  };

  register = () => {
    const { enablePhoneNumber } = this.props;
    const { data } = this.state;
    let payload = data;
    if (enablePhoneNumber) {
      const user_phoneNumber = data.phoneNumber.includes(data.country_no)
        ? data.phoneNumber
        : data.country_no + data.phoneNumber;
      payload = Object.assign(data, {
        enable_phoneNumber: true,
        digits_phone: user_phoneNumber,
        digt_countrycode: data.country_no,
        digits_phone_no: data.phoneNumber,
      });
    }
    this.setState({ loading: false });
    this.props.dispatch(signUpWithEmail(payload));
  };

  checkFormatFirstName = (value, t) => {
    if (!isValidName(value)) {
      this.setState({
        error: {
          errors: {
            ...this.state.error.errors,
            firstName: t('error:text_warning_name_contains_number_space'),
          }
        }
      })
      return;
    } else if (value.length < 2) {
      this.setState({
        error: {
          errors: {
            ...this.state.error.errors,
            firstName: t('error:text_minimum_length_for_first_name'),
          }
        }
      })
    } else if (value.length > 32) {
      this.setState({
        error: {
          errors: {
            ...this.state.error.errors,
            firstName: t('error:text_maximum_length_for_first_name'),
          }
        }
      })
    } else {
      this.setState({
        error: {
          errors: {
            ...this.state.error.errors,
            firstName: null,
          }
        }
      })
    }
  }

  checkFormatEmail = (value, t) => {
    if (!isValidEmail(value)) {
      this.setState({
        error: {
          errors: {
            ...this.state.error.errors,
            email: t('error:text_email_format_wrong'),
          }
        }
      })
    } else {
      this.setState({
        error: {
          errors: {
            ...this.state.error.errors,
            email: null,
          }
        }
      })
    }
  }

  _onChangeLang = (value) => {
    this.setState({
      lang: value
    })
    switch (value) {
      case this.languages[0].value:
        this.props.dispatch(changeLanguage(this.languages[0].value))
        break;
      case this.languages[1].value:
        this.props.dispatch(changeLanguage(this.languages[1].value))
        break;
      case this.languages[2].value:
        this.props.dispatch(changeLanguage(this.languages[2].value))
        break;
      default:
        break;
    }
  }

  checkConfirmPassword = (password, confirmPassword, t) => {
    if (!isEqual(password, confirmPassword)) {
      this.setState({
        error: {
          errors: {
            ...this.state.error.errors,
            confirm_password: t('error:text_password_and_confirm_mismatch'),
          }
        }
      })
    } else if (!isValidPassword(confirmPassword)) {
      this.setState({
        error: {
          errors: {
            ...this.state.error.errors,
            confirm_password: 'Password must have at least 8 characters, including uppercase/lowercase and number',
          }
        }
      })
    } else {
      this.setState({
        error: {
          errors: {
            ...this.state.error.errors,
            confirm_password: null,
          }
        }
      })
    }
  }

  checkFormaLastName = (value, t) => {
    if (!isValidName(value)) {
      this.setState({
        error: {
          errors: {
            ...this.state.error.errors,
            lastName: t('error:text_warning_name_contains_number_space'),
          }
        }
      })
      return;
    } else if (value.length < 2) {
      this.setState({
        error: {
          errors: {
            ...this.state.error.errors,
            lastName: t('error:text_minimum_length_for_last_name'),
          }
        }
      })
    } else if (value.length > 32) {
      this.setState({
        error: {
          errors: {
            ...this.state.error.errors,
            lastName: t('error:text_maximum_length_for_last_name'),
          }
        }
      })
    } else {
      this.setState({
        error: {
          errors: {
            ...this.state.error.errors,
            lastName: null,
          }
        }
      })
    }
  }

  checkFormatPassword = (value, t) => {
    if (!isValidPassword(value)) {
      this.setState({
        error: {
          errors: {
            ...this.state.error.errors,
            password: t('error:text_error_password'),
          }
        }
      }, () => {
        if (this.state.data.confirm_password && this.state.data.confirm_password != '') {
          this.checkConfirmPassword(this.state.data.password, this.state.data.confirm_password, t)
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
      }, () => {
        if (this.state.data.confirm_password && this.state.data.confirm_password != '') {
          this.checkConfirmPassword(this.state.data.password, this.state.data.confirm_password, t)
        }
      })
    }
  }

  checkValidation = (t) => {
    const isEmpty = this.state.data.firstName != '' && this.state.data.lastName != ''
      && this.state.data.email != '' && this.state.data.password != '' &&
      this.state.data.confirm_password != '' && this.state.data.phoneNumber != '';

    if (!this.state.error) {
      return;
    }

    const hasError = this.state.error.errors && !!(this.state.error.errors.firstName || this.state.error.errors.lastName
      || this.state.error.errors.email || this.state.error.errors.password ||
      this.state.error.errors.confirm_password)

    if (!isEmpty) {
      this.setState({
        error: {
          ...this.state.error,
          message: t('error:text_required_fill_in')
        }
      })
    } else if (hasError) {
      this.setState({
        error: {
          ...this.state.error,
          message: t('error:text_has_error_sign_up')
        }
      })
    } else {
      let payload = { ...this.state.data };

      if (payload.phoneNumber.charAt(0) != '+') {
        payload.phoneNumber = payload.country_no + payload.phoneNumber
      }
      delete payload.confirm_password;
      delete payload.country_no;

      this.props.dispatch(signUpWithEmail(payload));
      this.setState({ error: { message: '' } })
    }
  }

  render() {
    const {
      auth: { pending },
      screenProps: { t, theme },
      enablePhoneNumber,
    } = this.props;
    const {
      data: {
        email,
        firstName,
        lastName,
        phoneNumber,
        country_no,
        password,
        confirm_password,
      },
      error: { message, errors },
      visibleModal,
      loading,
      user,
      confirmResult,
      lang,
    } = this.state;
    const visible = visibleModal || !!(!user && confirmResult);
    return (
      <ThemedView isFullView>
        <Header
          backgroundColor={colors.black}
          leftComponent={<IconHeader color={colors.unSelIcon} />}
          centerComponent={<TextHeader titleStyle={{ color: colors.white }} title={t('common:text_sign_up')} />}
        />
        <KeyboardAvoidingView
          style={styles.keyboard}>
          <ScrollView contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}>
            <Container>
              {message ? (
                <TextHtml
                  value={message}
                  style={changeColor(theme.colors.error)}
                />
              ) : null}
              <Input
                label={t('auth:text_input_first_name')}
                value={firstName}
                onChangeText={(value) => {
                  if (value.length <= 32) {
                    this.changeData({
                      firstName: value
                    });
                  }
                  this.checkFormatFirstName(value, t)
                }}
                error={errors && errors.firstName}
              />
              <Input
                label={t('auth:text_input_last_name')}
                value={lastName}
                onChangeText={(value) => {
                  if (value.length <= 32) {
                    this.changeData({ lastName: value });
                  }
                  this.checkFormaLastName(value, t);
                }}
                error={errors && errors.lastName}
              />
              {enablePhoneNumber ? (
                <InputMobile
                  backgroundColor={colors.black}
                  value={phoneNumber}
                  initialCountry={INITIAL_COUNTRY}
                  onChangePhoneNumber={({ value, code }) => this.changeData({ phoneNumber: value, country_no: code })}
                  error={errors && errors.phoneNumber}
                />
              ) : null}
              <Input
                label={t('auth:text_input_email')}
                value={email}
                notCapital={true}
                onChangeText={(value) => {
                  this.changeData({ email: value });
                  this.checkFormatEmail(value, t)
                }}
                error={errors && errors.email}
              />
              <Input
                label={t('auth:text_input_password')}
                value={password}
                secureTextEntry
                onChangeText={(value) => {
                  this.changeData({ password: value });
                  this.checkFormatPassword(value, t);
                }}
                error={errors && errors.password}
              />
              <Input
                label={t('auth:text_re_input_password')}
                value={confirm_password}
                secureTextEntry
                onChangeText={(value) => {
                  this.changeData({ confirm_password: value });
                  this.checkConfirmPassword(this.state.data.password, value, t)
                }}
                error={errors && errors.confirm_password}
              />
              <View style={styles.element}>
                <Text h4 colorSecondary h4Style={{ flex: 1, }}>{t('setting:text_system_lang')}</Text>
                <View style={[styles.border, { flex: 0.4 }]}>
                  <Dropdown
                    itemTextStyle={styles.dropdown}
                    style={styles.dropdown}
                    itemColor={colors.white}
                    baseColor={colors.white}
                    selectedItemColor={colors.selIcon}
                    pickerStyle={styles.picker}
                    containerStyle={{ marginTop: -22 }}
                    fontSize={14}
                    value={lang}
                    textColor={colors.white}
                    onChangeText={value => this._onChangeLang(value)}
                    data={this.languages}
                  />
                </View>
              </View>
              <Text style={styles.textPolicy} colorSecondary>{t('auth:text_agree_policy_1')}
                <Text>  </Text>
                <Text style={styles.textPolicyLink} bold underline onPress={() => Linking.openURL(legalLink.privacyPolicy)}>{t('setting:text_privacy_policy')}</Text>
                <Text>  </Text>
                {t('auth:text_agree_policy_2')}
                <Text>  </Text>
                <Text onPress={() => Linking.openURL(legalLink.termsConditions)} underline bold style={styles.textPolicyLink}>{t('auth:text_term_of_service')}</Text>
              </Text>
              <Button
                buttonStyle={{ backgroundColor: colors.selIcon }}
                titleStyle={{ color: colors.black }}
                title={t('auth:text_sign_up_accept')}
                onPress={() => this.checkValidation(t)}
                loading={loading || pending}
              />
              <ModalVerify
                visible={visible}
                type={'register'}
                phone={
                  phoneNumber.includes(country_no)
                    ? phoneNumber
                    : country_no + phoneNumber
                }
                confirmation={confirmResult}
                handleVerify={this.register}
                setModalVisible={(visibleModal) =>
                  this.setState({
                    visibleModal,
                    loading: false,
                    confirmResult: null,
                  })
                }
              />
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
  },
  contentContainer: {
    height: Dimensions.get('screen').height,
  },
  viewSwitch: {
    marginVertical: margin.big,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textPolicy: {
    marginVertical: margin.big,
    lineHeight: lineHeights.h4,
    textAlign: 'center'
  },
  textPolicyLink: {
    marginVertical: margin.big,
    lineHeight: lineHeights.h4,
    textAlign: 'center',
    color: colors.selIcon,
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
  element: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: padding.small
  },
  picker: {
    backgroundColor: colors.black,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: borderRadius.large
  },
  border: {
    height: 52,
    paddingHorizontal: padding.base,
    borderColor: colors.border_color,
    borderWidth: 1,
    borderRadius: borderRadius.base
  },
  dropdown: { 
    fontFamily: 'Lato-regular'
  },
});

const mapStateToProps = (state) => {
  const configs = configsSelector(state);
  return {
    auth: authSelector(state),
    language: languageSelector(state),
    enablePhoneNumber: configs.get('toggleLoginSMS'),
  };
};

export default connect(mapStateToProps)(RegisterScreen);
