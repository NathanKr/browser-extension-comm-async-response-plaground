import { sendMessageBetweenTabCreateRemove } from "../lib/sender-to-content-script";
import { Action } from "../types/e-action";
import { ISendMessage } from "../types/i-send-message";
import { ISendResponse } from "../types/i-send-response";

console.log("background is loaded ....");

//  const url = "https://www.linkedin.com/feed/";
// const url = "https://www.ynet.co.il/home/0,7340,L-8,00.html";
const url = "https://example.com/";

const messages: ISendMessage[] = [
  // {
  //   action: Action.Action1,
  //   payload: "this is args from reciver for Action1",
  // },
  // {
  //   action: Action.Action2,
  //   payload: "this is args from reciver for Action2",
  // },
  {
    action: Action.Action3,
  },
  // {
  //   action: "wrong task",
  // },
];

async function run() {
  // --- perform the task in series !!!!!!!!!!

  for (let index = 0; index < messages.length; index++) {
    const message = messages[index];
    const result: ISendResponse = await sendMessageBetweenTabCreateRemove(
      url,
      message
    );
    console.log(`result on background ${result}`);
    console.log(result);
  }
}

run();
