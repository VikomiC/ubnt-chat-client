import * as React from "react";

import Button, { ButtonProps } from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";

import { DisconnectType } from "../../model";

import * as styles from "./DisconnectDialog.pcss";

export interface DisconnectDialogProps {
  isOpen: boolean;
  hasUser: boolean;
  onResume: () => void;
  disconnectType?: DisconnectType;
}

export class DisconnectDialog extends React.PureComponent<DisconnectDialogProps> {
  public render() {
    const { isOpen, hasUser, disconnectType, onResume } = this.props;

    const buttonProps: ButtonProps = {
      color: "primary",
      fullWidth: true,
      id: "submit",
      onClick: onResume,
      variant: "outlined",
    };

    return (
      <div>
        <Modal open={isOpen}>
          <div className={styles.dialogContainer}>
            <Typography variant="h4">Disconnected</Typography>
            <Typography variant="subtitle1">{this.getDisconnectMessage(hasUser, disconnectType)}</Typography>
            <br />
            <br />
            <Button {...buttonProps}>Resume</Button>
          </div>
        </Modal>
      </div>
    );
  }

  private getDisconnectMessage = (hasUser: boolean, disconnectType?: DisconnectType) => {
    switch (disconnectType) {
      case DisconnectType.Kickout:
        return "Disconnected by the server due to inactivity.";
      case DisconnectType.ConnectionClose:
        return hasUser ? "Server unavailable." : "Connection closed.";
      default:
        return "";
    }
  }
}
