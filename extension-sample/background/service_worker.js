console.log("background is loaded ....");

async function run() {
  const tab = await chrome.tabs.create({
    url: "https://www.linkedin.com/feed/",
  });

  const tabId = tab.id;
  // Wait for the tab to finish loading
  chrome.tabs.onUpdated.addListener(function listener(
    updatedTabId,
    changeInfo
  ) {
    if (updatedTabId === tabId && changeInfo.status === "complete") {
      // Tab has finished loading, send a message

      const callback = (response) => {
        console.log("got response in background");
        console.log(response);
      };

      console.log("before chrome.tabs.sendMessage in background");

      chrome.tabs.sendMessage(
        tab.id,
        {
          message: "Hello from the background script!",
        },
        null,
        callback
      );

      // Remove the event listener
      chrome.tabs.onUpdated.removeListener(listener);
    }
  });
}

run();
