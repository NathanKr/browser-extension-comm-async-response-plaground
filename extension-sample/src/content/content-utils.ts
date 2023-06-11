// --- imported only by content.ts

import { ISendMessage } from "../types/i-send-message";
import { ISendResponse } from "../types/i-send-response";
import { PerformLongTask } from "../types/types";

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

export const performLongTaskActionNotFoundError: PerformLongTask = async (
  request: ISendMessage
): Promise<ISendResponse> => {
  const result: ISendResponse = {
    status: {
      isSuccess: false,
      error: `action not found : ${request.action}`,
    },
  };
  return result;
};


export async function performLongTask1(): Promise<ISendResponse> {
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
    payload: { spanMs, dtBefore, dtAfter },
    status: {
      isSuccess: false,
      error: undefined,
    },
  };
  return result;
}

export interface IProcessWithPromise {
  request: ISendMessage;
  sendResponse: (response: ISendResponse) => void;
  performLongTask: PerformLongTask;
}

export const processWithPromise = (params: IProcessWithPromise) => {
  const { sendResponse, performLongTask, request } = params;

  const complete = (val: unknown): void => {
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
    let resData: ISendResponse = {
      status: {
        isSuccess: false,
        error: undefined,
      },
    };
    try {
      resData = await performLongTask(request);
    } catch (err) {
      resData.status.error = err;
    }

    // Once the task is complete, send the actual response !!!
    resolve(resData);
  });
  p.then(complete).catch((err) => console.error(err));
};
