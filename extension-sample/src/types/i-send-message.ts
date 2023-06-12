import { ActionType, PayloadMessage } from "./types";

export interface ISendMessage {
  action: ActionType;
  payload?: PayloadMessage;
}
