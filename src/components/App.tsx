import * as React from "react";

import AppBar from "@material-ui/core/AppBar";
import Divider from "@material-ui/core/Divider";
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";

import { DisconnectType, User } from "../model";
import { SocketService } from "../services/SocketService";

import { Chat } from "./chat/Chat";
import { DisconnectDialog, DisconnectDialogProps } from "./disconnectDialog/DisconnectDialog";
import { UserDialog, UserDialogProps } from "./userDialog/UserDialog";

import * as styles from "./App.pcss";

const AVATAR_URL = "https://api.adorable.io/avatars/285";

export interface AppProps {
  socketService: SocketService;
}

interface AppState {
  disconnectDialogOpen: boolean;
  userDialogOpen: boolean;
  menuOpen: boolean;
  user?: User;
  anchorEl?: HTMLElement;
  disconnectType?: DisconnectType;
  nicknameError?: string;
}
const getRandomId = (): number => Math.floor(Math.random() * 1000000) + 1;

export class App extends React.Component<AppProps, AppState> {
  public state: AppState = {
    disconnectDialogOpen: false,
    menuOpen: false,
    userDialogOpen: false,
  };

  public componentDidMount() {
    this.setState({
      userDialogOpen: !this.state.user,
    });

    this.props.socketService.onConnect(() => {
      this.setState({
        user: undefined,
      });
    });

    this.props.socketService.onKickout(() => {
      this.setState({
        anchorEl: undefined,
        disconnectDialogOpen: true,
        disconnectType: DisconnectType.Kickout,
        menuOpen: false,
        user: undefined,
        userDialogOpen: false,
      });
    });

    this.props.socketService.onServerDisconnect(() => {
      this.setState({
        anchorEl: undefined,
        disconnectDialogOpen: true,
        disconnectType: DisconnectType.ConnectionClose,
        menuOpen: false,
        userDialogOpen: false,
      });
    });
  }

  public render() {
    const { socketService } = this.props;
    const { user, userDialogOpen, disconnectDialogOpen, disconnectType } = this.state;

    const iconButtonProps: IconButtonProps = {
      className: styles.menuButton,
      color: "inherit",
      onClick: this.openMenu,
    };

    const userDialogProps: UserDialogProps = {
      closeDialog: this.closeUserDialog,
      initialNickname: user != null && user.nickname || undefined,
      isOpen: userDialogOpen,
      onNicknameChange: this.onNicknameChange,
      onNicknameSet: this.onNicknameSet,
      socketService,
    };

    const disconnectDialogProps: DisconnectDialogProps = {
      disconnectType,
      hasUser: !!user,
      isOpen: disconnectDialogOpen,
      onResume: this.resumeChatting,
    };

    const headetText = !disconnectType && user ? "Chat Client" : "Welcome to the Chat Client";

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            {user && <IconButton {...iconButtonProps} aria-label="Menu"><MenuIcon /></IconButton>}
            {user && this.renderMenu()}
            <Typography color="inherit">{headetText}</Typography>
          </Toolbar>
        </AppBar>
        <Chat user={disconnectType ? undefined : user} socketService={socketService} />
        <UserDialog {...userDialogProps} />
        <DisconnectDialog {...disconnectDialogProps} />
      </div>
    );
  }

  private resumeChatting = () => {
    this.props.socketService.connect();
    this.setState({
      disconnectDialogOpen: false,
      disconnectType: undefined,
      user: undefined,
      userDialogOpen: true,
    });
  }

  private openUserDialog = () => {
    this.setState({
      userDialogOpen: true,
    });
    this.closeMenu();
  }

  private closeUserDialog = () => {
    this.setState({
      userDialogOpen: false,
    });
  }

  private openMenu = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({
      anchorEl: event.currentTarget,
      menuOpen: true,
    });
  }

  private closeMenu = () => {
    this.setState({
      anchorEl: undefined,
      menuOpen: false,
    });
  }

  private logout = () => {
    this.setState({
      user: undefined,
    });
    this.props.socketService.disconnect();
    this.closeMenu();
  }

  private onNicknameChange = (nickname: string) => {
    const { user: currentUser } = this.state;

    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        nickname,
      };

      this.setState({
        user: updatedUser,
        userDialogOpen: false,
      });
    }
  }

  private onNicknameSet = (nickname: string) => {
    const randomId = getRandomId();
    const user: User = {
      avatar: `${AVATAR_URL}/${randomId}.png`,
      id: randomId,
      nickname,
    };

    this.setState({
      user,
      userDialogOpen: false,
    });
  }

  private renderMenu() {
    const menuProps: MenuProps = {
      anchorEl: this.state.anchorEl,
      id: "menu",
      onClose: this.closeMenu,
      open: this.state.menuOpen,
    };

    return (
      <Menu {...menuProps}>
        <MenuItem key="changeNickname" onClick={this.openUserDialog}>Change Nickname</MenuItem>
        <Divider />
        <MenuItem key="logout" onClick={this.logout}>Logout</MenuItem>
      </Menu>
    );
  }
}
