<h2>Motivation</h2>
given a background script sending a message to content script and wait for response. If the content script does not reply withing 0.5 sec i get connection error. So what to do

<h2>Sample flow</h2>
check ver 0.1 and see the problem on this senario : 
<p>background :  create a tab and send a message. first make sure you send message only inside chrome.tabs.onUpdated.addListener</p>
<p>content : recive the message a wait for 1000 ms. during this the connection is closed and i get on the background side an error : 'The message port closed before a response was received.'</p>


<h2>Analysis</h2>
A message sent by the caller - here background must follow a response by the reciver - here the content script. In my sample i sleep for 1 sec and i get the error : may be because chrome want these communication to be short

<h2>synchronouse messaging</h2>
What we actually have in ver 0.1 is synchronously messaging system meaning that the reciver (here the content script) call sendResponse synchronousely thus block until he can send the response. may be this is why it should not take more than 0.5 sec because content script actually is ivoked in the content of it host page and block it. And for content script it is not acceptable. 

```ts

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log("content script got request !!!!!!!!!!");
  console.log(request);
  console.log(sender);

  console.log("before sleep 1000");
  await sleep(1000)
  console.log("after sleep 1000");

  sendResponse({ message: "response from content script" });
});

```

<h2>a-synchronouse messaging</h2>
 Here the reciver call sendResponse a-synchronously thus will not block its execution
<ol>
<li>the reciver return true in chrome.runtime.onMessage.addListener</li>
<li>the reciver create a promise put the long processing there and sendResponse on resolve</li>
</ol>


```ts

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("content script got request !!!!!!!!!!");

  const complete = (val) =>
    sendResponse({ result: "Operation completed !!!", val });

  // Perform the sleep or long-running task
  const p = new Promise(async (resolve) => {
    const resData = await performLongTask();
    // Once the task is complete, send the actual response !!!
    resolve(resData);
  });
  p.then(complete).catch((err) => console.error(err));


  return true;
});


```

<h2>Solution</h2>
use a-synchronouse messaging ALWAYS in particular when the reciver is content secript
