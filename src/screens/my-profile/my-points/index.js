import React from 'react';
import { StyleSheet, View, Dimensions, Image, FlatList, Platform } from 'react-native';
import { ThemedView, Header, IconOrder, Text, LoadingView } from 'src/components';
import Input from 'src/containers/input/Input';
import { TextHeader, IconHeader } from 'src/containers/HeaderComponent';
import Button from 'src/containers/Button';
import Modal from 'react-native-modal';
import moment from 'moment';
import { padding, margin, borderRadius } from 'src/components/config/spacing';
import * as colors from 'src/components/config/colors';
import { images } from 'src/utils/images';
import { useMyPointsFacade } from './hooks';
import { mainStack } from 'src/config/navigator';

const W = Dimensions.get('screen').width;

export default function MyPoints({ screenProps, navigation }) {
  const { t } = screenProps;
  const { isVisible, code, listPoints, loading, userInfo, error, _onShowPopup,
    _onSubmitCode, _onGetActivityName, _onChangeCode, _onChangeVisible, _onNavigateInvite, _onRefreshError } = useMyPointsFacade(navigation, t);

  return (
    <ThemedView isFullView>
      <Header
        backgroundColor={colors.black}
        leftComponent={<IconHeader color={colors.unSelIcon} />}
        centerComponent={<TextHeader titleStyle={{ color: colors.white }} title={t('points:text_my_points')} />}
        rightComponent={
          <IconOrder _onPress={() => navigation.navigate(mainStack.my_orders)} />
        }
      />
      <View style={styles.containerBody}>
        <Image
          resizeMode='contain'
          source={images.share}
          style={styles.shareBanner} />
        <View style={styles.textBanner}>
          <Text h5 h5Style={{ color: colors.black }}>{t('points:text_invite_friend_1')}</Text>
          <Text h5 h5Style={{ color: colors.black }}>{t('points:text_invite_friend_2')}</Text>
        </View>
        <Text style={styles.total} h2 colorSecondary>
          {t('points:text_total_points', { points: userInfo ? userInfo.points : 0, money: userInfo ? userInfo.exchangePoints : 0 })}</Text>

        <View style={styles.containerButton}>
          <Button
            buttonStyle={{ backgroundColor: colors.selIcon }}
            titleStyle={{ color: colors.black }}
            containerStyle={{ flex: 0.4, marginEnd: margin.base }} title={t('points:text_redeem_code')}
            onPress={() => _onChangeVisible()} />
          <Button buttonStyle={{ backgroundColor: colors.selIcon }}
            titleStyle={{ color: colors.black }}
            containerStyle={{ flex: 0.4 }} title={t('points:text_invite_friends')} onPress={() => _onNavigateInvite()} />
        </View>

        <FlatList
          style={styles.content}
          showsVerticalScrollIndicator={false}
          data={listPoints}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <View style={{ marginVertical: margin.base }}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <Text h4 colorSecondary bold style={{ flex: 1 }}>{_onGetActivityName(item)}</Text>
                  <Text h4 colorSecondary>{item.amount && parseInt(item.amount) > 0 ? '+ ' + item.amount : item.amount}</Text>
                </View>
                <Text h5 colorSecondary>{moment(item.createdAt).format('MMM DD, YYYY HH:MM')}</Text>
              </View>
            )
          }}
        />

        <Modal isVisible={isVisible}>
          <View style={styles.containerContent}>
            <Text h2 colorSecondary>{t('points:text_enter_your_code')}</Text>
            <View style={styles.containerInput}>
              <Input
                style={{ color: colors.white }}
                label={t('points:text_input_your_code_here')}
                value={code}
                backgroundColor={colors.gray_modal}
                onChangeText={(value) => {
                  _onChangeCode(value)
                }}
                error={error}
              />
            </View>
            <View style={styles.containerButtons}>
              <Button buttonStyle={{ backgroundColor: colors.selIcon }}
                titleStyle={{ color: colors.black }}
                containerStyle={styles.button} title={t('common:text_submit')} onPress={_onSubmitCode} />
              <Button buttonStyle={{ backgroundColor: colors.selIcon }}
                titleStyle={{ color: colors.black }}
                containerStyle={styles.button} title={t('common:text_cancel')} onPress={() => { _onChangeVisible(); _onRefreshError(null); }} />
            </View>
          </View>
        </Modal>
      </View>
      {loading && <LoadingView />}
    </ThemedView>
  )
}
const bannerWidth = W - 64;
const bannerHeight = (W - 64) * (390 / 580);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: margin.base,
  },
  containerContent: {
    height: 220,
    borderRadius: borderRadius.large,
    paddingVertical: margin.base,
    backgroundColor: colors.gray_modal,
    alignItems: 'center',
  },
  containerHeader: {
    flexDirection: 'row',
    marginEnd: margin.small
  },
  containerInput: {
    alignSelf: 'stretch',
    marginHorizontal: margin.base,
    marginBottom: margin.big
  },
  containerButtons: {
    marginHorizontal: margin.base,
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  containerBody: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: padding.base
  },
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  content: {
    marginTop: margin.big,
    marginHorizontal: margin.big * 1.5,
    flex: 1,
    alignSelf: 'stretch'
  },
  textBanner: {
    position: 'absolute',
    top: bannerHeight / 2 + 20,
    left: 46,
    width: bannerWidth * 0.66
  },
  total: {
    marginBottom: margin.base
  },
  shareBanner: {
    backgroundColor: "white",
    width: bannerWidth,
    height: bannerHeight,
    marginTop: Platform.OS == 'ios' && Dimensions.get('screen').height >= 812 ?  margin.base :  margin.base * 1.6,
    marginBottom: margin.base,
  },
  coupon: {
    width: W - 72
  },
  button: {
    flex: 0.45
  }
})