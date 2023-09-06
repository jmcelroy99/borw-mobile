import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { sendContactUs } from './actions';

const useContactUsFacade = (t) => {
  const aboutList = [{
    value: t('setting:text_borw_app'),
    name: 'app',
  },
  {
    value: t('setting:text_borw_membership_dropdown'),
    name: 'membership',
  },
  {
    value: t('setting:text_points'),
    name: 'points',
  },
  {
    value: t('setting:text_other_enquiries'),
    name: 'other',
  }];

  const reasonList = [{
    value: t('setting:text_say_thanks'),
    name: 'thanks',
  },
  {
    value: t('setting:text_complaint'),
    name: 'complain',
  },
  {
    value: t('setting:text_report_bug'),
    name: 'bug',
  },
  {
    value: t('setting:text_have_question'),
    name: 'question',
  }];
  const dispatch = useDispatch()
  const [about, setAbout] = useState(aboutList[0])
  const [reason, setReason] = useState(reasonList[0])
  const [shouldValidate, setShouldValidate] = useState(false)
  const [loading, setLoading] = useState(false)
  const state = useSelector(state => state.auth)
  const user = state.toJS().user

  const contactUsValidationSchema = Yup.object().shape({
    detail: Yup.string().trim()
      .required(t('error:text_require_field')),
    email: Yup.string().trim()
      .required(t('error:text_require_field'))
      .email(t('error:text_email_format_wrong')),
  })

  const formik = useFormik({
    initialValues: {
      detail: '',
      email: '',
    },
    validationSchema: contactUsValidationSchema,
    validateOnMount: false,
    onSubmit: values => {
      values.about = about.name
      values.contactType = reason.name
      dispatch(sendContactUs(values))
      setLoading(true)
    },
  })

  useEffect(() => {
    setLoading(false)
  }, [])

  useEffect(() => {
    if (formik.values['detail'] != '') {
      setShouldValidate(true)
    }
  }, [formik.values['detail']])

  useEffect(() => {
    if (user.email) {
      formik.setFieldValue('email', user.email)
    }
  }, [user.email])

  const _onChangeAbout = value => {
    const index = aboutList.findIndex(item => item.value == value);
    setAbout(aboutList[index])
  }

  const _onChangeReason = value => {
    const index = reasonList.findIndex(item => item.value == value);
    setReason(reasonList[index])
  }

  const _onSubmit = () => {
    setShouldValidate(true)
    setTimeout(() => {
      formik.handleSubmit()
    }, 200);
  }

  return {
    aboutList,
    reasonList,
    reason,
    about,
    user,
    formik,
    shouldValidate,
    loading,
    _onSubmit,
    _onChangeReason,
    _onChangeAbout,
  }
}

export {
  useContactUsFacade
}