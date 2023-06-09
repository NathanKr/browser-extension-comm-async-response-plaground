console.log("background is loaded ....");

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
async function createTabAndWaitForReadyRunOnTabReadyAndRemoveTab(
  url,
  runOnTabReady
) {
  const tab = await chrome.tabs.create({
    url,
  });
  const tabId = tab.id;
  console.log(`---------- new tab is created : ${tabId}`);

  const p = new Promise((resolve) => {
    chrome.tabs.onUpdated.addListener(function listener(
      updatedTabId,
      changeInfo
    ) {
      if (updatedTabId === tabId && changeInfo.status === "complete") {
        // --- await here is not working so i have to use promise
        runOnTabReady(tabId, resolve);
        // Remove the event listener
        chrome.tabs.onUpdated.removeListener(listener);
      }
    });
  });

  return p;
}

async function run() {
  // const url = "https://www.linkedin.com/feed/";
  const url = "https://www.ynet.co.il/home/0,7340,L-8,00.html";
  const runOnTabReady = async (tabId, onComplete) => {
    console.log("start runOnTabReady");
    // --- you can also use chrome.tabs.sendMessage with callback instead of promise
    const response = await chrome.tabs.sendMessage(tabId, {
      message: "Hello from the background script!",
    });
    console.log("got response in background");
    console.log(response);
    console.log("end runOnTabReady");

    await chrome.tabs.remove(tabId);
    console.log(`------------- tab id ${tabId} is removed`);

    onComplete(response); // --- put in the end
  };

  for (let index = 0; index < 2; index++) {
    const result = await createTabAndWaitForReadyRunOnTabReadyAndRemoveTab(
      url,
      runOnTabReady
    );
    console.log(`result on background ${result}`);
    console.log(result);
  }
}

run();
