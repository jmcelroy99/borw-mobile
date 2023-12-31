import React from 'react';
import { connect } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import omit from 'lodash/omit';

import { StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import { ThemedView, Header } from 'src/components';
import { TextHeader, IconHeader } from 'src/containers/HeaderComponent';
import Container from 'src/containers/Container';
import Input from 'src/containers/input/Input';
import Button from 'src/containers/Button';
import MapView from 'react-native-maps';

import { authSelector } from 'src/modules/auth/selectors';
import { updateCustomer, updateUserSuccess } from 'src/modules/auth/actions';
import { validatorUpdateAccount } from 'src/modules/auth/validator';

import { margin } from 'src/components/config/spacing';

class EditAccount extends React.Component {
  constructor(props) {
    super(props);

    const {
      auth: { user },
    } = props;

    this.state = {
      data: {
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        bio_desc: user.bio || '',
        phone: user.phone || '0934922034',
        email: user.user_email || '',
      },
      errors: null,
    };
  }

  handleSaveCustomer = () => {
    const {
      screenProps: { t },
      dispatch,
    } = this.props;
    const { data } = this.state;
    const errors = validatorUpdateAccount(data);
    if (errors.size > 0) {
      this.setState({
        errors: errors.toJS(),
      });
      showMessage({
        message: t('notifications:text_fill_value'),
        type: 'danger',
      });
    } else {
      this.setState({
        errors: null,
      });
      dispatch(updateCustomer(data, this.saveDataUser));
    }
  };
  saveDataUser = () => {
    const { dispatch } = this.props;
    const { data } = this.state;
    const user_email = data.email;
    dispatch(
      updateUserSuccess({
        ...omit(data, ['email']),
        user_email,
      }),
    );
  };

  changeData(key, value) {
    const { data } = this.state;
    this.setState({
      data: {
        ...data,
        [key]: value,
      },
    });
  }
  render() {
    const {
      screenProps: { t },
      auth: { pendingUpdateCustomer },
    } = this.props;
    const { data, errors } = this.state;
    const { first_name, last_name, bio_desc, phone, email } = data;

    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader />}
          centerComponent={
            <TextHeader title={t('profile:text_edit_account')} />
          }
        />
        <KeyboardAvoidingView style={styles.keyboard}>
          <ScrollView>
            <Container>
              <Input
                label={t('inputs:text_name')}
                value={first_name}
                onChangeText={value => this.changeData('first_name', value)}
                error={errors && errors.first_name}
              />
              <Input
                label={t('inputs:text_surname')}
                value={last_name}
                onChangeText={value => this.changeData('last_name', value)}
                error={errors && errors.last_name}
              />
              <Input
                label={t('inputs:text_bio_desc')}
                value={bio_desc}
                multiline={true}
                onChangeText={value => this.changeData('bio_desc', value)}
                error={errors && errors.bio_desc}
              />
              <Input
                label={t('inputs:text_email_address')}
                value={email}
                onChangeText={value => this.changeData('email', value)}
                error={errors && errors.email}
                keyboardType="email-address"
              />
              <Input
                label={t('inputs:text_phone_number')}
                value={phone}
                editable={false}
                onChangeText={value => this.changeData('phone', value)}
                error={errors && errors.phone}
                keyboardType="numeric"
              />
              <MapView
                style={styles.address}
                initialRegion={{
                  latitude: 37.78824,
                  longitude: -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              />
              <Button
                title={t('common:text_save')}
                containerStyle={styles.button}
                loading={pendingUpdateCustomer}
                onPress={this.handleSaveCustomer}
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
  description: {
    marginVertical: 4,
  },
  button: {
    marginVertical: margin.big,
  },
  phoneNumber: {
    marginHorizontal: 16,
  },
  address: {
    height: 240, 
    alignSelf: 'stretch', 
    marginHorizontal: 16,
    marginTop: 16
  },
});

const mapStateToProps = state => {
  return {
    auth: authSelector(state),
  };
};

export default connect(
  mapStateToProps,
  null,
)(EditAccount);
