import { ISendMessage } from "../types/i-send-message";
import { ISendResponse } from "../types/i-send-response";
import { ActionType } from "../types/types";

/**
 * This is the ONLY exported function
 * Used by the reciver that want to send response asynchronously
 * It is critically important for content script
 * May be also used by background \ popup UI
 * @param tasksMap 
 * @param sendResponse 
 * @param request 
 * @returns 
 */
export function handleAsyncSendResponse(
  tasksMap: TasksMap,
  sendResponse: (response: ISendResponse) => void,
  request: ISendMessage
) {
  const params: IProcessWithPromise = {
    sendResponse,
    performTask: getPerformTask(tasksMap, request.action),
    request,
  };

  /*
       do not await !!!!!!!!!!
       return true at the end will signal sendResponse later
      */
  processWithPromise(params);

  /*
     ----
     Note return true; in the listener:
     this tells the browser that you intend to use the sendResponse argument
     after the listener has returned.
    */
  return true;
}

export type PerformTask = (request: ISendMessage) => Promise<ISendResponse>;
export type TasksMap =  Map<ActionType, PerformTask>;


interface IProcessWithPromise {
  request: ISendMessage;
  sendResponse: (response: ISendResponse) => void;
  performTask: PerformTask;
}

const performTaskActionNotFoundError: PerformTask = async (
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

function getPerformTask(tasksMap: TasksMap, action: ActionType): PerformTask {
  const func = tasksMap.get(action);

  return func ?? performTaskActionNotFoundError;
}

const processWithPromise = (params: IProcessWithPromise) => {
  const { sendResponse, performTask, request } = params;

  const onTaskComplete = (response: ISendResponse): void => {
    sendResponse(response);
  };

  // Perform the task which can be short or sleep or long-running
  const promisePerformTask = new Promise<ISendResponse>(async (resolve) => {
    let response: ISendResponse = {
      status: {
        isSuccess: false,
        error: undefined,
      },
    };
    try {
      response = await performTask(request);
    } catch (err) {
      response.status.error = {err , type : 'exception'};
    }

    // Once the task is complete, send the actual response !!!
    resolve(response);
  });
  promisePerformTask.then(onTaskComplete).catch((err) => console.error(err));
};
