import { sendMessageBetweenTabCreateRemove } from "../lib/sender-to-content-script";
import { ISendMessage } from "../types/i-send-message";
import { ISendResponse } from "../types/i-send-response";

console.log("background is loaded ....");

// const url = "https://www.linkedin.com/feed/";
// const url = "https://www.ynet.co.il/home/0,7340,L-8,00.html";
const url = "https://example.com/";

async function run() {
  // --- perform the task in series !!!!!!!!!!
  const message: ISendMessage = {
    action: "Action1",
  };

  for (let index = 0; index < 2; index++) {
    const result: ISendResponse = await sendMessageBetweenTabCreateRemove(
      url,
      message
    );
    console.log(`result on background ${result}`);
    console.log(result);
  }
}

run();
