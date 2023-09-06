import { Platform } from "react-native";
import { setBadgeCount } from 'react-native-notification-badge';

export const isLineEndColumn = (visit = 0, length = 0, col = 0) => {
  if (length < 1 || col < 1 || (length === col)) {
    return false;
  }
  const countRow = Math.ceil(length / col);
  const countVisit = Math.ceil((visit + 1) / col);
  return countRow === countVisit;
};

export const uniqueImagesArr = (data) => {
  const filteredArr = data.reduce((acc, current) => {
    const x = acc.find(item => item.uri == current.uri);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
  return filteredArr;
}

export const setBadgeNumber = (number) => {
  if (Platform.OS == 'ios') {
    setBadgeCount(number)
  }
}

export const isVideo = (url) => {
  if (!url)
    return false;
  if (url.match(/\.(jpg|jpeg|png|gif)$/))
    return false;
  return true;
}