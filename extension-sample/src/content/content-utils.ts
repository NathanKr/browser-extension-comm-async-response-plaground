// --- imported only by content.ts

import { ISendResponse } from "../types/i-send-response";

function busy(len: number): void {
  const start = Date.now();
  let s = "";
  for (let index = 0; index < 1000; index++) {
    for (let i = 0; i < len; i++) {
      s += i.toString();
    }
    console.log(s.length);
    s = "";
  }

  const end = Date.now();
  console.log(`Execution time: ${end - start} ms`);
}

export async function performLongTask(): Promise<unknown> {
  const BASIC = 100000; // this take 3 sec
  // const len = 100000; // this take 2 sec
  // const len = 200000; // this take 9 sec
  // const len = 6*BASIC; // this take 46 sec
  const len = 1 * BASIC;

  const dtBefore = Date.now();
  console.log(`before long operation`);
  // --- simulate long task
  busy(len);
  console.log(`after long operation`);
  const dtAfter = Date.now();
  const spanMs = dtAfter - dtBefore;

  return { spanMs, dtBefore, dtAfter };
}

export interface IProcessWithPromise {
  sendResponse: (response: ISendResponse) => void;
  performLongTask(): Promise<unknown>;
}

export const processWithPromise = (params: IProcessWithPromise) => {
  const { sendResponse, performLongTask } = params;

  const complete = (val: unknown) => {
    const response: ISendResponse = {
      payload: { result: "Operation completed !!!", val },
      status: {
        isSuccess: true,
        error: undefined,
      },
    };
    sendResponse(response);
  };

  // Perform the sleep or long-running task
  const p = new Promise(async (resolve) => {
    const resData = await performLongTask();
    // Once the task is complete, send the actual response !!!
    resolve(resData);
  });
  p.then(complete).catch((err) => console.error(err));
};
