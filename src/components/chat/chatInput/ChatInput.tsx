import * as React from "react";

import TextField, { TextFieldProps } from "@material-ui/core/TextField";

import * as styles from "./ChatInput.pcss";

interface ChatInputState {
  chatMessage: string;
}

interface ChatInputProps {
  onChatMessageEnter: (chatmessage: string) => void;
}

export class ChatInput extends React.Component<ChatInputProps, ChatInputState> {
  public state: ChatInputState = {
    chatMessage: "",
  };

  public render() {
    const { chatMessage } = this.state;

    const helperText = `${chatMessage.length} / 140`;

    const textFieldProps: TextFieldProps = {
      error: chatMessage.length > 140,
      fullWidth: true,
      helperText,
      label: "Type your message",
      onChange: this.onChatMessageChange,
      onKeyPress: (ev: any) => {
        if (ev.key === "Enter") {
          ev.preventDefault();
          this.onEnter();
        }
      },
      value: chatMessage,
    };

    return (
      <div className={styles.chatInputContainer}>
        <TextField {...textFieldProps} />
      </div>
    );
  }

  private onChatMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ chatMessage: e.currentTarget.value });
  }

  private onEnter = () => {
    const { chatMessage } = this.state;
    const { onChatMessageEnter } = this.props;
    if (chatMessage && chatMessage.length <= 140) {
      onChatMessageEnter(chatMessage);
      this.setState({ chatMessage: "" });
    }
  }
}
