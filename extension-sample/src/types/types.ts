import { ISendMessage } from "./i-send-message";
import { ISendResponse } from "./i-send-response";

export type ActionType = string;
export type PerformLongTask = (request: ISendMessage) => Promise<ISendResponse>;