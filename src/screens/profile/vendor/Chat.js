import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {GiftedChat, InputToolbar} from 'react-native-gifted-chat';
import {Icon} from 'src/components';
import Container from 'src/containers/Container';
import Message from './GiftChat/Message';

import {green, grey1, grey2, grey5} from 'src/components/config/colors';
import {margin, padding, borderRadius} from 'src/components/config/spacing';
import {sizes, lineHeights} from 'src/components/config/fonts';

class Chat extends React.Component {
  state = {
    messages: [],
  };

  componentDidMount() {
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }
  renderMessage = value => {
    return <Message {...value} />;
  };
  renderInputToolbar = value => {
    return <InputToolbar {...value} containerStyle={styles.toolbar} />;
  };
  renderSend = value => {
    const {onSend, text} = value;
    return (
      <TouchableOpacity
        style={styles.send}
        onPress={() => onSend({text: text.trim()}, true)}>
        <Icon name="send" type="font-awesome" color={green} size={18} />
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <Container style={styles.container} disable="all">
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
          renderMessage={this.renderMessage}
          textInputStyle={styles.input}
          textInputProps={{
            numberOfLines: 5,
            placeholderTextColor: grey5,
          }}
          renderInputToolbar={this.renderInputToolbar}
          renderSend={this.renderSend}
          minInputToolbarHeight={112}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    maxHeight: 100,
    minHeight: 46,
    fontSize: sizes.base,
    lineHeight: lineHeights.base,
    marginLeft: 0,
    paddingHorizontal: padding.large,
  },
  toolbar: {
    backgroundColor: grey1,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    marginHorizontal: margin.large,
    borderColor: grey2,
    borderTopWidth: 1,
    borderTopColor: grey2,
    marginBottom: 40,
  },
  send: {
    height: 46,
    justifyContent: 'center',
    paddingHorizontal: padding.large,
  },
});

export default Chat;
