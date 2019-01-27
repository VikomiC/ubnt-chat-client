import * as socketIo from "socket.io-client";

import {
  Action,
  DisconnectMessage,
  DisconnectType,
  Message,
  NewMessage,
  Nickname,
} from "../model";

const SERVER_URL = "http://localhost:4000";

let idCounter = 0;
let isKickout = false;

type OnMessageCallback = (message: Message) => void;
type OnUsersDisconnectCallback = (disconnectMessage: Message) => void;
type OnNicknameCallback = (nickname: Nickname) => void;
type OnDisconnectCallback = () => void;
type OnKickoutCallback = () => void;
type OnConnectCallback = () => void;

export class SocketService {
  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = socketIo(SERVER_URL);

    this.socket.on("reconnect_attempt", () => {
      // TODO
      /*tslint:disable-next-line:no-console*/
      console.log("reconnect_attempt");
    });
  }

  public connect(): void {
    this.socket.connect();
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  public register(): void {
    this.socket.emit("register");
  }

  public setNickname(nickname: string): void {
    this.socket.emit("nickname", nickname);
  }

  public send(message: NewMessage): void {
    this.socket.emit("message", message);
  }

  public onNickname(onNicknameCallback: OnNicknameCallback) {
    this.socket.on("nickname", (data: Nickname) => {
      onNicknameCallback(data);
    });
  }

  public onMessage(
    onMessageCallback: OnMessageCallback,
    onUsersDisconnectCallback: OnUsersDisconnectCallback,
  ) {
    this.socket.on("message", (data: NewMessage) => {
      const message: Message = {
        id: ++idCounter,
        ...data,
      };
      onMessageCallback(message);
    });
    this.socket.on("user.disconnect", (data: DisconnectMessage) => {
      const disconnectMessage: Message = {
        action: data.type === DisconnectType.Left ? Action.LEFT : Action.KICKOUT,
        from: {
          avatar: "",
          id: 0,
          nickname: data.nickname,
        },
        id: ++idCounter,
      };
      onUsersDisconnectCallback(disconnectMessage);
    });
  }

  public onServerDisconnect(onDisconnectCallback: OnDisconnectCallback) {
    this.socket.on("connect_error", () => {
      onDisconnectCallback();
    });
    this.socket.on("disconnect", () => {
      if (!isKickout) {
        onDisconnectCallback();
      }
    });
  }

  public onKickout(onKickoutCallback: OnKickoutCallback) {
    this.socket.on("kickout", () => {
      isKickout = true;
      onKickoutCallback();
    });
  }

  public onConnect(onConnectCallback: OnConnectCallback) {
    this.socket.on("connect", () => {
      isKickout = false;
      onConnectCallback();
    });
  }
}
