import * as React from "react";

import { Action, Message, NewMessage, User } from "../../model";
import { SocketService } from "../../services/SocketService";

import { ChatInput } from "./chatInput/ChatInput";
import { ChatList } from "./chatList/ChatList";

import * as styles from "./Chat.pcss";

interface ChatProps {
  socketService: SocketService;
  user?: User;
}

interface ChatState {
  messages: Message[];
}

export class Chat extends React.Component<ChatProps, ChatState> {
  public state: ChatState = {
    messages: [],
  };

  private listElement: HTMLDivElement | null = null;

  public componentDidMount() {
    this.props.socketService.onMessage(
      (receivedMessage: Message) => {
        const { messages: oldMessages } = this.state;
        const messages = [...oldMessages, receivedMessage];
        this.setState({ messages }, this.scrollToBottom);
      },
      (disconnectMessage: Message) => {
        const { messages: oldMessages } = this.state;
        const messages: Message[] = [...oldMessages, disconnectMessage];
        this.setState({ messages }, this.scrollToBottom);
      },
    );
  }

  public componentWillReceiveProps({ user: nextUser }: ChatProps) {
    const { user } = this.props;
    if (nextUser && user && nextUser.nickname !== user.nickname) {
      this.sendNotification(
        Action.RENAME,
        {
          nickname: nextUser.nickname,
          previousNickname: user.nickname,
        },
        nextUser,
      );
    } else if (!user && !nextUser) {
      this.setState({
        messages: [],
      });
    } else if (!user && nextUser) {
      this.setState({
        messages: [],
      });
      this.sendNotification(Action.JOINED, null, nextUser);
    }
  }

  public render() {
    const { user } = this.props;
    const { messages } = this.state;
    if (!user) {
      return null;
    }
    return (
      <div className={styles.chatContainer}>
        <ChatList messages={messages} user={user} listRef={(e: HTMLDivElement) => (this.listElement = e)} />
        <ChatInput onChatMessageEnter={this.onChatMessageEnter} />
      </div>
    );
  }

  private sendNotification(action: Action, params: any, user?: User): void {
    if (!user) {
      return;
    }

    let message: NewMessage | null = null;
    if (action === Action.JOINED) {
      message = {
        action,
        from: user,
      };
    } else if (action === Action.RENAME) {
      message = {
        action,
        content: params,
        from: user,
      };
    }

    if (message) {
      this.props.socketService.send(message);
    }
  }

  private scrollToBottom = () => {
    if (!this.listElement) {
      return;
    }

    // evil hack, but there seems to be way to get
    // the native root element of the List component
    const parent = this.listElement.parentElement;

    if (!parent) {
      return;
    }

    parent.scrollTop = parent.scrollHeight;
  }

  private onChatMessageEnter = (message: string) => {
    const { user } = this.props;

    this.props.socketService.send({
      content: message,
      from: user,
    });
  }
}
