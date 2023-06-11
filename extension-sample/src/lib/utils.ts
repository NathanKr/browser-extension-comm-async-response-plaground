import { ISendMessage } from "../types/i-send-message";
import { ISendResponse } from "../types/i-send-response";

export function sendMessageToContentScript(
  tabId: number,
  message: ISendMessage
): Promise<ISendResponse> {
  return chrome.tabs.sendMessage(tabId, message);
}
