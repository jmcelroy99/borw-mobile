import React from 'react';
import { StatusBar, View } from 'react-native';
import { ThemedView, Header, LoadingView, Text } from 'src/components';
import { TextHeader, IconHeader } from 'src/containers/HeaderComponent';
import { mainStack } from 'src/config/navigator';
import * as colors from 'src/components/config/colors';
import ListMessages from './list-messages';
import { useMessagingFacade } from './hooks';

export default function Messaging({ screenProps, navigation }) {
  const { t } = screenProps;
  const { loadingGetRooms, currentUser, actualList, _onGetUserInfo } = useMessagingFacade();

  return (
    <ThemedView isFullView>
      <StatusBar translucent barStyle='light-content' backgroundColor="transparent" />
      <Header
        backgroundColor={colors.black}
        leftComponent={<IconHeader color={colors.unSelIcon} />}
        centerComponent={<TextHeader titleStyle={{ color: colors.white }} title={t('messaging:text_messaging')} />}
      />
      {actualList && actualList.length > 0 ? <ListMessages
        t={t}
        user={currentUser}
        list={actualList}
        _onGetUserInfo={id => _onGetUserInfo(id)}
        _onNavigateConversation={(roomName, partner) => {
          navigation.navigate(mainStack.conversation, {
            roomName: roomName,
            partner: partner
          })
        }} /> :
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text h3 colorSecondary>{t('messaging:text_empty_conversation')}</Text>
        </View>}
      {loadingGetRooms && <LoadingView />}
    </ThemedView>
  )
}
