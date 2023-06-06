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
  const runOnTabReady = (tabId) => {
    const callback = (response) => {
      console.log("got response in background");
      console.log(response);
    };

    console.log("before chrome.tabs.sendMessage in background");

    chrome.tabs.sendMessage(
      tabId,
      {
        message: "Hello from the background script!",
      },
      null,
      callback
    );
  };
  await createTabAndWaitForReady(url, runOnTabReady);

}

run();
