import { useEffect, useState } from "react";
import * as formula from 'src/utils/formulas';

const useOrderActionsFacade = (orderDetail, _onGetImagesOrderForSeller, _onGetImagesOrderForBuyer, t) => {
  const transaction = orderDetail.transaction
  const seller = orderDetail.seller
  const buyer = orderDetail.buyer
  const isCompleted = orderDetail.completed
  const lastAction = orderDetail.passedSteps[orderDetail.passedSteps.length - 1].split('|')[0]
  const [countDownTimer, setCountDown] = useState()

  useEffect(() => {
    if (orderDetail && lastAction && lastAction == 'received_by_buyer' && orderDetail.transaction == 'rent') {
      const receivedTime = orderDetail.passedSteps[orderDetail.passedSteps.length - 1].split('|')[1]
      setCountDown(formula.getTimeLeft(orderDetail.durationTime, receivedTime, t))
    }
  }, [orderDetail])

  return {
    countDownTimer,
    isCompleted,
    lastAction,
    seller,
    buyer,
    transaction
  }
}

export {
  useOrderActionsFacade
}