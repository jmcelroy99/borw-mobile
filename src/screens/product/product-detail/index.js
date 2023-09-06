import React from 'react';
import { Header, ThemedView, LoadingView, IconOrder, ImageFullScreen } from 'src/components';
import { TextHeader, IconHeader } from 'src/containers/HeaderComponent';
import { StyleSheet, View } from 'react-native';
import * as colors from 'src/components/config/colors';
import { margin } from 'src/components/config/spacing';
import ListImages from './list-images';
import Button from 'src/containers/Button';
import { useProductDetailFacade } from './hooks';
import Body from './body';
import { mainStack } from 'src/config/navigator';
import { sizes } from 'src/components/config/fonts';
import Comments from './comments';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function ProductDetail({ screenProps, navigation }) {
  const { t } = screenProps;
  const { productDetail, commentList, likesList, loading, currentUser, shouldShowComments, showFullScreen, firstImage,
   _onSendComment, _onDeleteComment, _onNavigateMessage, _onVerifyUser, _onShowFullScreen, _onChangeFirstImage } = useProductDetailFacade(navigation, t);

  const renderButton = () => {
    if (productDetail) {
      if (productDetail && productDetail.owner) {
        if (productDetail.owner.id == currentUser.id) {
          return (
            <Button
              title={t('product:text_you_own_this_product')}
              disabled
              backgroundColor={colors.grey5}
              containerStyle={styles.button}
              height={70}
              titleStyle={{ color: colors.black }}
              size='huge'
              disabledTitleStyle={{ color: colors.text_color, fontSize: sizes.h4 }}
            />
          )
        }
        if (productDetail.isDonation && !productDetail.added) {
          return (
            <Button
              title={t('product:text_request')}
              containerStyle={styles.button}
              height={70}
              size='huge'
              titleStyle={{ color: colors.black }}
              buttonStyle={{ backgroundColor: colors.selIcon }}
              onPress={() => {
                if (_onVerifyUser()) {
                  navigation.navigate(mainStack.complete_order, {
                    id: productDetail.id,
                    type: 'donation'
                  })
                }
              }}
            />
          )
        } else if (!productDetail.added) {
          if (productDetail.isRent && !productDetail.isBuyOut) {
            return (
              <Button
                title={t('product:text_rent')}
                containerStyle={styles.button}
                height={70}
                size='huge'
                buttonStyle={{ backgroundColor: colors.selIcon }}
                titleStyle={{ color: colors.black }}
                onPress={() => {
                  if (_onVerifyUser()) {
                    navigation.navigate(mainStack.complete_order, {
                      id: productDetail.id,
                      type: 'rent'
                    })
                  }
                }}
              />
            )
          } else if (productDetail.isBuyOut && !productDetail.isRent) {
            return (
              <Button
                title={t('product:text_buy')}
                containerStyle={styles.button}
                height={70}
                backgroundColor={colors.selIcon}
                size='huge'
                titleStyle={{ color: colors.black }}
                buttonStyle={{ backgroundColor: colors.selIcon }}
                onPress={() => {
                  if (_onVerifyUser()) {
                    navigation.navigate(mainStack.complete_order, {
                      id: productDetail.id,
                      type: 'buy'
                    })
                  }
                }}
              />
            )
          } else if (productDetail.isBuyOut && productDetail.isRent) {
            return (
              <View style={{ flexDirection: 'row' }}>
                <Button
                  title={t('product:text_buy')}
                  containerStyle={[styles.button, { flex: 1, }]}
                  height={60}
                  size='huge'
                  titleStyle={{ color: colors.black }}
                  buttonStyle={{ backgroundColor: colors.selIcon }}
                  onPress={() => {
                    if (_onVerifyUser()) {
                      navigation.navigate(mainStack.complete_order, {
                        id: productDetail.id,
                        type: 'buy'
                      })
                    }
                  }}
                />
                <Button
                  title={t('product:text_rent')}
                  containerStyle={[styles.button, { flex: 1 }]}
                  height={60}
                  size='huge'
                  titleStyle={{ color: colors.black }}
                  buttonStyle={{ backgroundColor: colors.selIcon }}
                  onPress={() => {
                    if (_onVerifyUser()) {
                      navigation.navigate(mainStack.complete_order, {
                        id: productDetail.id,
                        type: 'rent'
                      })
                    }
                  }}
                />
              </View>
            )
          }
        } else if (productDetail.added) {
          return (
            <Button
              title={t('product:text_requested')}
              disabled
              containerStyle={styles.button}
              height={70}
              buttonStyle={{ backgroundColor: colors.selIcon }}
              size='huge'
              disabledTitleStyle={{ color: colors.black }}
            />
          )
        }
      }
    } else return null
  }

  if (shouldShowComments && commentList.length > 0 && this.scrollRef) {
    setTimeout(() => {
      this.scrollRef.props.scrollToEnd({ animated: true })
    }, 200);
  }

  return (
    <ThemedView isFullView>
      <Header
        backgroundColor={colors.black}
        leftComponent={<IconHeader color={colors.unSelIcon} />}
        centerComponent={<TextHeader titleStyle={{ color: colors.white }} title={t('product:text_product_detail')} />}
        rightComponent={
          <IconOrder _onPress={() => navigation.navigate(mainStack.my_orders)}/>
        }
      />

      {productDetail &&  <KeyboardAwareScrollView
        innerRef={ref => {
          this.scrollRef = ref
        }}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
        style={styles.keyboard}>
        <ListImages data={productDetail && productDetail.photos ? productDetail.photos : []} t={t} stop={showFullScreen}
          _onChangeFirstImage={(value) => {_onChangeFirstImage(value); _onShowFullScreen(true);}}/>
        {productDetail && <Body userId={currentUser.id} item={productDetail} t={t}
          navigation={navigation} likesList={likesList ? likesList : []}
          _onNavigateMessage={_onNavigateMessage} />}
        <Comments t={t}
          navigation={navigation}
          _onSendComment={(comment) => _onSendComment(comment, productDetail.id)}
          _onDeleteComment={id => _onDeleteComment(id, productDetail.id)}
          ownerId={productDetail && productDetail.owner ? productDetail.owner.id : -1}
          currentUser={currentUser}
          listComments={commentList} />
      </KeyboardAwareScrollView>}
      {loading && <LoadingView />}
      {showFullScreen && <ImageFullScreen firstImage={firstImage}
        listImages={productDetail.photos} _onShowFullScreen={value => _onShowFullScreen(value)} />}
      {renderButton()}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  container: {
    marginBottom: margin.base
  },
  icons: {
    flexDirection: 'row',
    marginEnd: margin.base
  },
  button: {
    alignSelf: 'stretch',
    backgroundColor: colors.grey5
  },
})