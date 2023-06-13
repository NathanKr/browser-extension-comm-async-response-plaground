<h2>Motivation</h2>
To have a solution that i can use for inner communication in a browser extension project in general and 'Linkedin Marketing Automation Tool' in particular

<h2>Spec</h2>
perform the following tasks 
<ul>
<li>view profiles - long processing task</li>
<li>send message to profiles - long processing task</li>
<li>process poll - medium processing task (for fetching the voters per option)</li>
<li>process post</li>
</ul>

<h2>Constraints and solutions</h2>
<table>
  <tr>
    <th>Constraint</th>
    <th>Solution</th>
  </tr>
  <tr>
    <td>c1 : use type safe language</td>
    <td>typescript without any</td>
  </tr>
  <tr>
    <td>c2 : content script has limitations : <ol><li>regular communication with content script via sync sendResponse is closed after ~0.5 sec </li><li>not all chrome api is supported </li><li>import issues</li> </td>
    <td><ol><li>use a-sync sendResponse check handleAsyncSendResponse</li><li>minimal code in content script</li><li>send message only when the page is ready using chrome.tabs.onUpdated</li></ol></td></ol>
  </tr>
  <tr>
    <td>c3 : popup ui is close when active tab is opened</td>
    <td>create a tab using active : false</td>
  </tr>
  <tr>
    <td>c4 : tasks must be perform in series to prevent content script overloading and achive linear order</td>
    <td>use synchronous message Queue in the background service worker</td>
  </tr>
  <tr>
    <td>c5 : bot detection : tasks must be perform in a human maner to prevent from being discovered. in particular some taks require long pause e.g. send message require 4 minute</td>
    <td>on top of running tasks in series (c4) in the message queue the scheduler \ dispatcher will take care of delay between tasks</td>
  </tr>
  <tr>
    <td>c6 : recovery (phase 2) : the user can close the browser during processing , re open and it will continue from there </td>
    <td>write the queue to local storage (TBD which) on every change and load when start. just like in check your tech skills - when the user close the app in the middle of a quiz</td>
  </tr>
  <tr>
    <td>c7 : UX : the user should be able to add tasks and view result via easy to develop UI (react based is first option)</td>
    <td><p>UI will be implemented on popup UI which is not closed on eveey tab created via active : false</p> <p>add task and view results will be by means of chrome.runtime.sendMessage with immidiate response from message queue in the background. once task finish a message will be sent via chrome.runtime.sendMessage  (by who queue \ dispatch \ scheduler ??)</p></td>
  </tr>
  <tr>
    <td>c8 : UX\visibility : the user should be able to see task start \ progress \ end for long tasks</td>
    <td>see c7</td>
  </tr>
  <tr>
    <td>c9 : UX : the user should be able to download to disk csv based tasks results like voters per option in poll results</td>
    <td>i all ready have a <a href='https://github.com/NathanKr/next.js-download-file-poc-private'>working poc</a> for this . This requires a server</td>
  </tr>
  <tr>
    <td>c10 (phase 3) : all tasks definition and result should be stored in a db</td>
    <td>probably mongo db atlas which i all ready have</td>
  </tr>
 </table>

<h2>Assumptions</h2>
<ul>
<li>The popup ui is open during all tasks (phase 1 , will be removed in later phases)</li>
</ul>

<h2>Design components</h2>
<ul>
<li>a-sync send request in the content script - async-send-response-reciver.ts</li>
<li>synchronoise message queue \ task queue (both ??) in the background service worker - sender-to-content-script.ts</li>
<li>task scheduler</li>
<li>task dispatcher</li>
</ul>

<h2>open issues</h2>
<ul>
<li>how the schduler will operate ? via setInterval or other wise</li>
<ul>

<h2>todos</h2>
<ul>
<li>send message on enqueue , dqueue by the dispatcher</li>
<li>send message on start \ finish task - by who</li>
<li>add react to popup ui</li>
<li>add message schema : queue and a-sync response</li>
</ul>



<h2>references</h2>
<ul>
<li>this version is built over <a href='https://github.com/NathanKr/extension-comm-async-response-poc-private/releases/tag/0.47'>extension-comm-async-response-poc-private (ver 0.47)</a>
</li>
<li><a href='https://github.com/NathanKr/next.js-download-file-poc-private'>working poc to download file</a></li>
<li><a href='https://github.com/NathanKr/my-event-loop-poc-private'>poc of event loop with task queue \ scheduler \ dispatcher</a></li>
</ul>
