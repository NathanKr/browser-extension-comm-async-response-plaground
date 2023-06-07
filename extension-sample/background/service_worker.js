console.log("background is loaded ....");

async function createTabAndWaitForReady(url, runOnTabReady) {
  const tab = await chrome.tabs.create({
    url,
  });
  const tabId = tab.id;

  const p = new Promise((resolve) => {
    chrome.tabs.onUpdated.addListener(function listener(
      updatedTabId,
      changeInfo
    ) {
      if (updatedTabId === tabId && changeInfo.status === "complete") {
        // --- await here is not working so i have to use promise
        runOnTabReady(tabId, resolve); 
        // Remove the event listener
        console.log("before onUpdated.removeListener");
        chrome.tabs.onUpdated.removeListener(listener);
      }
    });
  });

  await p;
}

async function run() {
  const url = "https://www.linkedin.com/feed/";
  const runOnTabReady = async (tabId, onComplete) => {
    console.log("start runOnTabReady");
    console.log("before chrome.tabs.sendMessage in background");
    // --- you can also use chrome.tabs.sendMessage with callback instead of promise
    const response = await chrome.tabs.sendMessage(tabId, {
      message: "Hello from the background script!",
    });
    console.log("got response in background");
    console.log(response);
    console.log("end runOnTabReady");
    
    onComplete(); // --- put in the end
  };

  await createTabAndWaitForReady(url, runOnTabReady);
  await createTabAndWaitForReady(url, runOnTabReady);
}

run();
