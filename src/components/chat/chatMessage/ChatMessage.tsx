import * as React from "react";

import Avatar from "@material-ui/core/Avatar";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

import { Action, Message, User } from "../../../model";

import * as styles from "./ChatMessage.pcss";

interface ChatMessageProps {
    user: User;
    message: Message;
}

export class ChatMessage extends React.PureComponent<ChatMessageProps> {
    public render() {
        const { message: { from, content, action }, user } = this.props;
        if (!from) {
            return null;
        }

        if (action === Action.JOINED || action === Action.RENAME) {
            const fragmentHtml = action === Action.JOINED
                ? <><b>{from.nickname}</b> joined to the chat.</>
                : <><b>{content.previousNickname}</b> is now <b>{content.nickname}</b></>;
            return (
                <ListItem style={{ display: "inline" }}>
                    <Typography gutterBottom align="center">
                        {fragmentHtml}
                    </Typography>
                </ListItem>
            );
        } else if (action === Action.LEFT || action === Action.KICKOUT) {
            const disconnectText = action === Action.LEFT
                ? <><b>{from.nickname}</b> left the chat.</>
                : <><b>{from.nickname}</b> was disconnected due to inactivity.</>;
            return (
                <ListItem style={{ display: "inline" }}>
                    <Typography gutterBottom align="center">
                        {disconnectText}
                    </Typography>
                </ListItem>
            );
        }

        if (from.id === user.id) {
            return (
                <ListItem className={styles.myListItem} style={{ textAlign: "right" }}>
                    <ListItemText primary={from.nickname} secondary={content} />
                    <Avatar src={from.avatar} />
                </ListItem>
            );
        } else {
            return (
                <ListItem className={styles.otherListItem}>
                    <Avatar src={from.avatar} />
                    <ListItemText primary={from.nickname} secondary={content} />
                </ListItem>
            );
        }
    }
}
