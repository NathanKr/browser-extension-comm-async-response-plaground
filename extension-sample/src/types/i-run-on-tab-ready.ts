import { ISendMessage } from "./i-send-message";
import { ISendResponse } from "./i-send-response";

export default interface IRunOnTabReady {
  tabId: number;
  onComplete: (value: ISendResponse) => void;
  message: ISendMessage;
}
