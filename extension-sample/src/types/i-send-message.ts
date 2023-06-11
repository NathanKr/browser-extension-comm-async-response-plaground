import { ActionType } from "./types";

export interface ISendMessage {
  action: ActionType;
  payload?: object;
}
