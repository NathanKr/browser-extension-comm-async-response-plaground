console.log("content script is loaded ....");

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function performLongTask() {
  const sleepTimeMs = 5000;
  const dtBefore = Date.now();
  console.log(`before sleep ${sleepTimeMs}`);
  // --- simulate long task
  await sleep(sleepTimeMs);
  console.log(`after sleep ${sleepTimeMs}`);
  const dtAfter = Date.now();

  return { dtBefore, dtAfter };
}



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("content script got request !!!!!!!!!!");
  console.log(request);
  console.log(sender);

  const complete = (val) =>
    sendResponse({ result: "Operation completed !!!", val });

  // Perform the sleep or long-running task
  const p = new Promise(async (resolve) => {
    const resData = await performLongTask();
    // Once the task is complete, send the actual response !!!
    resolve(resData);
  });
  p.then(complete).catch((err) => console.error(err));

  /* 
   ----
   Note return true; in the listener: 
   this tells the browser that you intend to use the sendResponse argument
   after the listener has returned.
  */

  return true;
});
