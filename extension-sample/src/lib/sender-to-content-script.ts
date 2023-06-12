import { ISendMessage } from "../types/i-send-message";
import { ISendResponse } from "../types/i-send-response";

interface IRunOnTabReady {
  tabId: number;
  onComplete: (value: ISendResponse) => void;
  message: ISendMessage;
}


export async function sendMessageBetweenTabCreateRemove(
  url: string,
  message: ISendMessage
): Promise<ISendResponse> {
  return createTabAndWaitForReadySendMessageWaitForResponseAndRemoveTab(
    url,
    runOnTabReadyDefault,
    message
  );
}

function sendMessageToContentScript(
  tabId: number,
  message: ISendMessage
): Promise<ISendResponse> {
  return chrome.tabs.sendMessage(tabId, message);
}


/**
 * The following tasks are perfomrd in series !!!!! 
    1.  The background create a tab
    2.  The background send a message to the content script which 
        perform a long processing task and send the datetime at the 
        task start\end back to the background using async sendResponse </li>
    3. The background delete the created tab</li>
 * @param {*} url 
 * @param {*} runOnTabReady 
 */
const runOnTabReadyDefault = async (params: IRunOnTabReady) => {
  const { tabId, message, onComplete } = params;
  console.log("start runOnTabReady");
  // --- you can also use chrome.tabs.sendMessage with callback instead of promise
  const response: ISendResponse = await sendMessageToContentScript(
    tabId,
    message
  );
  console.log("got response in background");
  console.log(response);

  await chrome.tabs.remove(tabId);
  console.log(`------------- tab id ${tabId} is removed`);

  onComplete(response); // --- put in the end
};



async function createTabAndWaitForReadySendMessageWaitForResponseAndRemoveTab(
  url: string,
  runOnTabReady: (params: IRunOnTabReady) => void,
  message: ISendMessage
): Promise<ISendResponse> {
  const tab = await chrome.tabs.create({
    url,
  });
  const tabId = tab.id;
  console.log(`---------- new tab is created : ${tabId}`);

  const p = new Promise<ISendResponse>((resolve) => {
    chrome.tabs.onUpdated.addListener(function listener(
      updatedTabId: number,
      changeInfo: any
    ) {
      if (updatedTabId === tabId && changeInfo.status === "complete") {
        // --- await here is not working so i have to use promise
        runOnTabReady({ tabId, onComplete: resolve, message });
        // Remove the event listener
        chrome.tabs.onUpdated.removeListener(listener);
      }
    });
  });

  return p;
}
