<h2>Introduction</h2>
given a background script sending a message to content script and wait for response. If the content script does not reply withing 0.5 sec i get connection error. So what to do

<h2>Motivation</h2>

<h3>use cases that this repo is not relevant for</h3>
<ul>
<li>If you have tasks that does not return info than this is not important for you because the sender does not need to wait for response</li>
<li>if the sender need the response and reciver reply quickly (until 0.5 sec in content script) using sendResponse than no problem</li>
</ul>

<h3>use cases that this repo is relevant but you have other option</h3>
but if the reciver is content script and processing time is above 0.5 and the reciver need the information than you have a problem.
<p> you can solve this using two messages : start and finish where the reciver send start immidiately in sendResponse and finish via runtime.sendMessage but this require state machine to handle. it is possible but cumbersome<p>

<h3>perfect solution</h3>
if the sender need to wait for the reciver and you do not want to depend on processing time you simply need to make the reciver sendResponse to work asynchronously

<h3>Limitation</h3>
i do not see limitation . Did a test where the reciver - content was processing for almost 50 sec and using a-sync sendResponse deliver the info to the waiting sender


<h2>Synchronization Demo</h2>
The following tasks are perfomrd in series !!!!! and implemented in createTabAndWaitForReadyRunOnTabReadyAndRemoveTab
<ol>
<li>The background create a tab</li>
<li>the content script perform a long processing task ~ 12 sec and send the datetime at the task start\end back to the background using async sendResponse </li>
<li>The background delete the created tab</li>
</ol>

now you can do this :

```ts

await createTabAndWaitForReadyRunOnTabReadyAndRemoveTab
await createTabAndWaitForReadyRunOnTabReadyAndRemoveTab


```

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
  await sleep(1000);
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
