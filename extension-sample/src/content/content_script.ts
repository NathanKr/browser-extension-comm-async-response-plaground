import { PerformTask, handleAsyncSendResponse } from "../lib/async-send-response-reciver";
import { ISendMessage } from "../types/i-send-message";
import { ISendResponse } from "../types/i-send-response";
import { ActionType } from "../types/types";
import { performLongTask1 } from "./tasks";

console.log("content script is loaded ....");

const tasksMap = new Map<ActionType, PerformTask>();
tasksMap.set("Action1", performLongTask1);

// --- i had problem with using chrome types so i ignore it
chrome.runtime.onMessage.addListener(
  (
    request: ISendMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: ISendResponse) => void
  ) => {
    console.log("content script got request !!!!!!!!!!");
    console.log(request);
    console.log(sender);

    return handleAsyncSendResponse(tasksMap, sendResponse, request);
  }
);
