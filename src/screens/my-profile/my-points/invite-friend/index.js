import React from 'react';
import { StyleSheet, View, Dimensions, Image, ScrollView } from 'react-native';
import { ThemedView, Header, Icon, Text, IconOrder } from 'src/components';
import { TextHeader, IconHeader } from 'src/containers/HeaderComponent';
import { padding, margin } from 'src/components/config/spacing';
import * as colors from 'src/components/config/colors';
import { images } from 'src/utils/images';
import { useInviteFriendFacade } from './hooks';
import global from 'src/utils/global';
import { mainStack } from 'src/config/navigator';
import Button from 'src/containers/Button';

const W = Dimensions.get('screen').width

export default function InviteFriend({ screenProps, navigation }) {
  const { t } = screenProps;
  const { _onShareLink } = useInviteFriendFacade(t);

  return (
    <ThemedView isFullView>
      <Header
        backgroundColor={colors.black}
        leftComponent={<IconHeader color={colors.unSelIcon} />}
        centerComponent={<TextHeader titleStyle={{ color: colors.white }} title={t('invites:text_invite_your_friend_title')} />}
        rightComponent={
          <IconOrder _onPress={() => navigation.navigate(mainStack.my_orders)} />
        }
      />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.containerBody}>
        <Image
          resizeMode='contain'
          source={images.share}
          style={styles.shareBanner} />

        <View style={styles.containerInfo}>
          <View style={styles.row}>
            <View style={styles.index}>
              <Text h3 colorSecondary h3Style={styles.textIndex}>1</Text>
            </View>
            <Text style={styles.total} h4 colorSecondary>{t('invites:text_invite_your_friend_1')}</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.index}>
              <Text h3 colorSecondary h3Style={styles.textIndex}>2</Text>
            </View>
            <Text style={styles.total} h4 colorSecondary>{t('invites:text_invite_your_friend_2')}</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.index}>
              <Text h3 colorSecondary h3Style={styles.textIndex}>3</Text>
            </View>
            <Text style={styles.total} h4 colorSecondary>{t('invites:text_invite_your_friend_3')}</Text>
          </View>

          <View style={[styles.row, { marginTop: margin.big, alignItems: 'center', alignSelf: 'stretch', justifyContent: 'center' }]}>
            <Text style={styles.total} h4 colorSecondary>{t('invites:text_invite_your_friend_code')}</Text>
            <Text style={styles.inviteCode} h4 colorSecondary>{global.getUser() && global.getUser().invitationCode}</Text>
          </View>

          <View style={styles.inviteButton}>
            <Button buttonStyle={{ backgroundColor: colors.selIcon }}
              titleStyle={{ color: colors.black }}
              style={styles.buttonShare} title={t('invites:text_get_invitation_link')} onPress={() => _onShareLink()} />
          </View>

        </View>
      </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: margin.base,
  },
  containerBody: {
    alignItems: 'center',
    paddingHorizontal: padding.big,
    paddingBottom: padding.base
  },
  containerInfo: {
    alignItems: 'flex-start',
    marginHorizontal: margin.base
  },
  containerShare: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: margin.big,
    marginBottom: margin.base
  },
  shareBanner: {
    width: W - 64,
    height: 300,
  },
  inviteButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: margin.big
  },
  share: {
    color: colors.yellow_invite,
    marginEnd: margin.tiny
  },
  row: {
    flexDirection: 'row',
    marginBottom: margin.base
  },
  textIndex: {
    flex: 1,
    color: colors.yellow_invite
  },
  inviteCode: {
    backgroundColor: colors.yellow_invite,
    marginStart: margin.base,
    textAlign: 'center',
    paddingTop: margin.base * 0.5,
    width: 80,
    height: 42
  },
  index: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: 'center',
    borderColor: colors.yellow_invite,
    marginEnd: margin.base
  },
  buttonShare: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: padding.small
  }
})
