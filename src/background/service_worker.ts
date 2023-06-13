import { sendMessageToContentBetweenTabCreateRemove } from "../lib/sender-to-content-script";
import { ISendMessage } from "../types/i-send-message";
import { ISendResponse } from "../types/i-send-response";
import { message1, message2, message3, message4 } from "./messages";

console.log("background is loaded ....");

//  const url = "https://www.linkedin.com/feed/";
// const url = "https://www.ynet.co.il/home/0,7340,L-8,00.html";
const url = "https://example.com/";

const messages: ISendMessage[] = [message1, message2, message3, message4];

async function run() {
  // --- perform the task in series !!!!!!!!!!

  for (let index = 0; index < messages.length; index++) {
    const message = messages[index];
    const result: ISendResponse =
      await sendMessageToContentBetweenTabCreateRemove(url, message);
    console.log(`result on background ${result}`);
    console.log(result);
  }
}

run();
