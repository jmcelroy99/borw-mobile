import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Header, Text, ThemedView } from 'src/components';
import Container from 'src/containers/Container';
import Input from 'src/containers/input/Input';
import Button from 'src/containers/Button';
import { IconHeader, TextHeader } from 'src/containers/HeaderComponent';
import { authStack } from 'src/config/navigator';
import { forgotPassword } from 'src/modules/auth/actions';
import { authSelector } from 'src/modules/auth/selectors';
import { margin } from 'src/components/config/spacing';
import { lineHeights } from 'src/components/config/fonts';
import * as colors from 'src/components/config/colors';

class ForgotScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      phone_number: '',
      isSubmit: null,
      error: ''
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.getOTPSuccess !== this.props.auth.getOTPSuccess &&
      prevState.isSubmit === this.state.isSubmit && this.state.isSubmit) {
      this.props.navigation.navigate(authStack.verify_phone, {
        isForgot: true,
        phoneNumber: this.state.phone_number
      })
    }
  }

  handleSubmit = (t) => {
    const { phone_number } = this.state;
    if (phone_number != '') {
      this.setState({
        ...this.state,
        error: '',
        isSubmit: true
      }, () => {
        this.props.dispatch(forgotPassword(phone_number));
      })
    } else {
      this.setState({
        ...this.state,
        error: t('auth:text_error_empty_phone_number')
      })
    }
  };

  render() {
    const {
      auth: { pending, pendingForgotPassword, forgotPasswordError },
      screenProps: { t, theme },
    } = this.props;

    const { phone_number, error } = this.state;
    const { message, errors } = forgotPasswordError;

    return (
      <ThemedView isFullView>
        <Header
          backgroundColor={colors.black}
          leftComponent={<IconHeader color={colors.unSelIcon} />}
          centerComponent={<TextHeader titleStyle={{ color: colors.white }} title={t('auth:text_resetting_password')} />}
        />
        <ScrollView>
          <KeyboardAvoidingView>
            <Container>
              <Text style={styles.description} colorSecondary>
                {t('auth:text_desc_forgot')}
              </Text>
              <Input
                placeholder={t('inputs:text_example_username')}
                value={phone_number}
                onChangeText={value => this.setState({ phone_number: value })}
                error={error && error}
              />
              <Button
                buttonStyle={{ backgroundColor: colors.selIcon }}
                titleStyle={{ color: colors.black }}
                title={t('auth:text_reset')}
                containerStyle={styles.margin}
                loading={pending}
                onPress={() => this.handleSubmit(t)}
              />
            </Container>
          </KeyboardAvoidingView>
        </ScrollView>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  description: {
    lineHeight: lineHeights.h4,
    marginBottom: margin.big - margin.base,
  },
  margin: {
    marginVertical: margin.big,
  },
});

const mapStateToProps = state => {
  return {
    auth: authSelector(state),
  };
};

export default connect(mapStateToProps)(ForgotScreen);
