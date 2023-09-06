import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon as IconComponent } from 'src/components';
import { withNavigation } from 'react-navigation';
import { homeTabs } from 'src/config/navigator';

const Icon = ({ navigation, dispatch, onPress, ...rest }) => {
  const handleClick = () => {
    if (navigation.state.routeName == 'MeScreen') {
      navigation.navigate(homeTabs.home)
    } else {
      navigation.goBack();
    } 
  }

  return (
    <TouchableOpacity onPress={handleClick} style={{ padding: 6 }}>
      <IconComponent name="chevron-left" size={26} isRotateRTL {...rest} />
    </TouchableOpacity>
  );
};

export default withNavigation(Icon);
