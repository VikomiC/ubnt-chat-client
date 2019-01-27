export interface User {
  id: number;
  nickname: string;
  avatar: string;
}

export enum Action {
  JOINED,
  KICKOUT,
  LEFT,
  RENAME,
}

export enum Event {
  CONNECT = "connect",
  DISCONNECT = "disconnect",
}

export enum ResponseType {
  Error = "error",
  Success = "success",
}

export interface Nickname {
  type: ResponseType;
  nickname: string;
  content?: string;
}

export enum DisconnectType {
  ConnectionClose = "connectionClose",
  Kickout = "kickout",
  Left = "left",
}

export interface DisconnectMessage {
  type: DisconnectType;
  nickname: string;
}

export interface NewMessage {
  from?: User;
  content?: any;
  action?: Action;
}

export interface Message extends NewMessage {
  id: number;
}
