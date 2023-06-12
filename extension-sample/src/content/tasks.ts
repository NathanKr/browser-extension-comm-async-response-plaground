// --- imported only by content.ts
import { PerformTask } from "../lib/async-send-response-reciver";
import { ISendMessage } from "../types/i-send-message";
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

export const performLongTask2: PerformTask = async (
  request: ISendMessage
): Promise<ISendResponse> => {
  const BASIC = 100000; // this take 3 sec
  // const len = 100000; // this take 2 sec
  // const len = 200000; // this take 9 sec
  // const len = 6*BASIC; // this take 46 sec
  const len = 2 * BASIC;

  const dtBefore = Date.now();
  console.log(`before long operation`);
  // --- simulate long task
  busy(len);
  console.log(`after long operation`);
  const dtAfter = Date.now();
  const spanMs = dtAfter - dtBefore;

  const result: ISendResponse = {
    payload: { spanMs, argsFromSender: request },
    status: {
      isSuccess: true,
      error: undefined,
    },
  };
  return result;
};

export const performLongTaskThrow: PerformTask = async (
  request: ISendMessage
): Promise<ISendResponse> => {

  throw Error('Can yo catch this');
}

export const performLongTask1: PerformTask = async (
  request: ISendMessage
): Promise<ISendResponse> => {
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

  const result: ISendResponse = {
    payload: { spanMs, dtBefore, dtAfter, argsFromSender: request },
    status: {
      isSuccess: true,
      error: undefined,
    },
  };
  return result;
};
