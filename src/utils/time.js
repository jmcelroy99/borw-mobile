import moment from 'moment-timezone';

export const timeAgo = (date, tz = 'UTC') => {
  if (!date) {
    return null;
  }
  return moment.tz(date, tz).fromNow();
};

export const getTimeDate = (date, tz = 'UTC') => {
  if (!date) {
    return null;
  }
  return moment.tz(date, tz).format('DD/MM/YYYY [at] hh:mma');
};

export const getRelativeTime = (date, t) => {
  const today = new Date();

  if (date.getDate() == today.getDate() && date.getMonth() &&
    today.getDate() && date.getFullYear() == today.getFullYear()) {
    return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)
  }
  if (date.getDate() == (today.getDate() - 1) && date.getMonth() ==
    today.getMonth() && date.getFullYear() == today.getFullYear()) {
    return t('messaging:text_yesterday') + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)
  }
  return moment(date).format('MMM DD, YYYY HH:MM')
}
