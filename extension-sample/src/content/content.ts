import { ISendMessage } from "../types/i-send-message";
import { ISendResponse } from "../types/i-send-response";
import { ActionType, PerformLongTask } from "../types/types";
import {
  IProcessWithPromise,
  performLongTask1,
  performLongTaskActionNotFoundError,
  processWithPromise,
} from "./content-utils";
console.log("content script is loaded ....");

const map = new Map<ActionType, PerformLongTask>();

function getPerfromLongTask(action: ActionType): PerformLongTask {
  map.set("Action1", performLongTask1);
  const func = map.get(action);

  return func??performLongTaskActionNotFoundError
}

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

    const params: IProcessWithPromise = {
      sendResponse,
      performLongTask: getPerfromLongTask(request.action),
      request,
    };

    // do not await !!!!!!!!!! , return true will signal sendResponse later
    processWithPromise(params);

    /* 
   ----
   Note return true; in the listener: 
   this tells the browser that you intend to use the sendResponse argument
   after the listener has returned.
  */

    return true;
  }
);
