import * as React from "react";

import Button, { ButtonProps } from "@material-ui/core/Button";
import Modal, { ModalProps } from "@material-ui/core/Modal";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { Nickname, ResponseType } from "../../model";
import { SocketService } from "../../services/SocketService";

import * as styles from "./UserDialog.pcss";

export interface UserDialogProps {
  isOpen: boolean;
  socketService: SocketService;
  onNicknameSet: (nickname: string) => void;
  onNicknameChange: (nickname: string) => void;
  closeDialog: () => void;
  initialNickname?: string;
}

interface UserDialogState {
  errorMessage: string;
  nickname?: string | null;
}

export class UserDialog extends React.Component<UserDialogProps, UserDialogState> {
  constructor(props: UserDialogProps) {
    super(props);

    this.state = {
      errorMessage: "",
      nickname: null,
    };
  }

  public componentDidMount() {
    this.props.socketService.onNickname((receivedMessage: Nickname) => {
      if (receivedMessage.type === ResponseType.Error) {
        this.setState({
          errorMessage: receivedMessage.content || "",
        });
      } else if (receivedMessage.type === ResponseType.Success) {
        const newNickname = receivedMessage.nickname;
        if (this.props.initialNickname) {
          this.props.onNicknameChange(newNickname);
        } else {
          this.props.onNicknameSet(newNickname);
        }
      }
    });
  }

  public render() {
    const { isOpen, initialNickname } = this.props;
    const { nickname } = this.state;

    const title = initialNickname ? "Change nickname" : "Welcome";
    const errorMessage = (nickname || nickname == null ? null : "Please enter a nickname")
      || this.state.errorMessage;
    const inputValue = nickname || "";

    const textFieldProps: TextFieldProps = {
      autoFocus: true,
      error: !!errorMessage,
      fullWidth: true,
      helperText: "Please type your nickname",
      id: "nickname",
      label: errorMessage || "Nickname",
      onChange: this.onNicknameUpdate,
      onKeyPress: (ev: React.KeyboardEvent<HTMLElement>) => {
        if (ev.key === "Enter") {
          ev.preventDefault();
          this.onEnter();
        }
      },
      value: inputValue,
    };

    const buttonProps: ButtonProps = {
      color: "primary",
      fullWidth: true,
      id: "submit",
      onClick: (ev: React.MouseEvent<HTMLElement>) => {
        ev.preventDefault();
        this.onEnter();
      },
      variant: "outlined",
    };

    const modalProps: ModalProps = {
      onClose: this.onClose,
      open: isOpen,
    };

    return (
      <div>
        <Modal {...modalProps}>
          <div className={styles.dialogContainer}>
            <Typography variant="h4">{title}</Typography>
            <TextField {...textFieldProps} />
            <br />
            <br />
            <Button {...buttonProps}>Submit</Button>
          </div>
        </Modal>
      </div>
    );
  }

  private onNicknameUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      errorMessage: "",
      nickname: e.currentTarget.value,
    });
  }

  private onEnter = () => {
    const { nickname } = this.state;
    if (nickname) {
      this.props.socketService.setNickname(nickname);
    }
  }

  private onClose = () => {
    const { initialNickname } = this.props;
    if (initialNickname) {
      this.setState({
        nickname: initialNickname,
      });
      this.props.closeDialog();
    }
  }
}
