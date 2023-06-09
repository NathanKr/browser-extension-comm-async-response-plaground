console.log("content script is loaded ....");

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function busy(len) {
  const start = Date.now();
  let s = "";
  for (let index = 0; index < 1000; index++) {
    for (i = 0; i < len; i++) {
      s += toString(i);
    }
    console.log(s.length);
    s = "";
  }

  const end = Date.now();
  console.log(`Execution time: ${end - start} ms`);
}

async function performLongTask() {
  const BASIC =  100000; // this take 3 sec
  // const len = 100000; // this take 2 sec
  // const len = 200000; // this take 9 sec
  // const len = 6*BASIC; // this take 46 sec
  const len = 1*BASIC; 


  const dtBefore = Date.now();
  console.log(`before long operation`);
  // --- simulate long task
  busy(len);
  console.log(`after long operation`);
  const dtAfter = Date.now();
  const spanMs = dtAfter - dtBefore;

  return { spanMs, dtBefore, dtAfter };
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
