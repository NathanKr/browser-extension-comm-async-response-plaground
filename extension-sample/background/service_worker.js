console.log("background is loaded ....");

async function createTabAndWaitForReady(url, runOnTabReady) {
  const tab = await chrome.tabs.create({
    url,
  });
  const tabId = tab.id;
  chrome.tabs.onUpdated.addListener(function listener(
    updatedTabId,
    changeInfo
  ) {
    if (updatedTabId === tabId && changeInfo.status === "complete") {
      runOnTabReady(tabId);
      // Remove the event listener
      chrome.tabs.onUpdated.removeListener(listener);
    }
  });
}

async function run() {
  const url = "https://www.linkedin.com/feed/";
  const runOnTabReady = async (tabId) => {
    console.log("before chrome.tabs.sendMessage in background");
    // --- you can also use chrome.tabs.sendMessage with callback instead of promise
    const response = await chrome.tabs.sendMessage(tabId, {
      message: "Hello from the background script!",
    });
    console.log("got response in background");
    console.log(response);
  };

  await createTabAndWaitForReady(url, runOnTabReady);
}



run();
