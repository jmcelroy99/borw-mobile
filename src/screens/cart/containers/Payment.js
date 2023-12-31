import React from 'react';

import {connect} from 'react-redux';
import {Map} from 'immutable';
import {withTranslation} from 'react-i18next';

import {StyleSheet, ScrollView} from 'react-native';
import {Text} from 'src/components';
import {Row, Col} from 'src/containers/Gird';
import Button from 'src/containers/Button';
import Heading from 'src/containers/Heading';
import Container from 'src/containers/Container';
import PaymentMethod from './PaymentMethod';
import PaymentForm from './PaymentForm';
import stripe from 'tipsi-stripe';

import {createOrder, updateOrder} from 'src/modules/order/actions';
import {
  selectOrder,
  selectOrderPending,
  selectUpdateOrderPending,
} from 'src/modules/order/selectors';
import {
  selectBillingAddress,
  selectedPaymentMethod,
  cartTotalSelector,
} from 'src/modules/cart/selectors';
import {changeData} from 'src/modules/cart/actions';

import {margin, padding} from 'src/components/config/spacing';
import {validatorAddress} from 'src/modules/cart/validator';
import {red} from 'src/components/config/colors';
import { PUBLISHABLE_KEY } from 'src/config/api';

class Payment extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      errors: Map(),
    };
  }

  componentDidMount() {
    stripe.setOptions({
      publishableKey: PUBLISHABLE_KEY,
    })
  }

  onChange = (key, value) => {
    const {dispatch} = this.props;
    dispatch(changeData(['billing', key], value));
  };

  handleConfirm = async () => {
    const { billing, _onProceedPayment } = this.props;
    const dataBilling = Object.fromEntries(billing);

    const token = await stripe.paymentRequestWithCardForm({
      // Only iOS support this options
      smsAutofillDisabled: true,
      requiredBillingAddressFields: 'full',
      prefilledInformation: {
        billingAddress: {
          name: dataBilling.first_name + ' ' + dataBilling.last_name,
          line1: dataBilling.address_1,
          line2: dataBilling.address_2,
          city: dataBilling.city,
          state: dataBilling.state,
          country: dataBilling.country,
          postalCode: dataBilling.postcode,
          email: dataBilling.email,
        },
      },
    })

    if (token) {
      _onProceedPayment(token, 'stripe')
    }
  };

  render() {
    const {
      pending,
      updatedPending,
      backStep,
      nextStep,
      billing,
      params,
      t,
    } = this.props;
    const {errors} = this.state;

    return (
      <ScrollView>
        <Container>
          <Heading
            title={t('cart:text_payment_method')}
            containerStyle={styles.headerText}
          />
          <Text style={{color: red}}>{errors.get('payment_method')}</Text>
          <PaymentMethod nextStep={nextStep} />
          <PaymentForm
            data={billing}
            onChange={this.onChange}
            errors={errors}
            params={params}
          />
          <Row style={styles.footer}>
            <Col>
              <Button
                onPress={() => backStep()}
                title={t('common:text_back')}
              />
            </Col>
            <Col>
              <Button
                loading={pending || updatedPending}
                onPress={this.handleConfirm}
                title={t('common:text_payment')}
              />
            </Col>
          </Row>
        </Container>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    paddingTop: padding.large,
    paddingBottom: padding.small,
  },
  footer: {
    marginBottom: margin.big,
  },
});

const mapStateToProps = state => ({
  updatedPending: selectUpdateOrderPending(state),
  pending: selectOrderPending(state),
  order: selectOrder(state),
  billing: selectBillingAddress(state),
  selected: selectedPaymentMethod(state),
  total: cartTotalSelector(state),
});

export default connect(mapStateToProps)(withTranslation()(Payment));
