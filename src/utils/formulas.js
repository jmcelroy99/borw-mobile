import moment from 'moment';
import { FORMULAS_CONSTANTS, DISTANCE_CONSTANTS } from 'src/modules/common/constants';

export const getFinalPrice = (rentalPrice) => {
  const rentPrice = parseFloat(rentalPrice)
  const finalPrice = ((rentPrice + FORMULAS_CONSTANTS.STRIPE_FEE_AMOUNT) / FORMULAS_CONSTANTS.STRIPE_CONSTANCE)
  return finalPrice ? parseFloat(finalPrice).toFixed(2) : 0
}

export const getActualReceived = (rentalPrice) => {
  const actual = parseFloat(rentalPrice) * FORMULAS_CONSTANTS.PERCENTAGE_FOR_SELLER
  return actual ? actual.toFixed(2) : 0
}

// Formula to calculate delivery cost by distance
export const calculateDeliverCostCourier = (lat, ulat, lng, ulng) => {
  let d = calculateDistance(lat, ulat, lng, ulng)
  return Math.min(Math.max(d * DISTANCE_CONSTANTS.DISTANCE_FEE, DISTANCE_CONSTANTS.MINIMUM_DELIVERY_FEE), DISTANCE_CONSTANTS.MAXIMUM_DELIVERY_FEE);
}

// Formula to calculate distance 
export const calculateDistance = (lat, ulat, lng, ulng) => {
  let d = 100 * Math.sqrt(Math.pow(lat - ulat, DISTANCE_CONSTANTS.DISTANCE_FEE) + Math.pow(lng - ulng, DISTANCE_CONSTANTS.DISTANCE_FEE))
  return d > 1 ? d.toFixed(1) : d.toFixed(3);
}

export const getFinalPriceForBuyOut = (buyOutPrice) => {
  const result = (parseFloat(buyOutPrice) + FORMULAS_CONSTANTS.STRIPE_FEE_AMOUNT) / FORMULAS_CONSTANTS.STRIPE_CONSTANCE
  return (result ? result.toFixed(2) : 0)
}

export const getFinalPriceForDelivery = (price) => {
  const result = parseFloat(price * FORMULAS_CONSTANTS.DELIVERY_FEE) / FORMULAS_CONSTANTS.STRIPE_CONSTANCE
  return (result ? result.toFixed(2) : 0)
}

export const getFinalPriceForDeliveryForDonation = (price) => {
  const result = parseFloat(price * FORMULAS_CONSTANTS.DELIVERY_FEE + FORMULAS_CONSTANTS.STRIPE_FEE_AMOUNT) / FORMULAS_CONSTANTS.STRIPE_CONSTANCE
  return (result ? result.toFixed(2) : 0)
}

export const getTimeLeft = (durationRent, receivedTime, t) => {
  const date = new Date(receivedTime);
  const deadLine = moment(date).add(durationRent, 'days').toDate()

  const millisec = deadLine.getTime();
  const today = new Date().getTime()

  const diffTime = millisec - today;
  if (diffTime > 0) {
    const duration = moment.duration(diffTime)
    const days = Math.floor(duration.asDays())

    const duration2 = (diffTime - (days * 86400000))
    const hours = moment.duration(duration2).asHours()
    const timer = days + ` ${t('orders:text_days')} ` + hours.toFixed(0) + ` ${t('orders:text_hours')} `

    return timer;
  } else return null
}

export const _onGetStar = value => {
  if (value % 1 === 0) return value
  if (1 < value && value < 2) {
    return 1.5
  } else if (2 < value && value < 3) {
    return 2.5
  } else if (3 < value && value < 4) {
    return 3.5
  } else if (4 < value && value < 5) {
    return 4.5
  } else if (value == 5) {
    return 5
  } else return 0.0
}