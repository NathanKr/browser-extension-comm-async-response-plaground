import { ISendMessage } from "../types/i-send-message";
import { ISendResponse } from "../types/i-send-response";
import {
  IProcessWithPromise,
  performLongTask,
  processWithPromise,
} from "./content-utils";
console.log("content script is loaded ....");

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
      performLongTask,
      request
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
