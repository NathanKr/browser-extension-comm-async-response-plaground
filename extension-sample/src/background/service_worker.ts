console.log("background is loaded ....");

interface IRunOnTabReady {
  tabId: number;
  onComplete: (value: unknown) => void;
  messageObj: object;
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
async function createTabAndWaitForReadySendMessageWaitForResponseAndRemoveTab(
  url: string,
  runOnTabReady: (params: IRunOnTabReady) => void,
  messageObj: object
) {
  const tab = await chrome.tabs.create({
    url,
  });
  const tabId = tab.id;
  console.log(`---------- new tab is created : ${tabId}`);

  const p = new Promise((resolve) => {
    chrome.tabs.onUpdated.addListener(function listener(
      updatedTabId : number,
      changeInfo : any
    ) {
      if (updatedTabId === tabId && changeInfo.status === "complete") {
        // --- await here is not working so i have to use promise
        runOnTabReady({ tabId, onComplete: resolve, messageObj });
        // Remove the event listener
        chrome.tabs.onUpdated.removeListener(listener);
      }
    });
  });

  return p;
}

// const url = "https://www.linkedin.com/feed/";
// const url = "https://www.ynet.co.il/home/0,7340,L-8,00.html";
const url = "https://example.com/";
const runOnTabReady = async (params: IRunOnTabReady) => {
  const { tabId, messageObj, onComplete } = params;
  console.log("start runOnTabReady");
  // --- you can also use chrome.tabs.sendMessage with callback instead of promise
  const response = await chrome.tabs.sendMessage(tabId, messageObj);
  console.log("got response in background");
  console.log(response);

  await chrome.tabs.remove(tabId);
  console.log(`------------- tab id ${tabId} is removed`);

  onComplete(response); // --- put in the end
};

async function run() {
  // --- perform the task in series !!!!!!!!!!
  const messageObj = {
    message: "Hello from the background script!",
  };

  for (let index = 0; index < 2; index++) {
    const result =
      await createTabAndWaitForReadySendMessageWaitForResponseAndRemoveTab(
        url,
        runOnTabReady,
        messageObj
      );
    console.log(`result on background ${result}`);
    console.log(result);
  }
}

run();
