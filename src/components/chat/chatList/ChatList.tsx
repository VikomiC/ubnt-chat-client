import * as React from "react";

import List from "@material-ui/core/List";

import { Message, User } from "../../../model";
import { ChatMessage } from "../chatMessage/ChatMessage";

import * as styles from "./ChatList.pcss";

interface ChatListProps {
  listRef?: React.Ref<any>;
  user: User;
  messages: Message[];
}

export class ChatList extends React.PureComponent<ChatListProps> {
  public render() {
    const { messages, listRef } = this.props;

    return (
      <List className={styles.chatList} style={{ position: "fixed" }}>
        <div ref={listRef}>
          {messages.map(this.renderMessage)}
        </div>
      </List>
    );
  }

  private renderMessage = (message: Message) => {
    const user = this.props.user;
    return <ChatMessage key={message.id} message={message} user={this.props.user} />;
  }
}
