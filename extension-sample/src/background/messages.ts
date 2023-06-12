import { Action } from "../types/e-action";
import { ISendMessage } from "../types/i-send-message";

export const message1: ISendMessage = {
  action: Action.Action1,
  payload: "this is args from reciver for Action1",
};

export const message2: ISendMessage = {
  action: Action.Action2,
  payload: "this is args from reciver for Action2",
};

export const message3: ISendMessage = {
  action: Action.Action3,
};

export const message4: ISendMessage = {
  action: "wrong task",
};
