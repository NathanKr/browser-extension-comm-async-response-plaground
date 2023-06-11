export interface ISendResponse {
  payload?: object;
  status: { isSuccess: boolean; error?: unknown };
}
