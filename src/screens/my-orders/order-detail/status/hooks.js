import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { ORDER_STATUS } from 'src/utils/status-orders';
const _orderStatusKeys = Object.keys(ORDER_STATUS)
const _getValueForField = (newStatus, field) => {
  newStatus.find(e => e == field) ? true : false
}
const useStatusFacade = (status, isCompleted) => {
  const [isCollapse, setCollapse] = useState(_orderStatusKeys.map(key => ({
    name: ORDER_STATUS[key],
    isExpand: false
  })));
  const [newStatus, setNewStatus] = useState([])

  useEffect(() => {
    if (status) {
      const newStatus = []
      for (let index = 0; index < status.length; index++) {
        const tempStatus = status[index].split('|')[0];
        newStatus.push(tempStatus)
      }
      setNewStatus(newStatus)
    }
  }, [status])

  useEffect(() => {
    _onUpdateStatus()
  }, [newStatus])

  useEffect(() => {
    if (isCompleted) {
      formik.setFieldValue('order_completed', isCompleted)
    }
  }, [isCompleted])

  const _onUpdateStatus = () => {
    _orderStatusKeys.forEach(key => {
      formik.setFieldValue(key,_getValueForField(newStatus, key))
    })
  }
  const _initFormValues = {}
  _orderStatusKeys.forEach(key => {
    _initFormValues[key] = _getValueForField(newStatus, key)
  })

  const formik = useFormik({
    initialValues: {
      ..._initFormValues,
      waiting: true,
      order_completed: isCompleted,
    },
    onSubmit: values => {

    },
  })

  const _onChangeCollapse = (statusCode) => {
    const index = isCollapse.findIndex(i => i.name == statusCode);
    if (index != -1) {
      const temp = [...isCollapse]
      temp[index].isExpand = !temp[index].isExpand
      setCollapse(temp);
    }
  }

  return {
    isCollapse,
    formik,
    _onChangeCollapse,
  }
}

export {
  useStatusFacade
}