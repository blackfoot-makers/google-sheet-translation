export type SyncOptionsType = {
  spreadSheetId: string;
  pathMessages: string;
  googleApiKey: string;
  tabIndex?: number;
}

export type JSONMessageType = {
  [key: string]: string;
}

export type MessagesType = {
  [key: string]: JSONMessageType;
}
