import { sendMessageBetweenTabCreateRemove } from "./utils";

console.log("background is loaded ....");

// const url = "https://www.linkedin.com/feed/";
// const url = "https://www.ynet.co.il/home/0,7340,L-8,00.html";
const url = "https://example.com/";

async function run() {
  // --- perform the task in series !!!!!!!!!!
  const messageObj = {
    message: "Hello from the background script!",
  };

  for (let index = 0; index < 2; index++) {
    const result = await sendMessageBetweenTabCreateRemove(url, messageObj);
    console.log(`result on background ${result}`);
    console.log(result);
  }
}

run();
