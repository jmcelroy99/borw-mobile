import { showMessage } from 'react-native-flash-message';
import languages from 'src/locales';

export const getErrorNameFromCode = (code, lang, mess) => {
  if (mess) {
    return 'Payment error. Please contact support.'
  }
  if (!lang)
    lang = "en";
    
  switch (code) {
    case 1004:
      return languages[lang].errors.text_email_invalid
    case 1005:
      return languages[lang].errors.text_password_invalid
    case 1101:
      return languages[lang].errors.text_user_not_found
    case 1103:
      return languages[lang].errors.text_unthorized
    case 1104:
      return languages[lang].errors.text_email_already_signed
    case 1105:
      return languages[lang].errors.text_username_invalid
    case 1106:
      return languages[lang].errors.text_phone_number_already_used
    case 1108:
      return languages[lang].errors.text_deactivated_account
    case 2001:
      return languages[lang].errors.text_phone_number_invalid
    case 2002:
      return languages[lang].errors.text_phone_number_required
    case 2003:
      return languages[lang].errors.text_verification_code_required
    case 2004:
      return languages[lang].errors.text_verification_code_incorrect
    case 2005:
      return languages[lang].errors.text_phone_number_not_found
    case 2009:
      return languages[lang].errors.text_orders_not_yet_completed
    case 3004:
      return languages[lang].errors.text_product_not_found
    case 9998:
      return languages[lang].errors.text_network_request_failed
    case 4002:
      return languages[lang].errors.text_maximum_photos
    case 3005:
      return languages[lang].errors.text_product_being_ordered
    case 2006:
      return languages[lang].errors.text_linked_with_another_user
    case 2007:
      return languages[lang].errors.text_code_is_used
    case 2008:
      return languages[lang].errors.text_redeem_code_incorrect
    case 8000:
      return languages[lang].errors.text_google_sign_in_cancelled
    case 8001:
      return languages[lang].errors.text_google_sign_in_progress
    case 8002:
      return languages[lang].errors.text_play_service_not_available
    case 7999:
      return languages[lang].errors.text_facebook_sign_in_cancelled
    case 8003:
      return languages[lang].errors.text_email_verified
    case 'balance_insufficient':
      return 'Please make sure your Stripe balance can cover the insurance fee of this item.'
    default:
      return languages[lang].errors.text_unknow_error
  }
}

export function handleError(e) {
  showMessage({
    // message: e.code,
    message: e,
    // description: e.message,
    type: 'danger',
  });
}

export function notificationMessage(data) {
  const type = data && data.type ? data.type : 'error';
  const message = data && data.message ? data.message : 'Fail';
  const errors = data && data.errors ? data.errors : {};
  return {
    type,
    message,
    errors,
  };
}
