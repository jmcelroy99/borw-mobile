import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Text, Icon } from 'src/components';
import { borderRadius } from 'src/components/config/spacing';
import * as colors from 'src/components/config/colors';
import { margin, padding } from 'src/components/config/spacing';
import { useCommentsFacade } from './hooks';
import ItemComment from './item-comment';
import { sizes } from 'src/components/config';
import FastImage from 'react-native-fast-image';
import { images } from 'src/utils/images';

export default function Comments({ listComments, _onSendComment, _onDeleteComment, t, ownerId, currentUser, navigation }) {
  const { comment, comments, isExpand, _onCollapse, _onChangeComment, _onShowAllComments } = useCommentsFacade(listComments)
  
  return (
    <View style={styles.container}>
      <View style={styles.comment}>
        <FastImage
          style={styles.image}
          source={currentUser.avatar ? {
            uri: currentUser.avatar,
            priority: FastImage.priority.normal,
          } : images.person}
          resizeMode={FastImage.resizeMode.cover} />
        <TextInput
          style={styles.input}
          value={comment}
          onChangeText={value => _onChangeComment(value)}
          placeholder={t('actions:text_leave_a_comment')}
          placeholderTextColor={colors.text_color} 
          />
        <TouchableOpacity onPress={() => {
          if (comment.trim() != '') {
            _onChangeComment('')
            _onSendComment(comment.trim())
          }
        }}>
          <Text h5 bold h5Style={{ color: (comment == '' || comment.trim() == '') ? colors.text_color : colors.selIcon }}>{t('product:text_send')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        removeClippedSubviews
        maxToRenderPerBatch={5}
        ListFooterComponent={() => {
          if (listComments.length > 5) {
            return (
              <TouchableOpacity style={styles.footer} onPress={!isExpand ? _onShowAllComments : _onCollapse}>
                <Text h4 h4Style={{ color: colors.unSelIcon }}>{t('profile:text_show_all_comments', { count: listComments.length })}</Text>
                <Icon name={!isExpand ? 'keyboard-arrow-down' : 'keyboard-arrow-up'} type='material' size={26} color={colors.unSelIcon} />
              </TouchableOpacity>
            )
          } else return null
        }}
        renderItem={({ item }) => {
          return (
            <ItemComment
              comment={item}
              navigation={navigation}
              ownerId={ownerId}
              userId={currentUser.id}
              _onDeleteComment={id => _onDeleteComment(id)} />
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: margin.base,
    marginBottom: margin.base
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  comment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: margin.base
  },
  footer: {
    alignItems: 'center'
  },
  input: {
    flex: 1,
    fontSize: sizes.h4,
    borderRadius: borderRadius.big,
    backgroundColor: colors.black,
    borderWidth: 2,
    color: colors.white,
    borderColor: colors.text_color,
    marginStart: margin.small,
    marginEnd: margin.small,
    padding: padding.base,
    paddingStart: margin.base * 1.5
  }
})