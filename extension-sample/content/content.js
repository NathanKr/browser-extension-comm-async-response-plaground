console.log("content script is loaded ....");

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function run(){
  
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log("content script got request !!!!!!!!!!");
  console.log(request);
  console.log(sender);

  console.log("before sleep 1000");
  await sleep(1000)
  console.log("after sleep 1000");

  sendResponse({ message: "response from content script" });
});

// run();


