import { PayloadResponse } from "./types";

export interface ISendResponse {
  payload?: PayloadResponse;
  status: { isSuccess: boolean; error?: unknown };
}
