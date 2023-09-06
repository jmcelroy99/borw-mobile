import React from 'react';
import { StyleSheet, View, StatusBar, ScrollView, Image, TouchableWithoutFeedback } from 'react-native';
import { Header, ThemedView, Button, LoadingView, Text, Modal } from 'src/components';
import { TextHeader, IconHeader } from 'src/containers/HeaderComponent';
import * as colors from 'src/components/config/colors';
import { margin, padding } from 'src/components/config/spacing';
import { useSettingsFacade } from './hooks';
import MyAccount from './my-account';
import Legal from './legal';
import Support from './support';
import Settings from './settings'
import WebView from 'react-native-webview';
import { useDispatch } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import { icon } from 'src/utils/images';

export default function MeScreen({ screenProps, navigation }) {
  const dispatch = useDispatch()
  const { t } = screenProps;
  const { isLoading, loading, stripe, isVisible, loadingStripe, currencyList, currency, methods, size, sizeList, lang, languages,
    _onWebViewStateChange, _onNavigateMyPoints, _onChangeCurrency, _onChangeByHand, _onChangeByCourier, _onChangeLang, _onContactUs,
    _onChangeVisible, _onLogOutConfirmation, _onAddPaymentMethods, _onNavigateMyRatings, _onChangeSize, _onDeleteConfirm,
    _onNavigateEditProfile, _onNavigateOrder, _onChangeLoadingIndicator, _onOpenLinkUrl, _onNavigateBookmark } = useSettingsFacade(navigation, t, dispatch);

  return (
    <ThemedView isFullView>
      <StatusBar translucent barStyle='light-content' backgroundColor="transparent" />
      <Header
        backgroundColor={colors.black}
        leftComponent={<IconHeader dispatch={dispatch} color={colors.unSelIcon} navigation={navigation} />}
        centerComponent={<TextHeader titleStyle={{ color: colors.white }} title={t('common:text_setting')} />}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <MyAccount t={t}
          _onNavigateEditProfile={_onNavigateEditProfile}
          _onNavigateMyPoints={_onNavigateMyPoints}
          _onAddPaymentMethods={_onAddPaymentMethods}
          _onNavigateMyRatings={_onNavigateMyRatings}
          _onNavigateBookmark={_onNavigateBookmark}
          _onNavigateOrder={_onNavigateOrder} />
        <Legal t={t} _onNavigateLegal={(item) => _onOpenLinkUrl(item)} />
        <Support t={t} _onOpenUrl={(item) => _onOpenLinkUrl(item)} _onContactUs={_onContactUs} />
        <Settings
          t={t}
          size={size}
          sizesList={sizeList}
          currencyList={currencyList}
          currency={currency}
          methods={methods}
          lang={lang}
          languages={languages}
          _onChangeLang={value => _onChangeLang(value)}
          _onChangeSize={value => _onChangeSize(value)}
          _onChangeByHand={value => _onChangeByHand(value)}
          _onChangeByCourier={value => _onChangeByCourier(value)}
          _onChangeCurrency={value => _onChangeCurrency(value)} />
        <Button titleStyle={{ color: colors.black }} buttonStyle={{ backgroundColor: colors.selIcon }}
          style={{ marginTop: margin.big }} title={t('common:text_log_out')} onPress={_onLogOutConfirmation} />
        <Button titleStyle={{ color: colors.black }} buttonStyle={{ backgroundColor: colors.selIcon }}
          style={{ marginTop: margin.base }} title={t('common:text_delete_account')} onPress={_onDeleteConfirm} />
        <View style={styles.viewSocial}>
          <TouchableWithoutFeedback onPress={() => _onOpenLinkUrl('twitter')}>
            <Image source={icon.twitter} style={styles.icon} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => _onOpenLinkUrl('instagram')}>
            <Image source={icon.instagram} style={styles.icon} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => _onOpenLinkUrl('facebook')}>
            <Image source={icon.facebook} style={styles.icon} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => _onOpenLinkUrl('linkedin')}>
            <Image source={icon.linkedin} style={styles.icon} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => _onOpenLinkUrl('youtube')}>
            <Image source={icon.youtube} style={styles.icon} />
          </TouchableWithoutFeedback>
        </View>
        <Text h6 colorThird style={styles.copyright}>{t('common:text_all_right_reserved')}</Text>
        <Modal
          visible={isVisible}
          headerStyle={{ marginTop: Platform.OS === 'android' ? 0 : 0, paddingTop: padding.big * 1.5, backgroundColor: colors.black }}
          setModalVisible={_onChangeVisible}
          ratioHeight={1}>
          <WebView
            source={{ uri: stripe }}
            scalesPageToFit
            onLoadStart={() => _onChangeLoadingIndicator(true)}
            onLoadEnd={() => _onChangeLoadingIndicator(false)}
            javaScriptEnabled
            bounces={false}
            onNavigationStateChange={response => {
              _onWebViewStateChange(response.url)
            }}
            javaScriptEnabledAndroid
          />
          {loadingStripe &&
            <View style={styles.loading}>
              <ActivityIndicator
                color={colors.selIcon}
                size='large' />
              <Text h4 colorSecondary h4Style={{ marginTop: margin.base }}>{t('notifications:text_taking_to_stripe')}</Text>
            </View>}
        </Modal>
      </ScrollView>
      {loading && <LoadingView />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  viewContent: {
    marginTop: margin.large,
    marginBottom: margin.big,
  },
  viewSocial: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: margin.large + 4,
  },
  socialIconStyle: {
    width: 32,
    height: 32,
    margin: 0,
    marginHorizontal: margin.small / 2,
    paddingTop: 0,
    paddingBottom: 0,
  },
  copyright: {
    textAlign: 'center',
  },
  container: {
    justifyContent: 'flex-start',
    paddingTop: padding.base,
    paddingHorizontal: margin.base
  },
  loading: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    zIndex: 9999,
    alignItems: 'center'
  },
  icon: {
    width: 32,
    height: 46,
  }
});
